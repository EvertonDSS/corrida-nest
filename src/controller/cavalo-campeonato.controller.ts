import { Controller, Get, Post, Delete, Body, Param, HttpCode } from "@nestjs/common";
import { CavaloCampeonatoService } from "../services/cavalo-campeonato.service";
import { CavaloCampeonato } from "../entity/cavalo-campeonato.entity";
import { AdicionarCavalosCampeonatoDto } from "../dto/adicionar-cavalos-campeonato.dto";
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiOkResponse } from "@nestjs/swagger";

@Controller("/cavalo-campeonato")
export class CavaloCampeonatoController {
  constructor(private readonly cavaloCampeonatoService: CavaloCampeonatoService) {}

  @Get()
  @ApiOkResponse({ type: [CavaloCampeonato] })
  @ApiOperation({ summary: "Listar todos os cavalos de campeonatos" })
  async buscarTodos(): Promise<CavaloCampeonato[]> {
    return await this.cavaloCampeonatoService.buscarTodos();
  }

  @Get("campeonato/:id")
  @ApiOkResponse({ type: [CavaloCampeonato] })
  @ApiOperation({ summary: "Listar cavalos de um campeonato específico" })
  async buscarPorCampeonato(@Param("id") campeonatoId: number): Promise<CavaloCampeonato[]> {
    return await this.cavaloCampeonatoService.buscarPorCampeonato(campeonatoId);
  }

  @Get("campeonato/:id/disponiveis")
  @ApiOkResponse({ 
    description: "Lista de cavalos disponíveis no formato pareo - cavalo",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          pareo: { type: "string", example: "01" },
          cavalo: { type: "string", example: "Ravale" }
        }
      }
    }
  })
  @ApiOperation({ summary: "Listar cavalos disponíveis por campeonato no formato pareo - cavalo" })
  async buscarCavalosDisponiveisPorCampeonato(@Param("id") campeonatoId: number): Promise<{ pareo: string; cavalo: string }[]> {
    return await this.cavaloCampeonatoService.buscarCavalosDisponiveisPorCampeonato(campeonatoId);
  }

  @Get("campeonato/:id/pareo/:pareo")
  @ApiOkResponse({ type: [CavaloCampeonato] })
  @ApiOperation({ summary: "Listar cavalos de um pareo específico de um campeonato" })
  async buscarPorPareo(
    @Param("id") campeonatoId: number,
    @Param("pareo") numeroPareo: string,
  ): Promise<CavaloCampeonato[]> {
    return await this.cavaloCampeonatoService.buscarPorPareo(campeonatoId, numeroPareo);
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: [CavaloCampeonato] })
  @ApiOperation({ summary: "Adicionar cavalos a um campeonato" })
  @ApiBody({
    type: AdicionarCavalosCampeonatoDto,
    examples: {
      exemploCavalos: {
        summary: "Exemplo de adição de cavalos",
        value: {
          campeonatoId: 1,
          cavalos: [
            { cavaloId: 1, numeroPareo: "01" },
            { cavaloId: 2, numeroPareo: "01" },
            { cavaloId: 3, numeroPareo: "02" }
          ]
        },
      },
    },
  })
  async adicionarCavalosAoCampeonato(
    @Body() dto: AdicionarCavalosCampeonatoDto,
  ): Promise<CavaloCampeonato[]> {
    return await this.cavaloCampeonatoService.adicionarCavalosAoCampeonato(dto);
  }

  @Delete("campeonato/:id")
  @HttpCode(200)
  @ApiOkResponse({ description: "Cavalos removidos do campeonato" })
  @ApiOperation({ summary: "Remover todos os cavalos de um campeonato" })
  async removerCavalosDoCampeonato(@Param("id") campeonatoId: number): Promise<{ message: string }> {
    await this.cavaloCampeonatoService.removerCavalosDoCampeonato(campeonatoId);
    return { message: "Cavalos removidos do campeonato com sucesso" };
  }

  @Delete("campeonato/:id/pareo/:pareo")
  @HttpCode(200)
  @ApiOkResponse({ description: "Cavalos removidos do pareo" })
  @ApiOperation({ summary: "Remover cavalos de um pareo específico" })
  async removerCavalosDoPareo(
    @Param("id") campeonatoId: number,
    @Param("pareo") numeroPareo: string,
  ): Promise<{ message: string }> {
    await this.cavaloCampeonatoService.removerCavalosDoPareo(campeonatoId, numeroPareo);
    return { message: "Cavalos removidos do pareo com sucesso" };
  }
}
