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

  async buscarApostasDoApostadorNoCampeonatoV2(
    campeonatoId: number,
    apostadorId: number,
  ): Promise<any[]> {
    const apostas = await this.apostaRepository.find({
      where: {
        campeonatoId,
        apostadorId,
      },
      relations: ["campeonato", "apostador", "rodadas", "rodadas.rodada"],
    });

    // Buscar todas as exceções do campeonato
    const excecoes = await this.dataSource.getRepository(Excecao).find({
      where: { campeonatoId },
    });

    // Cache para valores ajustados por rodada
    const valoresPorRodada = new Map<number, { ajustado: number; premio: number }>();

    // Filtrar e enriquecer apostas
    const apostasProcessadas = await Promise.all(
      apostas.map(async (aposta) => {
        // Buscar cavalos do grupo
        const cavalosDoGrupo = await this.dataSource
          .getRepository(CavaloCampeonato)
          .find({
            where: {
              campeonatoId,
              grupoId: aposta.grupoId,
            },
            relations: ["cavalo"],
            order: { id: "ASC" },
          });

        // Buscar exceções deste grupo
        const excecoesDoGrupo = excecoes.filter(
          (e) => e.grupoId === aposta.grupoId,
        );

        // Filtrar cavalos disponíveis
        const cavalosDisponiveis = cavalosDoGrupo.filter(
          (cavalo) =>
            !excecoesDoGrupo.some((exc) => exc.cavaloId === cavalo.cavaloId),
        );

        // Se não tem cavalos disponíveis, retorna null (será filtrado depois)
        if (cavalosDisponiveis.length === 0) {
          return null;
        }

        // Formatar string de cavalos
        const nomes = cavalosDisponiveis
          .map((cc) => cc.cavalo?.nome || "")
          .filter((nome) => nome);
        const cavalosString =
          cavalosDoGrupo.length > 0
            ? `${cavalosDoGrupo[0].numeroPareo} - ${nomes.join(" - ")}`
            : "";

        // Calcular valores ajustados da rodada
        const rodada = aposta.rodadas;
        if (!rodada) {
          return {
            id: aposta.id,
            campeonatoId: aposta.campeonatoId,
            campeonato: aposta.campeonato,
            apostadorId: aposta.apostadorId,
            apostador: aposta.apostador,
            total: aposta.total,
            valorUnitario: aposta.valorUnitario,
            porcentagem: aposta.porcentagem,
            rodadasId: aposta.rodadasId,
            rodadas: null,
            grupoId: aposta.grupoId,
            cavalos: cavalosString,
          };
        }

        // Verificar se já calculamos os valores desta rodada
        if (!valoresPorRodada.has(rodada.id)) {
          // Buscar todas as apostas desta rodada para calcular deduções
          const apostasRodada = await this.apostaRepository.find({
            where: {
              campeonatoId,
              rodadasId: rodada.id,
            },
          });

          // Calcular valor total a deduzir (usar Set para evitar duplicatas por grupo)
          const gruposProcessados = new Set<number>();
          let valorDeduzido = 0;

          for (const apostaRodada of apostasRodada) {
            // Pular se já processamos este grupo
            if (gruposProcessados.has(apostaRodada.grupoId!)) {
              continue;
            }
            gruposProcessados.add(apostaRodada.grupoId!);

            const cavalosGrupo = await this.dataSource
              .getRepository(CavaloCampeonato)
              .find({
                where: {
                  campeonatoId,
                  grupoId: apostaRodada.grupoId,
                },
              });

            const excecoesGrupo = excecoes.filter(
              (e) => e.grupoId === apostaRodada.grupoId,
            );

            const disponiveis = cavalosGrupo.filter(
              (c) => !excecoesGrupo.some((exc) => exc.cavaloId === c.cavaloId),
            );

            // Só deduz se não tiver nenhum cavalo disponível
            if (disponiveis.length === 0 && cavalosGrupo.length > 0) {
              // Somar TODAS as apostas deste grupo
              const apostasDoGrupo = apostasRodada.filter(
                (a) => a.grupoId === apostaRodada.grupoId,
              );
              for (const apostaDoGrupo of apostasDoGrupo) {
                valorDeduzido += Number(apostaDoGrupo.valorUnitario || 0);
              }
            }
          }

          // Calcular valores ajustados
          const valorRodadaOriginal = Number(rodada.valorRodada || 0);
          const valorRodadaAjustado = valorRodadaOriginal - valorDeduzido;
          const porcentagem = Number(rodada.porcentagem || 0);
          const valorPremioAjustado =
            valorRodadaAjustado - (valorRodadaAjustado * porcentagem) / 100;

          // Armazenar no cache
          valoresPorRodada.set(rodada.id, {
            ajustado: valorRodadaAjustado,
            premio: valorPremioAjustado,
          });
        }

        // Recuperar valores do cache
        const valores = valoresPorRodada.get(rodada.id)!;
        
        return {
          id: aposta.id,
          campeonatoId: aposta.campeonatoId,
          campeonato: aposta.campeonato,
          apostadorId: aposta.apostadorId,
          apostador: aposta.apostador,
          total: aposta.total,
          valorUnitario: aposta.valorUnitario,
          porcentagem: aposta.porcentagem,
          rodadasId: aposta.rodadasId,
          rodadas: {
            id: rodada.id,
            campeonatoId: rodada.campeonatoId,
            valorRodada: valores.ajustado.toFixed(2),
            porcentagem: rodada.porcentagem,
            rodadaId: rodada.rodadaId,
            rodada: rodada.rodada,
            valorPremio: valores.premio.toFixed(2),
            tipoId: rodada.tipoId,
          },
          grupoId: aposta.grupoId,
          cavalos: cavalosString,
        };
      }),
    );

    // Filtrar apostas nulas (sem cavalos disponíveis)
    return apostasProcessadas.filter((aposta) => aposta !== null);
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
