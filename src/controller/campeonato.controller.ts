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
import { Apostador } from "../entity/apostador.entity";
import { Aposta } from "../entity/aposta.entity";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from "@nestjs/swagger";

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

  @Get(":id/apostadores")
  @ApiOkResponse({ type: [Apostador] })
  @ApiOperation({ summary: "Listar apostadores de um campeonato" })
  async buscarApostadoresDoCampeonato(
    @Param("id") id: number,
  ): Promise<Apostador[]> {
    return await this.campeonatoService.buscarApostadoresDoCampeonato(id);
  }

  @Get(":id/apostador/:apostadorId/v2-apostas")
  @ApiOkResponse({ type: [Aposta] })
  @ApiOperation({
    summary:
      "V2: Listar apostas considerando exceções (exclui apostas sem cavalos)",
    description:
      "Retorna apostas com MESMA estrutura do endpoint original, mas com valorRodada e valorPremio recalculados considerando exceções. Apostas sem cavalos disponíveis são automaticamente excluídas. NÃO modifica o banco de dados.",
  })
  async buscarApostasDoApostadorNoCampeonatoV2(
    @Param("id") campeonatoId: string,
    @Param("apostadorId") apostadorId: string,
  ): Promise<any[]> {
    return await this.campeonatoService.buscarApostasDoApostadorNoCampeonatoV2(
      parseInt(campeonatoId),
      parseInt(apostadorId),
    );
  }

  @Get(":id/apostador/:apostadorId/apostas")
  @ApiOkResponse({ type: [Aposta] })
  @ApiOperation({
    summary: "Listar apostas de um apostador em um campeonato específico",
  })
  async buscarApostasDoApostadorNoCampeonato(
    @Param("id") campeonatoId: number,
    @Param("apostadorId") apostadorId: number,
  ): Promise<Aposta[]> {
    return await this.campeonatoService.buscarApostasDoApostadorNoCampeonato(
      campeonatoId,
      apostadorId,
    );
  }

  @Get(":id/tipos/:tipoId/cavalos")
  @ApiOkResponse({
    description: "Cavalos e valores de um tipo específico",
    schema: {
      type: "object",
      properties: {
        tipoId: { type: "number" },
        tipoNome: { type: "string" },
        cavalos: {
          type: "array",
          items: {
            type: "object",
            properties: {
              cavaloId: { type: "number" },
              cavaloNome: { type: "string" },
              numeroPareo: { type: "string" },
              grupoId: { type: "number" },
              valorTotal: { type: "string" },
            },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: "Buscar cavalos e valores de um tipo específico",
    description:
      "Retorna os cavalos de um campeonato para um tipo de aposta específico com seus valores totais apostados",
  })
  async buscarCavalosPorTipo(
    @Param("id") campeonatoId: number,
    @Param("tipoId") tipoId: number,
  ): Promise<any> {
    return await this.campeonatoService.buscarCavalosPorTipo(
      campeonatoId,
      tipoId,
    );
  }

  @Get(":id/tipos")
  @ApiOkResponse({
    description: "Cavalos e valores agrupados por tipo de aposta",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tipoId: { type: "number" },
          tipoNome: { type: "string" },
          cavalos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                cavaloId: { type: "number" },
                cavaloNome: { type: "string" },
                numeroPareo: { type: "string" },
                grupoId: { type: "number" },
                valorTotal: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: "Buscar cavalos e valores agrupados por tipo de aposta",
    description:
      "Retorna os cavalos de um campeonato com seus valores totais apostados, agrupados por tipo de aposta",
  })
  async buscarCavalosPorTipos(@Param("id") campeonatoId: number): Promise<any> {
    return await this.campeonatoService.buscarCavalosAgrupadosPorTipo(
      campeonatoId,
    );
  }
}
