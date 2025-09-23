import { Controller, Get, Post, Body, HttpCode, Param } from "@nestjs/common";
import { ApostadorService } from "../services/apostador.service";
import { Apostador } from "../entity/apostador.entity";
import { ApiBody, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

@Controller("/apostador")
export class ApostadorController {
  constructor(private readonly apostadorService: ApostadorService) {}

  @Get()
  async buscarTodos(): Promise<Apostador[]> {
    return await this.apostadorService.buscarTodos();
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: Apostador })
  @ApiOperation({ summary: "Criar um apostador" })
  @ApiBody({
    type: Apostador,
    examples: {
      exemploApostador: {
        summary: "Exemplo de apostador",
        value: {
          nome: "João Silva",
        },
      },
    },
  })
  async criar(@Body() apostador: Apostador): Promise<Apostador> {
    return await this.apostadorService.criar(apostador);
  }

  @Get(":id")
  async buscarPorId(@Param("id") id: number) {
    return await this.apostadorService.buscarPorId(id);
  }
}
