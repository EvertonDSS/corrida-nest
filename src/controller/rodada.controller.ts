import { Controller, Get, Post, Body } from "@nestjs/common";
import { RodadaService } from "../services/rodada.service";
import { Rodada } from "../entity/rodada.entity";
import { Rodadas } from "src/entity/rodadas.entity";
import { ApiBody, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

@Controller("/rodada")
export class RodadaController {
  constructor(private readonly rodadaService: RodadaService) {}

  @Get()
  async buscarTodos(): Promise<Rodada[]> {
    return await this.rodadaService.buscarTodos();
  }

  @Post()
  @ApiCreatedResponse({ type: Rodada })
  @ApiOperation({ summary: "Criar uma rodada" })
  @ApiBody({
    type: Rodada,
    examples: {
      exemploRodada: {
        summary: "Exemplo de rodada",
        value: {
          nomeRodada: "Rodada 1",
        },
      },
    },
  })
  async criar(@Body() rodada: Rodada): Promise<Rodada> {
    return await this.rodadaService.criar(rodada);
  }

  @Post("/campeonato")
  @ApiCreatedResponse({ type: Rodadas })
  @ApiOperation({ summary: "Criar uma rodada por campeonato" })
  @ApiBody({
    type: Rodadas,
    examples: {
      exemploRodadas: {
        summary: "Exemplo de rodadas",
        value: {
          campeonatoId: 1,
          rodadaId: 1,
          valorRodada: 100,
          porcentagem: 10,
        },
      },
    },
  })
  async criarPorCampeonato(@Body() body: Rodadas) {
    const rodada = plainToInstance(Rodadas, body);
    return await this.rodadaService.criarPorCampeonato(rodada);
  }

  @Get("/campeonato")
  async buscarPorCampeonato(): Promise<Rodada[]> {
    return await this.rodadaService.buscarPorCampeonato();
  }
}
