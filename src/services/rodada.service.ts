import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Rodada } from "../entity/rodada.entity";
import { Rodadas } from "src/entity/rodadas.entity";
import { Aposta } from "../entity/aposta.entity";
import { Excecao } from "../entity/excecao.entity";
import { CavaloCampeonato } from "../entity/cavalo-campeonato.entity";

@Injectable()
export class RodadaService {
  constructor(
    @InjectRepository(Rodada)
    private rodadaRepository: Repository<Rodada>,
    @InjectRepository(Rodadas)
    private rodadasRepository: Repository<Rodadas>,
    private dataSource: DataSource,
  ) {}

  async buscarTodos(): Promise<Rodada[]> {
    return await this.rodadaRepository.find();
  }

  async buscarPorId(id: number): Promise<Rodada | null> {
    const rodada = await this.rodadaRepository.findOne({ where: { id } });
    if (!rodada) {
      throw new NotFoundException(`Rodada com id ${id} não encontrada`);
    }
    return rodada;
  }

  async criar(rodada: Rodada): Promise<Rodada> {
    return await this.rodadaRepository.save(rodada);
  }

  async criarPorCampeonato(rodadas: Rodadas) {
    rodadas.calcularValorPremio();
    return await this.rodadasRepository.save(rodadas);
  }

  async buscarPorCampeonato(): Promise<Rodadas[]> {
    const rodadas = await this.rodadasRepository.find({
      relations: ["rodada", "campeonato"],
    });
    if (!rodadas) {
      throw new NotFoundException(`Rodadas não encontradas`);
    }
    return rodadas;
  }

  async buscarRodadasPorCampeonatoId(campeonatoId: number): Promise<{
    nomeCampeonato: string;
    rodadas: { id: number; nomeRodada: string }[];
  }> {
    const rodadas = await this.rodadasRepository.find({
      where: { campeonatoId },
      relations: ["rodada", "campeonato"],
    });

    if (!rodadas || rodadas.length === 0) {
      throw new NotFoundException(
        `Rodadas não encontradas para o campeonato ${campeonatoId}`,
      );
    }

    const nomeCampeonato = rodadas[0].campeonato.nome || "";

    const rodadasFormatadas = rodadas.map((rodada) => ({
      id: rodada.rodada.id,
      nomeRodada: rodada.rodada.nomeRodada || "",
    }));

    return {
      nomeCampeonato,
      rodadas: rodadasFormatadas,
    };
  }

  async buscarRodadasPorCampeonato(campeonatoId: number): Promise<Rodadas[]> {
    const rodadas = await this.rodadasRepository.find({
      where: { campeonatoId },
      relations: ["rodada", "campeonato"],
    });

    if (!rodadas || rodadas.length === 0) {
      throw new NotFoundException(
        `Rodadas não encontradas para o campeonato ${campeonatoId}`,
      );
    }

    return rodadas;
  }

  async buscarRodadasComExcecoesCalculadas(campeonatoId: number): Promise<any[]> {
    // Buscar rodadas do campeonato
    const rodadas = await this.rodadasRepository.find({
      where: { campeonatoId },
      relations: ["rodada", "campeonato"],
    });

    if (!rodadas || rodadas.length === 0) {
      throw new NotFoundException(
        `Rodadas não encontradas para o campeonato ${campeonatoId}`,
      );
    }

    // Para cada rodada, calcular os valores com exceções
    const rodadasCalculadas = await Promise.all(
      rodadas.map(async (rodada) => {
        // Buscar todas as apostas desta rodada
        const apostas = await this.dataSource.getRepository(Aposta).find({
          where: {
            campeonatoId,
            rodadasId: rodada.id,
          },
        });

        // Buscar todas as exceções do campeonato
        const excecoes = await this.dataSource.getRepository(Excecao).find({
          where: { campeonatoId },
        });

        // Calcular valor a deduzir por exceções
        let valorDeduzido = 0;
        const apostasAfetadas: any[] = [];

        for (const aposta of apostas) {
          // Buscar todos os cavalos do grupo
          const cavalosDoGrupo = await this.dataSource
            .getRepository(CavaloCampeonato)
            .find({
              where: {
                campeonatoId,
                grupoId: aposta.grupoId,
              },
            });

          // Buscar exceções deste grupo
          const excecoesDoGrupo = excecoes.filter(
            (e) => e.grupoId === aposta.grupoId,
          );

          // Filtrar cavalos disponíveis (excluindo os que têm exceção)
          const cavalosDisponiveis = cavalosDoGrupo.filter(
            (cavalo) =>
              !excecoesDoGrupo.some((exc) => exc.cavaloId === cavalo.cavaloId),
          );

          // SÓ DEDUZ SE NÃO TIVER NENHUM CAVALO DISPONÍVEL
          if (cavalosDisponiveis.length === 0 && cavalosDoGrupo.length > 0) {
            valorDeduzido += Number(aposta.valorUnitario || 0);
            apostasAfetadas.push({
              apostadorId: aposta.apostadorId,
              grupoId: aposta.grupoId,
              valorUnitario: aposta.valorUnitario,
              totalCavalos: cavalosDoGrupo.length,
              cavalosDisponiveis: 0,
            });
          }
        }

        // Calcular novos valores
        const valorRodadaOriginal = Number(rodada.valorRodada || 0);
        const valorRodadaCalculado = valorRodadaOriginal - valorDeduzido;
        const porcentagem = Number(rodada.porcentagem || 0);
        
        // valorPremio = valorRodadaCalculado - (valorRodadaCalculado * porcentagem / 100)
        const valorPremioCalculado = valorRodadaCalculado - (valorRodadaCalculado * porcentagem) / 100;

        return {
          id: rodada.id,
          campeonatoId: rodada.campeonatoId,
          campeonato: rodada.campeonato,
          rodadaId: rodada.rodadaId,
          rodada: rodada.rodada,
          tipoId: rodada.tipoId,
          porcentagem: rodada.porcentagem,
          // Valores originais do banco
          valorRodadaOriginal: rodada.valorRodada,
          valorPremioOriginal: rodada.valorPremio,
          // Valores calculados com exceções
          valorRodadaCalculado: valorRodadaCalculado.toFixed(2),
          valorPremioCalculado: valorPremioCalculado.toFixed(2),
          // Informações sobre exceções
          valorDeduzidoPorExcecoes: valorDeduzido.toFixed(2),
          quantidadeExcecoes: apostasAfetadas.length,
          apostasAfetadas,
        };
      }),
    );

    return rodadasCalculadas;
  }
}
