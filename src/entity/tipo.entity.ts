import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Rodadas } from "./rodadas.entity";

@Entity("tipo")
export class Tipo extends BaseEntity {
  @Column({ length: 100 })
  nome?: string;

  @OneToMany(() => Rodadas, (rodadas) => rodadas.tipo, { cascade: true })
  rodadas?: Rodadas[];
}
