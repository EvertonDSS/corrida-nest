import { ApiProperty } from "@nestjs/swagger";

export class CriarFinalistaSemTipoDto {
  @ApiProperty({
    description: "ID do cavalo",
    example: 1,
  })
  cavaloId!: number;

  @ApiProperty({
    description: "ID do grupo",
    example: 1,
  })
  grupoId!: number;
}

