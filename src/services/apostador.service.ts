import { Injectable } from "@nestjs/common";
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
    return await this.apostadorRepository.findOne({
      where: { id },
      relations: ["apostas"],
    });
  }

  async criar(apostador: Apostador): Promise<Apostador> {
    return await this.apostadorRepository.save(apostador);
  }
}
