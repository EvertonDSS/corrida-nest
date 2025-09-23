import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { CampeonatoService } from "../services/campeonato.service";
import { Campeonato } from "../entity/campeonato.entity";
import { ApiBody, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

@Controller("/campeonato")
export class CampeonatoController {
  constructor(private readonly campeonatoService: CampeonatoService) {}

  @Get()
  async buscarTodos(): Promise<Campeonato[]> {
    return await this.campeonatoService.buscarTodos();
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: Campeonato })
  @ApiOperation({ summary: "Criar um campeonato" })
  @ApiBody({
    type: Campeonato,
    examples: {
      exemploCampeonato: {
        summary: "Exemplo de campeonato",
        value: {
          nome: "Grande Prêmio Nacional",
          ano: new Date().getFullYear(),
        },
      },
    },
  })
  async criar(@Body() campeonato: Campeonato): Promise<Campeonato> {
    return await this.campeonatoService.criar(campeonato);
  }

  @Get(":id")
  async buscarPorId(@Param("id") id: number): Promise<Campeonato> {
    const campeonato = await this.campeonatoService.buscarPorId(id);
    if (!campeonato) {
      throw new NotFoundException("Campeonato não encontrado");
    }
    return campeonato;
  }
}
