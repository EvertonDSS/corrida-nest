import { DataSource } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { Apostador } from "./entity/apostador.entity";
import { Campeonato } from "./entity/campeonato.entity";
import { Rodada } from "./entity/rodada.entity";
import { Rodadas } from "./entity/rodadas.entity";
import { Aposta } from "./entity/aposta.entity";
import { Excecao } from "./entity/excecao.entity";
import { Cavalo } from "./entity/cavalo.entity";
import { CavaloCampeonato } from "./entity/cavalo-campeonato.entity";
import { Tipo } from "./entity/tipo.entity";
import { Finalista } from "./entity/finalista.entity";

const certPath = path.resolve(__dirname, "../certs");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "square-cloud-db-5f7fc35aec824eaf8faa4b4518907b79.squareweb.app",
  port: 7068,
  username: "squarecloud",
  password: "YlpqpZbevxvDgO439aLuNSte",
  database: "corrida",
  entities: [
    Apostador,
    Aposta,
    Excecao,
    Campeonato,
    Rodada,
    Rodadas,
    Cavalo,
    CavaloCampeonato,
    Tipo,
    Finalista,
  ],
  migrations: [path.join(__dirname, "./migrations/*{.ts,.js}")],
  schema: "public",
  ssl: {
    rejectUnauthorized: true,
    key: fs.readFileSync(path.join(certPath, "client.key")).toString(),
    cert: fs.readFileSync(path.join(certPath, "client.crt")).toString(),
    ca: fs.readFileSync(path.join(certPath, "client.pem")).toString(),
  },
});
