import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Cavalo } from "./cavalo.entity";
import { Campeonato } from "./campeonato.entity";

@Entity("cavalo_campeonato")
export class CavaloCampeonato extends BaseEntity {
  @Column({ name: "cavaloid" })
  cavaloId?: number;

  @ManyToOne(() => Cavalo, (cavalo) => cavalo.cavaloCampeonatos)
  @JoinColumn({ name: "cavaloid" })
  cavalo?: Cavalo;

  @Column({ name: "campeonatoid" })
  campeonatoId?: number;

  @ManyToOne(() => Campeonato, (campeonato) => campeonato.cavaloCampeonatos)
  @JoinColumn({ name: "campeonatoid" })
  campeonato?: Campeonato;

  @Column({ name: "numeropareo", length: 2 })
  numeroPareo?: string;

  @Column({ name: "grupoid" })
  grupoId?: number;
}
