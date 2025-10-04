import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tipo } from "../entity/tipo.entity";
import { CriarTipoDto } from "../dto/criar-tipo.dto";

@Injectable()
export class TipoService {
  constructor(
    @InjectRepository(Tipo)
    private tipoRepository: Repository<Tipo>,
  ) {}

  async buscarTodos(): Promise<Tipo[]> {
    return await this.tipoRepository.find({
      relations: ["rodadas"],
    });
  }

  async buscarPorId(id: number): Promise<Tipo> {
    const tipo = await this.tipoRepository.findOne({
      where: { id },
      relations: ["rodadas"],
    });

    if (!tipo) {
      throw new NotFoundException(`Tipo com ID ${id} não encontrado`);
    }

    return tipo;
  }

  async criar(dto: CriarTipoDto): Promise<Tipo> {
    const tipo = new Tipo();
    tipo.nome = dto.nome;
    return await this.tipoRepository.save(tipo);
  }

  async atualizar(id: number, dto: CriarTipoDto): Promise<Tipo> {
    const tipo = await this.buscarPorId(id);
    tipo.nome = dto.nome;
    return await this.tipoRepository.save(tipo);
  }

  async deletar(id: number): Promise<void> {
    const tipo = await this.buscarPorId(id);
    await this.tipoRepository.remove(tipo);
  }
}
