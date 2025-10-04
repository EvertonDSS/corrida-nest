import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Aposta } from "./aposta.entity";
import { Rodadas } from "./rodadas.entity";
import { CavaloCampeonato } from "./cavalo-campeonato.entity";

@Entity("campeonato")
export class Campeonato extends BaseEntity {
  @Column({ length: 100 })
  nome?: string;

  @Column()
  ano?: number;

  @OneToMany(() => Aposta, (aposta) => aposta.campeonato, { cascade: true })
  apostas?: Aposta[];

  @OneToMany(() => Rodadas, (rodada) => rodada.campeonato, { cascade: true })
  rodadas?: Rodadas[];

  @OneToMany(
    () => CavaloCampeonato,
    (cavaloCampeonato) => cavaloCampeonato.campeonato,
    { cascade: true },
  )
  cavaloCampeonatos?: CavaloCampeonato[];
}
