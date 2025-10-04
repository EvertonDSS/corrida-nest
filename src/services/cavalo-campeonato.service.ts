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

  async buscarPorCampeonato(campeonatoId: number): Promise<CavaloCampeonato[]> {
    const cavalos = await this.cavaloCampeonatoRepository.find({
      where: { campeonatoId },
      relations: ["cavalo", "campeonato"],
    });

    if (!cavalos || cavalos.length === 0) {
      throw new NotFoundException(
        `Cavalos não encontrados para o campeonato ${campeonatoId}`,
      );
    }

    return cavalos;
  }

  async buscarPorPareo(campeonatoId: number, numeroPareo: string): Promise<CavaloCampeonato[]> {
    const cavalos = await this.cavaloCampeonatoRepository.find({
      where: { campeonatoId, numeroPareo },
      relations: ["cavalo", "campeonato"],
    });

    return cavalos;
  }

  async adicionarCavalosAoCampeonato(dto: AdicionarCavalosCampeonatoDto): Promise<CavaloCampeonato[]> {
    const cavalosCampeonato: CavaloCampeonato[] = [];

    for (const cavaloPareo of dto.cavalos) {
      const cavaloCampeonato = new CavaloCampeonato();
      cavaloCampeonato.campeonatoId = dto.campeonatoId;
      cavaloCampeonato.cavaloId = cavaloPareo.cavaloId;
      cavaloCampeonato.numeroPareo = cavaloPareo.numeroPareo;
      
      cavalosCampeonato.push(cavaloCampeonato);
    }

    return await this.cavaloCampeonatoRepository.save(cavalosCampeonato);
  }

  async removerCavalosDoCampeonato(campeonatoId: number): Promise<void> {
    await this.cavaloCampeonatoRepository.delete({ campeonatoId });
  }

  async removerCavalosDoPareo(campeonatoId: number, numeroPareo: string): Promise<void> {
    await this.cavaloCampeonatoRepository.delete({ 
      campeonatoId, 
      numeroPareo 
    });
  }

  async buscarCavalosDisponiveisPorCampeonato(campeonatoId: number): Promise<{ pareo: string; cavalo: string }[]> {
    const cavalos = await this.cavaloCampeonatoRepository.find({
      where: { campeonatoId },
      relations: ["cavalo"],
      order: { numeroPareo: "ASC" }
    });

    if (!cavalos || cavalos.length === 0) {
      throw new NotFoundException(
        `Cavalos não encontrados para o campeonato ${campeonatoId}`,
      );
    }

    return cavalos.map(cc => ({
      pareo: cc.numeroPareo || "",
      cavalo: cc.cavalo?.nome || ""
    }));
  }
}
