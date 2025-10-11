import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Excecao } from "../entity/excecao.entity";
import { CreateExcecaoDto } from "../dto/criar-excecao.dto";
import { CavaloCampeonato } from "../entity/cavalo-campeonato.entity";
import { Rodadas } from "../entity/rodadas.entity";
import { Aposta } from "../entity/aposta.entity";

@Injectable()
export class ExcecaoService {
  constructor(
    @InjectRepository(Excecao)
    private excecaoRepository: Repository<Excecao>,
    @InjectRepository(CavaloCampeonato)
    private cavaloCampeonatoRepository: Repository<CavaloCampeonato>,
    @InjectRepository(Rodadas)
    private rodadasRepository: Repository<Rodadas>,
    private dataSource: DataSource,
  ) {}

  async criar(dto: CreateExcecaoDto): Promise<Excecao> {
    // Buscar cavalos do grupo
    const cavalosDoGrupo = await this.cavaloCampeonatoRepository.find({
      where: {
        campeonatoId: dto.campeonatoId,
        grupoId: dto.grupoId,
      },
      relations: ["cavalo"],
    });

    if (!cavalosDoGrupo || cavalosDoGrupo.length === 0) {
      throw new NotFoundException(
        `Grupo ${dto.grupoId} não encontrado no campeonato ${dto.campeonatoId}`,
      );
    }

    // Verificar se o cavalo existe no grupo
    const cavaloExiste = cavalosDoGrupo.some(
      (cc) => cc.cavaloId === dto.cavaloId,
    );
    if (!cavaloExiste) {
      throw new NotFoundException(
        `Cavalo ${dto.cavaloId} não encontrado no grupo ${dto.grupoId}`,
      );
    }

    // Verificar se já existe uma exceção para este cavalo/grupo/campeonato
    const excecaoExistente = await this.excecaoRepository.findOne({
      where: {
        campeonatoId: dto.campeonatoId,
        grupoId: dto.grupoId,
        cavaloId: dto.cavaloId,
      },
    });

    if (excecaoExistente) {
      throw new BadRequestException(
        `Já existe uma exceção para o cavalo ${dto.cavaloId} no grupo ${dto.grupoId}`,
      );
    }

    // Usar transação para garantir consistência
    return await this.dataSource.transaction(async (manager) => {
      // Criar a exceção
      const excecao = new Excecao();
      excecao.campeonatoId = dto.campeonatoId;
      excecao.grupoId = dto.grupoId;
      excecao.cavaloId = dto.cavaloId;

      const excecaoSalva = await manager.save(Excecao, excecao);

      // LÓGICA DIFERENCIADA POR QUANTIDADE DE CAVALOS
      if (cavalosDoGrupo.length === 1) {
        // GRUPO COM 1 CAVALO: Buscar todas as apostas e ajustar valores
        const apostasAfetadas = await manager.find(Aposta, {
          where: {
            campeonatoId: dto.campeonatoId,
            grupoId: dto.grupoId,
          },
        });

        // Para cada aposta, ajustar a rodada correspondente
        for (const aposta of apostasAfetadas) {
          if (aposta.rodadasId && aposta.valorUnitario) {
            // Diminuir valorRodada
            await manager
              .createQueryBuilder()
              .update(Rodadas)
              .set({
                valorRodada: () => `valorRodada - ${aposta.valorUnitario}`,
              })
              .where("id = :rodadasId", { rodadasId: aposta.rodadasId })
              .execute();

            // Recalcular valorPremio na rodada
            await this.recalcularValorPremioRodada(manager, aposta.rodadasId);
          }
        }
      }
      // GRUPO COM 3+ CAVALOS: Apenas filtra na exibição (não afeta valores)

      return excecaoSalva;
    });
  }

  async buscarPorCampeonato(campeonatoId: number): Promise<Excecao[]> {
    return await this.excecaoRepository.find({
      where: { campeonatoId },
    });
  }

  async buscarPorGrupo(campeonatoId: number, grupoId: number): Promise<Excecao[]> {
    return await this.excecaoRepository.find({
      where: { campeonatoId, grupoId },
    });
  }

  async remover(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // Buscar a exceção
      const excecao = await manager.findOne(Excecao, {
        where: { id },
      });

      if (!excecao) {
        throw new NotFoundException("Exceção não encontrada");
      }

      // Buscar cavalos do grupo para verificar quantidade
      const cavalosDoGrupo = await this.cavaloCampeonatoRepository.find({
        where: {
          campeonatoId: excecao.campeonatoId,
          grupoId: excecao.grupoId,
        },
      });

      // LÓGICA DIFERENCIADA POR QUANTIDADE DE CAVALOS
      if (cavalosDoGrupo.length === 1) {
        // GRUPO COM 1 CAVALO: Buscar todas as apostas para restaurar valores
        const apostasAfetadas = await manager.find(Aposta, {
          where: {
            campeonatoId: excecao.campeonatoId,
            grupoId: excecao.grupoId,
          },
        });

        // Para cada aposta, restaurar a rodada correspondente
        for (const aposta of apostasAfetadas) {
          if (aposta.rodadasId && aposta.valorUnitario) {
            // Restaurar valorRodada
            await manager
              .createQueryBuilder()
              .update(Rodadas)
              .set({
                valorRodada: () => `valorRodada + ${aposta.valorUnitario}`,
              })
              .where("id = :rodadasId", { rodadasId: aposta.rodadasId })
              .execute();

            // Recalcular valorPremio na rodada
            await this.recalcularValorPremioRodada(manager, aposta.rodadasId);
          }
        }
      }
      // GRUPO COM 3+ CAVALOS: Apenas remove a exceção (não afeta valores)

      // Remover a exceção
      await manager.remove(Excecao, excecao);
    });
  }

  private async recalcularValorPremioRodada(
    manager: any,
    rodadasId: number,
  ): Promise<void> {
    // Buscar a rodada atual
    const rodada = await manager.findOne(Rodadas, {
      where: { id: rodadasId },
    });

    if (rodada && rodada.valorRodada && rodada.porcentagem) {
      // Recalcular valorPremio: valorRodada - porcentagem
      // Ex: 4250 - (4250 * 20 / 100) = 4250 - 850 = 3400
      const valorRodadaNum = Number(rodada.valorRodada);
      const porcentagemNum = Number(rodada.porcentagem);
      const novoValorPremio = valorRodadaNum - (valorRodadaNum * porcentagemNum / 100);

      await manager
        .createQueryBuilder()
        .update(Rodadas)
        .set({ valorPremio: novoValorPremio })
        .where("id = :rodadasId", { rodadasId })
        .execute();
    }
  }
}
