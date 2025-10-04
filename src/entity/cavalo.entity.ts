import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Aposta } from "./aposta.entity";
import { CavaloCampeonato } from "./cavalo-campeonato.entity";

@Entity("cavalo")
export class Cavalo extends BaseEntity {
  @Column({ length: 100 })
  nome?: string;

  @OneToMany(() => Aposta, (aposta) => aposta.cavalo, { cascade: true })
  apostas?: Aposta[];

  @OneToMany(
    () => CavaloCampeonato,
    (cavaloCampeonato) => cavaloCampeonato.cavalo,
    { cascade: true },
  )
  cavaloCampeonatos?: CavaloCampeonato[];
}
