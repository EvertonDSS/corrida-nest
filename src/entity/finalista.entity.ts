import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Campeonato } from "./campeonato.entity";
import { Cavalo } from "./cavalo.entity";
import { Tipo } from "./tipo.entity";

@Entity("finalista")
export class Finalista extends BaseEntity {
  @Column({ name: "campeonatoid" })
  campeonatoId?: number;

  @ManyToOne(() => Campeonato)
  @JoinColumn({ name: "campeonatoid" })
  campeonato?: Campeonato;

  @Column({ name: "tipoid" })
  tipoId?: number;

  @ManyToOne(() => Tipo)
  @JoinColumn({ name: "tipoid" })
  tipo?: Tipo;

  @Column({ name: "cavaloid" })
  cavaloId?: number;

  @ManyToOne(() => Cavalo)
  @JoinColumn({ name: "cavaloid" })
  cavalo?: Cavalo;

  @Column({ name: "grupoid" })
  grupoId?: number;
}
