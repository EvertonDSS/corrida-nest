import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from "@nestjs/common";
import { TipoService } from "../services/tipo.service";
import { Tipo } from "../entity/tipo.entity";
import { CriarTipoDto } from "../dto/criar-tipo.dto";
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiOkResponse, ApiParam } from "@nestjs/swagger";

@Controller("/tipo")
export class TipoController {
  constructor(private readonly tipoService: TipoService) {}

  @Get()
  @ApiOkResponse({ type: [Tipo] })
  @ApiOperation({ summary: "Listar todos os tipos" })
  async buscarTodos(): Promise<Tipo[]> {
    return await this.tipoService.buscarTodos();
  }

  @Get(":id")
  @ApiOkResponse({ type: Tipo })
  @ApiOperation({ summary: "Buscar tipo por ID" })
  @ApiParam({ name: "id", description: "ID do tipo", example: 1 })
  async buscarPorId(@Param("id") id: number): Promise<Tipo> {
    return await this.tipoService.buscarPorId(id);
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: Tipo })
  @ApiOperation({ summary: "Criar novo tipo" })
  @ApiBody({
    type: CriarTipoDto,
    examples: {
      exemploCorrida: {
        summary: "Exemplo de tipo de corrida",
        value: {
          nome: "Corrida de Velocidade"
        },
      },
      exemploHipismo: {
        summary: "Exemplo de tipo de hipismo",
        value: {
          nome: "Hipismo Clássico"
        },
      },
    },
  })
  async criar(@Body() dto: CriarTipoDto): Promise<Tipo> {
    return await this.tipoService.criar(dto);
  }

  @Put(":id")
  @ApiOkResponse({ type: Tipo })
  @ApiOperation({ summary: "Atualizar tipo" })
  @ApiParam({ name: "id", description: "ID do tipo", example: 1 })
  @ApiBody({ type: CriarTipoDto })
  async atualizar(@Param("id") id: number, @Body() dto: CriarTipoDto): Promise<Tipo> {
    return await this.tipoService.atualizar(id, dto);
  }

  @Delete(":id")
  @HttpCode(200)
  @ApiOkResponse({ description: "Tipo deletado com sucesso" })
  @ApiOperation({ summary: "Deletar tipo" })
  @ApiParam({ name: "id", description: "ID do tipo", example: 1 })
  async deletar(@Param("id") id: number): Promise<{ message: string }> {
    await this.tipoService.deletar(id);
    return { message: "Tipo deletado com sucesso" };
  }
}
