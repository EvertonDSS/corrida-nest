import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateApostaDto } from "src/dto/criar-aposta.dto";
import { Aposta } from "src/entity/aposta.entity";
import { Repository } from "typeorm";

@Injectable()
export class ApostaService {
  constructor(
    @InjectRepository(Aposta)
    private apostaRepository: Repository<Aposta>,
  ) {}

  async buscarTodos(): Promise<Aposta[]> {
    return await this.apostaRepository.find({
      relations: ["cavalo", "campeonato", "apostador"],
    });
  }

  async buscarPorId(id: number): Promise<Aposta | null> {
    return await this.apostaRepository.findOne({
      where: { id },
      relations: ["cavalo", "campeonato", "apostador"],
    });
  }

  async criar(dto: CreateApostaDto) {
    const aposta = new Aposta();
    aposta.cavaloId = dto.cavaloId;
    aposta.campeonatoId = dto.campeonatoId;
    aposta.apostadorId = dto.apostadorId;
    aposta.total = dto.total;
    aposta.valorUnitario = dto.valorUnitario;
    aposta.porcentagem = dto.porcentagem;
    return this.apostaRepository.save(aposta);
  }

  async atualizar(aposta: Aposta): Promise<Aposta> {
    return await this.apostaRepository.save(aposta);
  }

  async deletar(id: number): Promise<void> {
    await this.apostaRepository.delete(id);
  }
}
