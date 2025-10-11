import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Campeonato } from "../entity/campeonato.entity";
import { Apostador } from "../entity/apostador.entity";
import { Aposta } from "../entity/aposta.entity";
import { CavaloCampeonato } from "../entity/cavalo-campeonato.entity";
import { Excecao } from "../entity/excecao.entity";

@Injectable()
export class CampeonatoService {
  constructor(
    @InjectRepository(Campeonato)
    private campeonatoRepository: Repository<Campeonato>,
    @InjectRepository(Apostador)
    private apostadorRepository: Repository<Apostador>,
    @InjectRepository(Aposta)
    private apostaRepository: Repository<Aposta>,
    private dataSource: DataSource,
  ) {}

  async buscarTodos(): Promise<Campeonato[]> {
    return await this.campeonatoRepository.find();
  }

  async buscarPorId(id: number): Promise<Campeonato | null> {
    const campeonato = await this.campeonatoRepository.findOne({
      where: { id },
    });
    if (!campeonato) {
      throw new NotFoundException(`Campeonato com id ${id} não encontrado`);
    }
    return campeonato;
  }

  async criar(campeonato: Campeonato): Promise<Campeonato> {
    return await this.campeonatoRepository.save(campeonato);
  }

  async buscarApostadoresDoCampeonato(
    campeonatoId: number,
  ): Promise<Apostador[]> {
    const apostadores = await this.apostadorRepository
      .createQueryBuilder("apostador")
      .innerJoin("apostador.apostas", "aposta")
      .where("aposta.campeonatoId = :campeonatoId", { campeonatoId })
      .distinct(true)
      .getMany();

    return apostadores;
  }

  async buscarApostasDoApostadorNoCampeonato(
    campeonatoId: number,
    apostadorId: number,
  ): Promise<any[]> {
    const apostas = await this.apostaRepository.find({
      where: {
        campeonatoId,
        apostadorId,
      },
      relations: ["campeonato", "rodadas", "rodadas.rodada"],
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
