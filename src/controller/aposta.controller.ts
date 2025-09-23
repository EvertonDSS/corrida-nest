import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { ApostaService } from "../services/aposta.service";
import { Aposta } from "src/entity/aposta.entity";
import { ApiBody, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { CreateApostaDto } from "src/dto/criar-aposta.dto";

@Controller("/aposta")
export class ApostaController {
  constructor(private readonly apostaService: ApostaService) {}

  @Get()
  async buscarTodos(): Promise<Aposta[]> {
    return await this.apostaService.buscarTodos();
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: Aposta })
  @ApiOperation({ summary: "Criar uma aposta" })
  @ApiBody({ type: CreateApostaDto })
  async criar(@Body() dto: CreateApostaDto) {
    return await this.apostaService.criar(dto);
  }

  @Get(":id")
  async buscarPorId(@Param("id") id: number): Promise<Aposta> {
    const aposta = await this.apostaService.buscarPorId(id);
    if (!aposta) {
      throw new NotFoundException("Aposta não encontrada");
    }
    return aposta;
  }
}
