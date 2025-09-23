import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Rodadas } from "./rodadas.entity";

@Entity("rodada")
export class Rodada extends BaseEntity {
  @Column({ length: 100 })
  nomeRodada?: string;

  @OneToMany(() => Rodadas, (rodadas) => rodadas.rodada, { cascade: true })
  rodadas?: Rodadas[];
}
