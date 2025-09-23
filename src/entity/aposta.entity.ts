import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Cavalo } from "./cavalo.entity";
import { Campeonato } from "./campeonato.entity";
import { Apostador } from "./apostador.entity";
import { BaseEntity } from "./base.entity";

@Entity("apostas")
export class Aposta extends BaseEntity {
  @Column()
  cavaloId?: number;

  @ManyToOne(() => Cavalo, (cavalo) => cavalo.apostas)
  @JoinColumn({ name: "cavaloId" })
  cavalo!: Cavalo;

  @Column()
  campeonatoId?: number;

  @ManyToOne(() => Campeonato, (campeonato) => campeonato.apostas)
  @JoinColumn({ name: "campeonatoId" })
  campeonato!: Campeonato;

  @Column()
  apostadorId?: number;

  @ManyToOne(() => Apostador, (apostador) => apostador.apostas)
  @JoinColumn({ name: "apostadorId" })
  apostador!: Apostador;

  @Column("decimal", { precision: 10, scale: 2 })
  total?: number;

  @Column("decimal", { precision: 10, scale: 2 })
  valorUnitario?: number;

  @Column("decimal", { precision: 5, scale: 2 })
  porcentagem?: number;
}
