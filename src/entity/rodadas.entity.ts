import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Campeonato } from "./campeonato.entity";
import { Rodada } from "./rodada.entity";

@Entity("rodadas_detalhes")
export class Rodadas extends BaseEntity {
  @Column()
  campeonatoId?: number;

  @ManyToOne(() => Campeonato, (campeonato) => campeonato.rodadas)
  @JoinColumn({ name: "campeonatoId" })
  campeonato!: Campeonato;

  @Column("decimal", { precision: 10, scale: 2 })
  valorRodada?: number;

  @Column("decimal", { precision: 5, scale: 2 })
  porcentagem: number;

  @Column()
  rodadaId?: number;

  @ManyToOne(() => Rodada, (rodada) => rodada.rodadas)
  @JoinColumn({ name: "rodadaId" })
  rodada!: Rodada;

  @Column("decimal", { precision: 10, scale: 2 })
  valorPremio?: number;

  constructor(valorRodada: number, porcentagem: number, valorPremio: number) {
    super();

    this.valorRodada = valorRodada;
    this.porcentagem = porcentagem;
    this.valorPremio =
      valorPremio ?? valorRodada - valorRodada * (porcentagem / 100);
  }
}
