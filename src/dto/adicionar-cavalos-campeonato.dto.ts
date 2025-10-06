import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches } from "class-validator";

export class PareoDto {
  @ApiProperty({ 
    description: "Número do pareo formatado com zero à esquerda", 
    example: "01",
    pattern: "^[0-9]{2}$"
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{2}$/, { message: "Número do pareo deve ter exatamente 2 dígitos (ex: 01, 02, 03)" })
  nomePareo!: string;

  @ApiProperty({ 
    description: "Lista de IDs dos cavalos deste pareo", 
    type: [Number],
    example: [1, 2, 3]
  })
  @IsNotEmpty()
  cavalos!: number[];
}

export class AdicionarCavalosCampeonatoDto {
  @ApiProperty({ description: "ID do campeonato", example: 1 })
  campeonatoId!: number;

  @ApiProperty({ 
    description: "Lista de pareos com seus respectivos cavalos", 
    type: [PareoDto],
    example: [
      { nomePareo: "01", cavalos: [1, 2, 3] },
      { nomePareo: "02", cavalos: [4, 5] }
    ]
  })
  pareos!: PareoDto[];
}
