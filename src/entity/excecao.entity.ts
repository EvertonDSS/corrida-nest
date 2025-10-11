import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Campeonato } from "./campeonato.entity";
import { Cavalo } from "./cavalo.entity";

@Entity("excecao")
export class Excecao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "campeonatoid" })
  campeonatoId!: number;

  @ManyToOne(() => Campeonato)
  @JoinColumn({ name: "campeonatoid" })
  campeonato?: Campeonato;

  @Column({ name: "grupoid" })
  grupoId!: number;

  @Column({ name: "cavaloid" })
  cavaloId!: number;

  @ManyToOne(() => Cavalo)
  @JoinColumn({ name: "cavaloid" })
  cavalo?: Cavalo;
}
