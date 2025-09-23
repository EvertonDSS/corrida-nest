import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Apostador } from "../entity/apostador.entity";

@Injectable()
export class ApostadorService {
  constructor(
    @InjectRepository(Apostador)
    private apostadorRepository: Repository<Apostador>,
  ) {}

  async buscarTodos(): Promise<Apostador[]> {
    return await this.apostadorRepository.find({ relations: ["apostas"] });
  }

  async buscarPorId(id: number): Promise<Apostador | null> {
    const apostador = await this.apostadorRepository.findOne({
      where: { id },
      relations: ["apostas"],
    });
    if (!apostador) {
      throw new NotFoundException(`Apostador com id ${id} não encontrado`);
    }

    return apostador;
  }

  async criar(apostador: Apostador): Promise<Apostador> {
    return await this.apostadorRepository.save(apostador);
  }
}
