import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Campeonato } from "./campeonato.entity";
import { Apostador } from "./apostador.entity";
import { Rodadas } from "./rodadas.entity";
import { BaseEntity } from "./base.entity";

@Entity("apostas")
export class Aposta extends BaseEntity {
  @Column()
  campeonatoId?: number;

  @ManyToOne(() => Campeonato, (campeonato) => campeonato.apostas)
  @JoinColumn({ name: "campeonatoId" })
  campeonato?: Campeonato;

  @Column()
  apostadorId?: number;

  @ManyToOne(() => Apostador, (apostador) => apostador.apostas)
  @JoinColumn({ name: "apostadorId" })
  apostador?: Apostador;

  @Column("decimal", { precision: 10, scale: 2 })
  total?: number;

  @Column("decimal", { precision: 10, scale: 2 })
  valorUnitario?: number;

  @Column("decimal", { precision: 5, scale: 2 })
  porcentagem?: number;

  @Column({ name: "rodadasid" })
  rodadasId?: number;

  @ManyToOne(() => Rodadas, (rodadas) => rodadas.apostas)
  @JoinColumn({ name: "rodadasid" })
  rodadas?: Rodadas;

  @Column({ name: "grupoid" })
  grupoId?: number;
}
