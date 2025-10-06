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

  async buscarPorCampeonato(campeonatoId: number): Promise<{ pareo: string; cavalos: string }[]> {
    const cavalos = await this.cavaloCampeonatoRepository.find({
      where: { campeonatoId },
      relations: ["cavalo", "campeonato"],
      order: { numeroPareo: "ASC" }
    });

    if (!cavalos || cavalos.length === 0) {
      throw new NotFoundException(
        `Cavalos não encontrados para o campeonato ${campeonatoId}`,
      );
    }

    // Agrupar cavalos por pareo
    const agrupados = cavalos.reduce((acc, cc) => {
      const pareo = cc.numeroPareo || "";
      const nomeCavalo = cc.cavalo?.nome || "";
      
      if (!acc[pareo]) {
        acc[pareo] = [];
      }
      acc[pareo].push(nomeCavalo);
      return acc;
    }, {} as Record<string, string[]>);

    // Converter para array com cavalos concatenados
    return Object.entries(agrupados).map(([pareo, nomesCavalos]) => ({
      pareo,
      cavalos: nomesCavalos.join(" - ")
    }));
  }

  async buscarPorPareo(campeonatoId: number, numeroPareo: string): Promise<{ pareo: string; cavalos: string }> {
    const cavalos = await this.cavaloCampeonatoRepository.find({
      where: { campeonatoId, numeroPareo },
      relations: ["cavalo", "campeonato"],
    });

    if (!cavalos || cavalos.length === 0) {
      throw new NotFoundException(
        `Cavalos não encontrados para o pareo ${numeroPareo} do campeonato ${campeonatoId}`,
      );
    }

    const nomesCavalos = cavalos.map(cc => cc.cavalo?.nome || "").filter(nome => nome);
    
    return {
      pareo: numeroPareo,
      cavalos: nomesCavalos.join(" - ")
    };
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

  async buscarCavalosDisponiveisPorCampeonato(campeonatoId: number): Promise<{ pareo: string; cavalos: string }[]> {
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

    // Agrupar cavalos por pareo
    const agrupados = cavalos.reduce((acc, cc) => {
      const pareo = cc.numeroPareo || "";
      const nomeCavalo = cc.cavalo?.nome || "";
      
      if (!acc[pareo]) {
        acc[pareo] = [];
      }
      acc[pareo].push(nomeCavalo);
      return acc;
    }, {} as Record<string, string[]>);

    // Converter para array com cavalos concatenados
    return Object.entries(agrupados).map(([pareo, nomesCavalos]) => ({
      pareo,
      cavalos: nomesCavalos.join(" - ")
    }));
  }
}
