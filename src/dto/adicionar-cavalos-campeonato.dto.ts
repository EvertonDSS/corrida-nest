import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches } from "class-validator";

export class CavaloPareoDto {
  @ApiProperty({ description: "ID do cavalo", example: 1 })
  cavaloId!: number;

  @ApiProperty({ 
    description: "Número do pareo formatado com zero à esquerda", 
    example: "01",
    pattern: "^[0-9]{2}$"
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{2}$/, { message: "Número do pareo deve ter exatamente 2 dígitos (ex: 01, 02, 03)" })
  numeroPareo!: string;
}

export class AdicionarCavalosCampeonatoDto {
  @ApiProperty({ description: "ID do campeonato", example: 1 })
  campeonatoId!: number;

  @ApiProperty({ 
    description: "Lista de cavalos com seus respectivos pareos", 
    type: [CavaloPareoDto],
    example: [
      { cavaloId: 1, numeroPareo: "01" },
      { cavaloId: 2, numeroPareo: "01" },
      { cavaloId: 3, numeroPareo: "02" }
    ]
  })
  cavalos!: CavaloPareoDto[];
}
