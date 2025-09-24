import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cavalo } from "../entity/cavalo.entity";

@Injectable()
export class CavaloService {
  constructor(
    @InjectRepository(Cavalo)
    private cavaloRepository: Repository<Cavalo>,
  ) {}

  async buscarTodos(): Promise<Cavalo[]> {
    return await this.cavaloRepository.find();
  }

  async buscarPorId(id: number): Promise<Cavalo | null> {
    const cavalo = await this.cavaloRepository.findOne({ where: { id } });
    if (!cavalo) {
      throw new NotFoundException(`Cavalo com id ${id} não encontrado`);
    }
    return cavalo;
  }

  async criar(cavalo: Cavalo): Promise<Cavalo> {
    return await this.cavaloRepository.save(cavalo);
  }

}
