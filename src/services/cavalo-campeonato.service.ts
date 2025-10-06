import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CavaloCampeonato } from "../entity/cavalo-campeonato.entity";
import { AdicionarCavalosCampeonatoDto } from "../dto/adicionar-cavalos-campeonato.dto";

@Injectable()
export class CavaloCampeonatoService {
  constructor(
    @InjectRepository(CavaloCampeonato)
    private cavaloCampeonatoRepository: Repository<CavaloCampeonato>,
  ) {}

  async buscarTodos(): Promise<CavaloCampeonato[]> {
    return await this.cavaloCampeonatoRepository.find({
      relations: ["cavalo", "campeonato"],
    });
  }

  async buscarPorCampeonato(campeonatoId: number): Promise<
    {
      pareo: string;
      cavalos: string;
      grupoId: number;
      cavalosDetalhados: { id: number; nome: string; grupoId: number }[];
    }[]
  > {
    const cavalos = await this.cavaloCampeonatoRepository.find({
      where: { campeonatoId },
      relations: ["cavalo", "campeonato"],
      order: { grupoId: "ASC", id: "ASC" },
    });

    if (!cavalos || cavalos.length === 0) {
      throw new NotFoundException(
        `Cavalos não encontrados para o campeonato ${campeonatoId}`,
      );
    }

    // Agrupar cavalos por grupoId real
    const grupos = cavalos.reduce(
      (acc, cc) => {
        const grupoId = cc.grupoId || 0;
        const pareo = cc.numeroPareo || "";
        const nomeCavalo = cc.cavalo?.nome || "";
        const cavaloId = cc.cavalo?.id || 0;

        if (!acc[grupoId]) {
          acc[grupoId] = {
            pareo,
            cavalos: [],
            grupoId,
            cavalosDetalhados: [],
          };
        }

        acc[grupoId].cavalos.push(nomeCavalo);
        acc[grupoId].cavalosDetalhados.push({
          id: cavaloId,
          nome: nomeCavalo,
          grupoId,
        });

        return acc;
      },
      {} as Record<
        number,
        {
          pareo: string;
          cavalos: string[];
          grupoId: number;
          cavalosDetalhados: { id: number; nome: string; grupoId: number }[];
        }
      >,
    );

    // Converter para formato final
    return Object.values(grupos).map((grupo) => ({
      pareo: grupo.pareo,
      cavalos: grupo.cavalos.join(" - "),
      grupoId: grupo.grupoId,
      cavalosDetalhados: grupo.cavalosDetalhados,
    }));
  }

  async buscarPorPareo(
    campeonatoId: number,
    numeroPareo: string,
  ): Promise<{ pareo: string; cavalos: string }> {
    const cavalos = await this.cavaloCampeonatoRepository.find({
      where: { campeonatoId, numeroPareo },
      relations: ["cavalo", "campeonato"],
    });

    if (!cavalos || cavalos.length === 0) {
      throw new NotFoundException(
        `Cavalos não encontrados para o pareo ${numeroPareo} do campeonato ${campeonatoId}`,
      );
    }

    const nomesCavalos = cavalos
      .map((cc) => cc.cavalo?.nome || "")
      .filter((nome) => nome);

    return {
      pareo: numeroPareo,
      cavalos: nomesCavalos.join(" - "),
    };
  }

  async adicionarCavalosAoCampeonato(
    dto: AdicionarCavalosCampeonatoDto,
  ): Promise<CavaloCampeonato[]> {
    const cavalosCampeonato: CavaloCampeonato[] = [];

    for (const pareo of dto.pareos) {
      // Buscar o próximo grupoId disponível
      const ultimoGrupo = await this.cavaloCampeonatoRepository
        .createQueryBuilder("cc")
        .select("MAX(cc.grupoId)", "maxGrupoId")
        .where("cc.campeonatoId = :campeonatoId", {
          campeonatoId: dto.campeonatoId,
        })
        .getRawOne();

      const proximoGrupoId = (ultimoGrupo?.maxGrupoId || 0) + 1;

      for (const cavaloId of pareo.cavalos) {
        const cavaloCampeonato = new CavaloCampeonato();
        cavaloCampeonato.campeonatoId = dto.campeonatoId;
        cavaloCampeonato.cavaloId = cavaloId;
        cavaloCampeonato.numeroPareo = pareo.nomePareo;
        cavaloCampeonato.grupoId = proximoGrupoId;

        cavalosCampeonato.push(cavaloCampeonato);
      }
    }

    return await this.cavaloCampeonatoRepository.save(cavalosCampeonato);
  }

  async removerCavalosDoCampeonato(campeonatoId: number): Promise<void> {
    await this.cavaloCampeonatoRepository.delete({ campeonatoId });
  }

  async removerCavalosDoPareo(
    campeonatoId: number,
    numeroPareo: string,
  ): Promise<void> {
    await this.cavaloCampeonatoRepository.delete({
      campeonatoId,
      numeroPareo,
    });
  }

  async buscarCavalosDisponiveisPorCampeonato(campeonatoId: number): Promise<
    {
      pareo: string;
      cavalos: string;
      grupoId: number;
      cavalosDetalhados: { id: number; nome: string; grupoId: number }[];
    }[]
  > {
    const cavalos = await this.cavaloCampeonatoRepository.find({
      where: { campeonatoId },
      relations: ["cavalo"],
      order: { grupoId: "ASC", id: "ASC" },
    });

    if (!cavalos || cavalos.length === 0) {
      throw new NotFoundException(
        `Cavalos não encontrados para o campeonato ${campeonatoId}`,
      );
    }

    // Agrupar cavalos por grupoId real
    const grupos = cavalos.reduce(
      (acc, cc) => {
        const grupoId = cc.grupoId || 0;
        const pareo = cc.numeroPareo || "";
        const nomeCavalo = cc.cavalo?.nome || "";
        const cavaloId = cc.cavalo?.id || 0;

        if (!acc[grupoId]) {
          acc[grupoId] = {
            pareo,
            cavalos: [],
            grupoId,
            cavalosDetalhados: [],
          };
        }

        acc[grupoId].cavalos.push(nomeCavalo);
        acc[grupoId].cavalosDetalhados.push({
          id: cavaloId,
          nome: nomeCavalo,
          grupoId,
        });

        return acc;
      },
      {} as Record<
        number,
        {
          pareo: string;
          cavalos: string[];
          grupoId: number;
          cavalosDetalhados: { id: number; nome: string; grupoId: number }[];
        }
      >,
    );

    // Converter para formato final
    return Object.values(grupos).map((grupo) => ({
      pareo: grupo.pareo,
      cavalos: grupo.cavalos.join(" - "),
      grupoId: grupo.grupoId,
      cavalosDetalhados: grupo.cavalosDetalhados,
    }));
  }
}
