import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Finalista } from "../entity/finalista.entity";
import { CavaloCampeonato } from "../entity/cavalo-campeonato.entity";
import { CriarFinalistaDto } from "../dto/criar-finalista.dto";
import { CriarFinalistaSemTipoDto } from "../dto/criar-finalista-sem-tipo.dto";

@Injectable()
export class FinalistaService {
  constructor(
    @InjectRepository(Finalista)
    private finalistaRepository: Repository<Finalista>,
    private dataSource: DataSource,
  ) {}

  async criarFinalistasPorCampeonato(
    campeonatoId: number,
    finalistas: CriarFinalistaDto[],
  ): Promise<Finalista[]> {
    // Adicionar o campeonatoId a cada finalista
    const finalistasCompletos = finalistas.map((finalista) => ({
      ...finalista,
      campeonatoId,
    })) as Finalista[];

    return await this.finalistaRepository.save(finalistasCompletos);
  }

  async criarFinalistasPorCampeonatoETipo(
    campeonatoId: number,
    tipoId: number,
    finalistas: CriarFinalistaSemTipoDto[],
  ): Promise<Finalista[]> {
    // Adicionar o campeonatoId e tipoId a cada finalista
    const finalistasCompletos = finalistas.map((finalista) => ({
      ...finalista,
      campeonatoId,
      tipoId,
    })) as Finalista[];

    return await this.finalistaRepository.save(finalistasCompletos);
  }

  async atualizarFinalistasPorCampeonato(
    campeonatoId: number,
    finalistas: CriarFinalistaDto[],
  ): Promise<Finalista[]> {
    // Usar transaction para garantir atomicidade
    return await this.dataSource.transaction(async (manager) => {
      // 1. Deletar todos os finalistas existentes do campeonato
      await manager.delete(Finalista, { campeonatoId });

      // 2. Adicionar os novos finalistas
      const finalistasCompletos = finalistas.map((finalista) => ({
        ...finalista,
        campeonatoId,
      })) as Finalista[];

      return await manager.save(Finalista, finalistasCompletos);
    });
  }

  async atualizarFinalistasPorCampeonatoETipo(
    campeonatoId: number,
    tipoId: number,
    finalistas: CriarFinalistaSemTipoDto[],
  ): Promise<Finalista[]> {
    // Usar transaction para garantir atomicidade
    return await this.dataSource.transaction(async (manager) => {
      // 1. Deletar todos os finalistas existentes deste tipo no campeonato
      await manager.delete(Finalista, { campeonatoId, tipoId });

      // 2. Adicionar os novos finalistas
      const finalistasCompletos = finalistas.map((finalista) => ({
        ...finalista,
        campeonatoId,
        tipoId,
      })) as Finalista[];

      return await manager.save(Finalista, finalistasCompletos);
    });
  }

  async buscarPorCampeonatoETipo(
    campeonatoId: number,
    tipoId: number,
  ): Promise<any[]> {
    const finalistas = await this.finalistaRepository.find({
      where: { campeonatoId, tipoId },
      relations: ["cavalo", "tipo"],
    });

    if (!finalistas || finalistas.length === 0) {
      throw new NotFoundException(
        `Nenhum finalista encontrado para o campeonato ${campeonatoId} e tipo ${tipoId}`,
      );
    }

    // Buscar informações completas dos cavalos no campeonato
    const finalistasCompletos = await Promise.all(
      finalistas.map(async (finalista) => {
        const cavaloCampeonato = await this.dataSource
          .getRepository(CavaloCampeonato)
          .findOne({
            where: {
              campeonatoId,
              cavaloId: finalista.cavaloId,
              grupoId: finalista.grupoId,
            },
            relations: ["cavalo"],
          });

        return {
          id: finalista.id,
          campeonatoId: finalista.campeonatoId,
          tipoId: finalista.tipoId,
          tipoNome: finalista.tipo?.nome || "",
          cavaloId: finalista.cavaloId,
          cavaloNome: finalista.cavalo?.nome || "",
          grupoId: finalista.grupoId,
          numeroPareo: cavaloCampeonato?.numeroPareo || "",
        };
      }),
    );

    return finalistasCompletos.sort((a, b) =>
      a.numeroPareo.localeCompare(b.numeroPareo),
    );
  }

  async buscarPorCampeonato(campeonatoId: number): Promise<any> {
    const finalistas = await this.finalistaRepository.find({
      where: { campeonatoId },
      relations: ["cavalo", "tipo"],
    });

    if (!finalistas || finalistas.length === 0) {
      throw new NotFoundException(
        `Nenhum finalista encontrado para o campeonato ${campeonatoId}`,
      );
    }

    // Buscar informações completas dos cavalos no campeonato
    const finalistasCompletos = await Promise.all(
      finalistas.map(async (finalista) => {
        const cavaloCampeonato = await this.dataSource
          .getRepository(CavaloCampeonato)
          .findOne({
            where: {
              campeonatoId,
              cavaloId: finalista.cavaloId,
              grupoId: finalista.grupoId,
            },
            relations: ["cavalo"],
          });

        return {
          id: finalista.id,
          campeonatoId: finalista.campeonatoId,
          tipoId: finalista.tipoId,
          tipoNome: finalista.tipo?.nome || "",
          cavaloId: finalista.cavaloId,
          cavaloNome: finalista.cavalo?.nome || "",
          grupoId: finalista.grupoId,
          numeroPareo: cavaloCampeonato?.numeroPareo || "",
        };
      }),
    );

    // Agrupar por tipo
    const agrupadoPorTipo = finalistasCompletos.reduce(
      (acc: any, finalista: any) => {
        if (!acc[finalista.tipoId]) {
          acc[finalista.tipoId] = {
            tipoId: finalista.tipoId,
            tipoNome: finalista.tipoNome,
            finalistas: [],
          };
        }
        acc[finalista.tipoId].finalistas.push({
          id: finalista.id,
          cavaloId: finalista.cavaloId,
          cavaloNome: finalista.cavaloNome,
          grupoId: finalista.grupoId,
          numeroPareo: finalista.numeroPareo,
        });
        return acc;
      },
      {},
    );

    // Ordenar finalistas dentro de cada tipo por número de páreo
    Object.values(agrupadoPorTipo).forEach((tipo: any) => {
      tipo.finalistas.sort((a: any, b: any) =>
        a.numeroPareo.localeCompare(b.numeroPareo),
      );
    });

    return Object.values(agrupadoPorTipo);
  }

  async deletarPorCampeonatoETipo(
    campeonatoId: number,
    tipoId: number,
  ): Promise<void> {
    await this.finalistaRepository.delete({ campeonatoId, tipoId });
  }

  async deletarPorId(id: number): Promise<void> {
    const result = await this.finalistaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Finalista com id ${id} não encontrado`);
    }
  }
}

