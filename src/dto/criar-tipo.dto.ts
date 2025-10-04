import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CriarTipoDto {
  @ApiProperty({ description: "Nome do tipo", example: "Corrida de Velocidade" })
  @IsString()
  @IsNotEmpty()
  nome!: string;
}
