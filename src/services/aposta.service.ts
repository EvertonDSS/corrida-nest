import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateApostaDto } from "src/dto/criar-aposta.dto";
import { Aposta } from "src/entity/aposta.entity";
import { Repository, DataSource } from "typeorm";
import { CavaloCampeonato } from "src/entity/cavalo-campeonato.entity";
import { Excecao } from "src/entity/excecao.entity";

@Injectable()
export class ApostaService {
  constructor(
    @InjectRepository(Aposta)
    private apostaRepository: Repository<Aposta>,
    private dataSource: DataSource,
  ) {}

  async buscarTodos(): Promise<any[]> {
    const apostas = await this.apostaRepository.find({
      relations: [
        "campeonato",
        "apostador",
        "rodadas",
        "rodadas.rodada",
      ],
    });

    // Enriquecer cada aposta com informações dos cavalos filtrados por exceções
    return await Promise.all(
      apostas.map(async (aposta) => {
        const cavalosInfo = await this.buscarCavalosDoGrupo(
          aposta.campeonatoId!,
          aposta.grupoId!,
        );
        return {
          ...aposta,
          cavalos: cavalosInfo,
        };
      }),
    );
  }

  async buscarPorId(id: number): Promise<any | null> {
    const aposta = await this.apostaRepository.findOne({
      where: { id },
      relations: [
        "campeonato",
        "apostador",
        "rodadas",
        "rodadas.rodada",
      ],
    });

    if (!aposta) return null;

    // Enriquecer com informações dos cavalos filtrados por exceções
    const cavalosInfo = await this.buscarCavalosDoGrupo(
      aposta.campeonatoId!,
      aposta.grupoId!,
    );

    return {
      ...aposta,
      cavalos: cavalosInfo,
    };
  }

  async criar(dto: CreateApostaDto) {
    const aposta = new Aposta();
    aposta.grupoId = dto.grupoId;
    aposta.campeonatoId = dto.campeonatoId;
    aposta.apostadorId = dto.apostadorId;
    aposta.total = this.calcularPorcentagem(
      dto.porcentagem || 0,
      dto.total || 0,
    );
    aposta.valorUnitario = this.calcularPorcentagem(
      dto.porcentagem || 0,
      dto.valorUnitario || 0,
    );
    aposta.porcentagem = dto.porcentagem;
    aposta.rodadasId = dto.rodadasId;
    return this.apostaRepository.save(aposta);
  }

  async atualizar(aposta: Aposta): Promise<Aposta> {
    return await this.apostaRepository.save(aposta);
  }

  async deletar(id: number): Promise<void> {
    await this.apostaRepository.delete(id);
  }

  calcularPorcentagem(porcentagem: number, total: number): number {
    return (porcentagem * total) / 100;
  }

  private async buscarCavalosDoGrupo(
    campeonatoId: number,
    grupoId: number,
  ): Promise<string | null> {
    if (!campeonatoId || !grupoId) return null;

    // Buscar cavalos do grupo
    const cavalos = await this.dataSource.getRepository(CavaloCampeonato).find({
      where: { campeonatoId, grupoId },
      relations: ["cavalo"],
      order: { id: "ASC" },
    });

    if (!cavalos || cavalos.length === 0) return null;

    // Buscar exceções do grupo
    const excecoes = await this.dataSource.getRepository(Excecao).find({
      where: { campeonatoId, grupoId },
    });

    const cavalosExcluidos = excecoes.map((e) => e.cavaloId);

    // Filtrar cavalos removidos por exceções
    const cavalosFiltrados = cavalos.filter(
      (cc) => cc.cavaloId && !cavalosExcluidos.includes(cc.cavaloId),
    );

    if (cavalosFiltrados.length === 0) return "Nenhum cavalo disponível";

    // Retornar nomes dos cavalos concatenados
    const nomes = cavalosFiltrados
      .map((cc) => cc.cavalo?.nome || "")
      .filter((nome) => nome);

    return `${cavalos[0].numeroPareo} - ${nomes.join(" - ")}`;
  }
}
