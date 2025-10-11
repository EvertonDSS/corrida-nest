import { ApiProperty } from "@nestjs/swagger";

export class CreateExcecaoDto {
  @ApiProperty({ description: "ID do campeonato", example: 1 })
  campeonatoId!: number;

  @ApiProperty({ description: "ID do grupo de cavalos", example: 1 })
  grupoId!: number;

  @ApiProperty({ description: "ID do cavalo a ser removido do grupo", example: 36 })
  cavaloId!: number;
}
