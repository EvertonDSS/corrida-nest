import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { RodadaService } from "../services/rodada.service";
import { Rodada } from "../entity/rodada.entity";
import { Rodadas } from "src/entity/rodadas.entity";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from "@nestjs/swagger";
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
          tipoId: 1,
          casa: 50,
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

  @Get("/campeonato/:id")
  @ApiOkResponse({
    description: "Rodadas do campeonato com nome do campeonato",
    schema: {
      type: "object",
      properties: {
        nomeCampeonato: { type: "string" },
        rodadas: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              nomeRodada: { type: "string" },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "Buscar rodadas de um campeonato específico" })
  async buscarRodadasPorCampeonatoId(
    @Param("id") campeonatoId: number,
  ): Promise<{
    nomeCampeonato: string;
    rodadas: { id: number; nomeRodada: string }[];
  }> {
    return await this.rodadaService.buscarRodadasPorCampeonatoId(campeonatoId);
  }

  @Get("v2/campeonato/:id")
  @ApiOkResponse({
    description: "Rodadas com valores calculados considerando exceções",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          campeonatoId: { type: "number" },
          rodadaId: { type: "number" },
          porcentagem: { type: "string" },
          valorRodadaOriginal: { type: "string", description: "Valor original do banco" },
          valorPremioOriginal: { type: "string", description: "Prêmio original do banco" },
          valorRodadaCalculado: { type: "string", description: "Valor após deduzir exceções" },
          valorPremioCalculado: { type: "string", description: "Prêmio recalculado com base no valor deduzido" },
          valorDeduzidoPorExcecoes: { type: "string" },
          quantidadeExcecoes: { type: "number" },
          apostasAfetadas: {
            type: "array",
            items: {
              type: "object",
              properties: {
                apostadorId: { type: "number" },
                grupoId: { type: "number" },
                valorUnitario: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: "V2: Buscar rodadas com valores calculados (considerando exceções)",
    description:
      "Retorna rodadas do campeonato com valores originais do banco E valores recalculados após deduzir apostas com exceções. NÃO modifica o banco de dados.",
  })
  async buscarRodadasCalculadas(
    @Param("id") campeonatoId: string,
  ): Promise<any[]> {
    return await this.rodadaService.buscarRodadasComExcecoesCalculadas(
      parseInt(campeonatoId),
    );
  }

  @Get("campeonato/:id/rodadas")
  @ApiOkResponse({ type: [Rodadas] })
  @ApiOperation({
    summary: "Buscar rodadas de um campeonato (entidade Rodadas)",
  })
  async buscarRodadasPorCampeonato(
    @Param("id") campeonatoId: number,
  ): Promise<Rodadas[]> {
    return await this.rodadaService.buscarRodadasPorCampeonato(campeonatoId);
  }
}
