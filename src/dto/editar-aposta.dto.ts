// editar-aposta.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class EditarApostaDto {
  @ApiProperty({
    description: "Valor unitário da aposta",
    example: 10.0,
    required: false,
  })
  valorUnitario?: number;

  @ApiProperty({
    description: "Porcentagem da aposta",
    example: 10,
    required: false,
  })
  porcentagem?: number;
}

