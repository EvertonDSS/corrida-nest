import { Module } from "@nestjs/common";
import * as Controllers from "./controller";
import * as Services from "./services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppDataSource } from "./data-source";
import { Aposta } from "./entity/aposta.entity";
import { Excecao } from "./entity/excecao.entity";
import { Campeonato } from "./entity/campeonato.entity";
import { Rodada } from "./entity/rodada.entity";
import { Rodadas } from "./entity/rodadas.entity";
import { Cavalo } from "./entity/cavalo.entity";
import { Apostador } from "./entity/apostador.entity";
import { CavaloCampeonato } from "./entity/cavalo-campeonato.entity";
import { Tipo } from "./entity/tipo.entity";
import { Finalista } from "./entity/finalista.entity";

@Module({
  imports: [
    // Configura o TypeORM com todas as entidades
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      entities: [Apostador, Aposta, Excecao, Campeonato, Rodada, Rodadas, Cavalo, CavaloCampeonato, Tipo, Finalista],
    }),
    TypeOrmModule.forFeature([
      Aposta,
      Excecao,
      Cavalo,
      Apostador,
      Campeonato,
      Rodada,
      Rodadas,
      CavaloCampeonato,
      Tipo,
      Finalista,
    ]),
  ],
  controllers: Object.values(Controllers),
  providers: Object.values(Services),
})
export class AppModule {}
