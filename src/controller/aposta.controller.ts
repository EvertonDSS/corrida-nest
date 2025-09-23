import { Controller, Get, Post } from "@nestjs/common";
import { ApostaService } from "../services/aposta.service";
import { Aposta } from "src/entity/aposta.entity";

@Controller("/aposta")
export class ApostaController {
  constructor(private readonly apostaService: ApostaService) {}

  @Get()
  async buscarTodos(): Promise<Aposta[]> {
    return await this.apostaService.buscarTodos();
  }

  @Post()
  async criar(aposta: Aposta): Promise<Aposta> {
    return await this.apostaService.criar(aposta);
  }
}
