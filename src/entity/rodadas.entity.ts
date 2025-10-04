import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Campeonato } from "./campeonato.entity";
import { Rodada } from "./rodada.entity";
import { Aposta } from "./aposta.entity";
import { Tipo } from "./tipo.entity";

@Entity("rodadas")
export class Rodadas extends BaseEntity {
  @Column()
  campeonatoId?: number;

  @ManyToOne(() => Campeonato, (campeonato) => campeonato.rodadas)
  @JoinColumn({ name: "campeonatoId" })
  campeonato!: Campeonato;

  @Column("decimal", { precision: 10, scale: 2 })
  valorRodada: number = 0;

  @Column("decimal", { precision: 5, scale: 2 })
  porcentagem: number = 0;

  @Column()
  rodadaId?: number;

  @ManyToOne(() => Rodada, (rodada) => rodada.rodadas)
  @JoinColumn({ name: "rodadaId" })
  rodada!: Rodada;

  @Column("decimal", { precision: 10, scale: 2 })
  valorPremio: number = 0;

  @OneToMany(() => Aposta, (aposta) => aposta.rodadas, { cascade: true })
  apostas?: Aposta[];

  @Column({ name: "tipoid" })
  tipoId?: number;

  @ManyToOne(() => Tipo, (tipo) => tipo.rodadas)
  @JoinColumn({ name: "tipoid" })
  tipo?: Tipo;

  calcularValorPremio() {
    this.valorPremio =
      this.valorRodada - this.valorRodada * (this.porcentagem / 100);
    console.log("this.valorPremio", this.valorPremio);
  }
}
