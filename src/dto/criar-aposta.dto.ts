// create-aposta.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class CreateApostaDto {
  @ApiProperty({ description: "ID do grupo de cavalos", example: 1 })
  grupoId: number | undefined;

  @ApiProperty({ description: "ID do campeonato", example: 1 })
  campeonatoId: number | undefined;

  @ApiProperty({ description: "ID do apostador", example: 1 })
  apostadorId: number | undefined;

  @ApiProperty({ description: "Total da aposta", example: 100.0 })
  total: number | undefined;

  @ApiProperty({ description: "Valor unitário da aposta", example: 10.0 })
  valorUnitario: number | undefined;

  @ApiProperty({ description: "Porcentagem da aposta", example: 10 })
  porcentagem: number | undefined;

  @ApiProperty({ description: "ID da rodada", example: 1 })
  rodadasId: number | undefined;
}
