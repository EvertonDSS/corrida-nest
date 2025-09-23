import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Campeonato } from "../entity/campeonato.entity";

@Injectable()
export class CampeonatoService {
  constructor(
    @InjectRepository(Campeonato)
    private campeonatoRepository: Repository<Campeonato>,
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
}
