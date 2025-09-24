import { Controller, Delete, HttpCode } from "@nestjs/common";
import { CleanupService } from "../services/cleanup.service";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";

@Controller("/cleanup")
export class CleanupController {
  constructor(private readonly cleanupService: CleanupService) {}

  @Delete("apostas")
  @HttpCode(200)
  @ApiOkResponse({ description: "Tabela apostas foi truncada com sucesso" })
  @ApiOperation({ summary: "Truncar tabela apostas (CASCADE)" })
  async truncateApostas(): Promise<{ message: string }> {
    await this.cleanupService.truncateApostas();
    return { message: "Tabela apostas foi truncada com sucesso" };
  }

  @Delete("apostadores")
  @HttpCode(200)
  @ApiOkResponse({ description: "Tabela apostadores foi truncada com sucesso" })
  @ApiOperation({ summary: "Truncar tabela apostadores (CASCADE)" })
  async truncateApostadores(): Promise<{ message: string }> {
    await this.cleanupService.truncateApostadores();
    return { message: "Tabela apostadores foi truncada com sucesso" };
  }

  @Delete("campeonatos")
  @HttpCode(200)
  @ApiOkResponse({ description: "Tabela campeonatos foi truncada com sucesso" })
  @ApiOperation({ summary: "Truncar tabela campeonatos (CASCADE)" })
  async truncateCampeonatos(): Promise<{ message: string }> {
    await this.cleanupService.truncateCampeonatos();
    return { message: "Tabela campeonatos foi truncada com sucesso" };
  }

  @Delete("cavalos")
  @HttpCode(200)
  @ApiOkResponse({ description: "Tabela cavalos foi truncada com sucesso" })
  @ApiOperation({ summary: "Truncar tabela cavalos (CASCADE)" })
  async truncateCavalos(): Promise<{ message: string }> {
    await this.cleanupService.truncateCavalos();
    return { message: "Tabela cavalos foi truncada com sucesso" };
  }

  @Delete("rodadas")
  @HttpCode(200)
  @ApiOkResponse({ description: "Tabelas rodadas foram truncadas com sucesso" })
  @ApiOperation({ summary: "Truncar tabelas rodadas (CASCADE)" })
  async truncateRodadas(): Promise<{ message: string }> {
    await this.cleanupService.truncateRodadas();
    return { message: "Tabelas rodadas foram truncadas com sucesso" };
  }

  @Delete("all")
  @HttpCode(200)
  @ApiOkResponse({ description: "Todas as tabelas foram truncadas com sucesso" })
  @ApiOperation({ summary: "Truncar todas as tabelas (CASCADE)" })
  async truncateAll(): Promise<{ message: string }> {
    await this.cleanupService.truncateAll();
    return { message: "Todas as tabelas foram truncadas com sucesso" };
  }

  @Delete("all/reset")
  @HttpCode(200)
  @ApiOkResponse({ 
    description: "Todas as tabelas foram truncadas e sequências resetadas com sucesso" 
  })
  @ApiOperation({ 
    summary: "Truncar todas as tabelas e resetar sequências (CASCADE + RESET)" 
  })
  async truncateAllWithReset(): Promise<{ message: string }> {
    await this.cleanupService.truncateAllWithReset();
    return { 
      message: "Todas as tabelas foram truncadas e sequências resetadas com sucesso" 
    };
  }
}
