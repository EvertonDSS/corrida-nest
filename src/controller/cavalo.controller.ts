import { Controller, Get, Post, Body, HttpCode, Param } from "@nestjs/common";
import { CavaloService } from "../services/cavalo.service";
import { Cavalo } from "../entity/cavalo.entity";
import { ApiBody, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

@Controller("/cavalo")
export class CavaloController {
  constructor(private readonly cavaloService: CavaloService) {}

  @Get()
  async buscarTodos(): Promise<Cavalo[]> {
    return await this.cavaloService.buscarTodos();
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: Cavalo })
  @ApiOperation({ summary: "Criar um cavalo" })
  @ApiBody({
    type: Cavalo,
    examples: {
      exemploCavalo: {
        summary: "Exemplo de cavalo",
        value: {
          nome: "Relâmpago",
        },
      },
    },
  })
  async criar(@Body() cavalo: Cavalo): Promise<Cavalo> {
    return await this.cavaloService.criar(cavalo);
  }

  @Get(":id")
  async buscarPorId(@Param("id") id: number) {
    return await this.cavaloService.buscarPorId(id);
  }
}
