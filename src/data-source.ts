import { DataSource } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { Apostador } from "./entity/apostador.entity";
import { Campeonato } from "./entity/campeonato.entity";
import { Rodada } from "./entity/rodada.entity";
import { Rodadas } from "./entity/rodadas.entity";
import { Aposta } from "./entity/aposta.entity";
import { Cavalo } from "./entity/cavalo.entity";

const certPath = path.resolve(__dirname, "../certs");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "square-cloud-db-a3351b7b71d743b1a91df27cdad25eac.squareweb.app",
  port: 7053,
  username: "squarecloud",
  password: "keExiI36dK12jQt1ABBlYOE2",
  database: "Corrida",
  entities: [Apostador, Aposta, Campeonato, Rodada, Rodadas, Cavalo],
  migrations: [path.join(__dirname, "./migrations/*{.ts,.js}")],
  schema: "public",
  ssl: {
    rejectUnauthorized: true,
    key: fs.readFileSync(path.join(certPath, "client.key")).toString(),
    cert: fs.readFileSync(path.join(certPath, "client.crt")).toString(),
    ca: fs.readFileSync(path.join(certPath, "client.pem")).toString(),
  },
});
