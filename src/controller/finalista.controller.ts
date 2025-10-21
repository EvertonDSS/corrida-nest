import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
} from "@nestjs/common";
import { FinalistaService } from "../services/finalista.service";
import { Finalista } from "../entity/finalista.entity";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from "@nestjs/swagger";
import { CriarFinalistaDto } from "../dto/criar-finalista.dto";
import { CriarFinalistaSemTipoDto } from "../dto/criar-finalista-sem-tipo.dto";

@Controller("/finalista")
export class FinalistaController {
  constructor(private readonly finalistaService: FinalistaService) {}

  @Post("/campeonato/:campeonatoId/tipo/:tipoId")
  @HttpCode(201)
  @ApiCreatedResponse({ type: [Finalista] })
  @ApiOperation({ summary: "Adicionar cavalos finalistas para um tipo específico de um campeonato" })
  @ApiBody({
    type: [CriarFinalistaSemTipoDto],
    examples: {
      exemploFinalistas: {
        summary: "Exemplo de finalistas",
        value: [
          {
            cavaloId: 1,
            grupoId: 1,
          },
          {
            cavaloId: 3,
            grupoId: 3,
          },
          {
            cavaloId: 4,
            grupoId: 4,
          },
        ],
      },
    },
  })
  async criarFinalistasPorCampeonatoETipo(
    @Param("campeonatoId") campeonatoId: number,
    @Param("tipoId") tipoId: number,
    @Body() finalistas: CriarFinalistaSemTipoDto[],
  ): Promise<Finalista[]> {
    return await this.finalistaService.criarFinalistasPorCampeonatoETipo(
      campeonatoId,
      tipoId,
      finalistas,
    );
  }

  @Put("/campeonato/:campeonatoId/tipo/:tipoId")
  @HttpCode(200)
  @ApiOkResponse({ type: [Finalista] })
  @ApiOperation({
    summary: "Atualizar/substituir todos os finalistas de um tipo específico",
    description:
      "Remove todos os finalistas existentes do tipo no campeonato e adiciona os novos enviados no body",
  })
  @ApiBody({
    type: [CriarFinalistaSemTipoDto],
    examples: {
      exemploAtualizacao: {
        summary: "Exemplo de atualização",
        value: [
          {
            cavaloId: 4,
            grupoId: 4,
          },
        ],
      },
      exemploMultiplos: {
        summary: "Exemplo com múltiplos finalistas",
        value: [
          {
            cavaloId: 1,
            grupoId: 1,
          },
          {
            cavaloId: 5,
            grupoId: 5,
          },
        ],
      },
    },
  })
  async atualizarFinalistasPorCampeonatoETipo(
    @Param("campeonatoId") campeonatoId: number,
    @Param("tipoId") tipoId: number,
    @Body() finalistas: CriarFinalistaSemTipoDto[],
  ): Promise<Finalista[]> {
    return await this.finalistaService.atualizarFinalistasPorCampeonatoETipo(
      campeonatoId,
      tipoId,
      finalistas,
    );
  }

  @Get("/campeonato/:campeonatoId/tipo/:tipoId")
  @ApiOkResponse({
    description: "Finalistas do campeonato para um tipo específico",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          campeonatoId: { type: "number" },
          tipoId: { type: "number" },
          tipoNome: { type: "string" },
          cavaloId: { type: "number" },
          cavaloNome: { type: "string" },
          grupoId: { type: "number" },
          numeroPareo: { type: "string" },
        },
      },
    },
  })
  @ApiOperation({
    summary: "Buscar finalistas de um campeonato por tipo de aposta",
  })
  async buscarPorCampeonatoETipo(
    @Param("campeonatoId") campeonatoId: number,
    @Param("tipoId") tipoId: number,
  ): Promise<any[]> {
    return await this.finalistaService.buscarPorCampeonatoETipo(
      campeonatoId,
      tipoId,
    );
  }

  @Get("/campeonato/:campeonatoId")
  @ApiOkResponse({
    description: "Finalistas do campeonato agrupados por tipo",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tipoId: { type: "number" },
          tipoNome: { type: "string" },
          finalistas: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                cavaloId: { type: "number" },
                cavaloNome: { type: "string" },
                grupoId: { type: "number" },
                numeroPareo: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: "Buscar todos os finalistas de um campeonato agrupados por tipo",
  })
  async buscarPorCampeonato(
    @Param("campeonatoId") campeonatoId: number,
  ): Promise<any> {
    return await this.finalistaService.buscarPorCampeonato(campeonatoId);
  }

  @Delete("/campeonato/:campeonatoId/tipo/:tipoId")
  @HttpCode(204)
  @ApiOperation({
    summary: "Deletar todos os finalistas de um tipo em um campeonato",
  })
  async deletarPorCampeonatoETipo(
    @Param("campeonatoId") campeonatoId: number,
    @Param("tipoId") tipoId: number,
  ): Promise<void> {
    return await this.finalistaService.deletarPorCampeonatoETipo(
      campeonatoId,
      tipoId,
    );
  }

  @Delete("/:id")
  @HttpCode(204)
  @ApiOperation({ summary: "Deletar um finalista específico" })
  async deletarPorId(@Param("id") id: number): Promise<void> {
    return await this.finalistaService.deletarPorId(id);
  }
}
