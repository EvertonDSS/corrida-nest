import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
} from "@nestjs/common";
import { ExcecaoService } from "../services/excecao.service";
import { Excecao } from "../entity/excecao.entity";
import { CreateExcecaoDto } from "../dto/criar-excecao.dto";
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
} from "@nestjs/swagger";

@ApiTags("excecao")
@Controller("/excecao")
export class ExcecaoController {
  constructor(private readonly excecaoService: ExcecaoService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: Excecao })
  @ApiOperation({
    summary: "Criar uma exceção",
    description:
      "Cria uma exceção para remover um cavalo específico de um grupo. Se o grupo tem apenas 1 cavalo, afeta os cálculos da rodada (diminui valorRodada e recalcula valorPremio). Se o grupo tem 3+ cavalos, apenas filtra na exibição sem afetar valores.",
  })
  @ApiBody({
    type: CreateExcecaoDto,
    examples: {
      exemploExcecao: {
        summary: "Exemplo de exceção",
        value: {
          campeonatoId: 1,
          grupoId: 1,
          cavaloId: 36,
        },
      },
    },
  })
  async criar(@Body() dto: CreateExcecaoDto): Promise<Excecao> {
    return await this.excecaoService.criar(dto);
  }

  @Get("campeonato/:id")
  @ApiOkResponse({ type: [Excecao] })
  @ApiOperation({
    summary: "Buscar exceções por campeonato",
    description:
      "Retorna todas as exceções de um campeonato específico.",
  })
  async buscarPorCampeonato(
    @Param("id") campeonatoId: string,
  ): Promise<Excecao[]> {
    return await this.excecaoService.buscarPorCampeonato(parseInt(campeonatoId));
  }

  @Get("campeonato/:campeonatoId/grupo/:grupoId")
  @ApiOkResponse({ type: [Excecao] })
  @ApiOperation({
    summary: "Buscar exceções por grupo",
    description:
      "Retorna todas as exceções de um grupo específico em um campeonato.",
  })
  async buscarPorGrupo(
    @Param("campeonatoId") campeonatoId: string,
    @Param("grupoId") grupoId: string,
  ): Promise<Excecao[]> {
    return await this.excecaoService.buscarPorGrupo(parseInt(campeonatoId), parseInt(grupoId));
  }

  @Delete(":id")
  @HttpCode(200)
  @ApiOkResponse({ description: "Exceção removida com sucesso" })
  @ApiOperation({
    summary: "Remover exceção",
    description:
      "Remove uma exceção pelo ID e restaura os valores das rodadas afetadas se necessário.",
  })
  async remover(
    @Param("id") id: string,
  ): Promise<{ message: string }> {
    await this.excecaoService.remover(parseInt(id));
    return { message: "Exceção removida com sucesso" };
  }
}
