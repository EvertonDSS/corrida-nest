import { ApiProperty } from "@nestjs/swagger";

export class CriarFinalistaDto {
  @ApiProperty({
    description: "ID do tipo de aposta",
    example: 1,
  })
  tipoId!: number;

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

