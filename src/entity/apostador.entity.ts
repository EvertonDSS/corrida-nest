import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Aposta } from "./aposta.entity";

@Entity("apostador")
export class Apostador extends BaseEntity {
  @Column({ length: 100 })
  nome?: string;

  @OneToMany(() => Aposta, (aposta) => aposta.apostador, { cascade: true })
  apostas?: Aposta[];
}
