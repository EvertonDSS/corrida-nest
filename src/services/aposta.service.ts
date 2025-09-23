import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Aposta } from "src/entity/aposta.entity";
import { Repository } from "typeorm";

@Injectable()
export class ApostaService {
  constructor(
    @InjectRepository(Aposta)
    private apostaRepository: Repository<Aposta>,
  ) {}

  async buscarTodos(): Promise<Aposta[]> {
    return await this.apostaRepository.find();
  }

  async criar(aposta: Aposta): Promise<Aposta> {
    return await this.apostaRepository.save(aposta);
  }

  async atualizar(aposta: Aposta): Promise<Aposta> {
    return await this.apostaRepository.save(aposta);
  }

  async deletar(id: number): Promise<void> {
    await this.apostaRepository.delete(id);
  }
}
