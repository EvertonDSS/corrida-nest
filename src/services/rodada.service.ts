import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Rodada } from "../entity/rodada.entity";
import { Rodadas } from "src/entity/rodadas.entity";

@Injectable()
export class RodadaService {
  constructor(
    @InjectRepository(Rodada)
    private rodadaRepository: Repository<Rodada>,
    @InjectRepository(Rodadas)
    private rodadasRepository: Repository<Rodadas>,
  ) {}

  async buscarTodos(): Promise<Rodada[]> {
    return await this.rodadaRepository.find();
  }

  async buscarPorId(id: number): Promise<Rodada | null> {
    const rodada = await this.rodadaRepository.findOne({ where: { id } });
    if (!rodada) {
      throw new NotFoundException(`Rodada com id ${id} não encontrada`);
    }
    return rodada;
  }

  async criar(rodada: Rodada): Promise<Rodada> {
    return await this.rodadaRepository.save(rodada);
  }

  async criarPorCampeonato(rodadas: Rodadas) {
    rodadas.calcularValorPremio();
    return await this.rodadasRepository.save(rodadas);
  }

  async buscarPorCampeonato(): Promise<Rodadas[]> {
    const rodadas = await this.rodadasRepository.find({
      relations: ["rodada", "campeonato"],
    });
    if (!rodadas) {
      throw new NotFoundException(`Rodadas não encontradas`);
    }
    return rodadas;
  }

  async buscarRodadasPorCampeonatoId(campeonatoId: number): Promise<{
    nomeCampeonato: string;
    rodadas: { id: number; nomeRodada: string }[];
  }> {
    const rodadas = await this.rodadasRepository.find({
      where: { campeonatoId },
      relations: ["rodada", "campeonato"],
    });

    if (!rodadas || rodadas.length === 0) {
      throw new NotFoundException(
        `Rodadas não encontradas para o campeonato ${campeonatoId}`,
      );
    }

    const nomeCampeonato = rodadas[0].campeonato.nome || "";

    const rodadasFormatadas = rodadas.map((rodada) => ({
      id: rodada.rodada.id,
      nomeRodada: rodada.rodada.nomeRodada || "",
    }));

    return {
      nomeCampeonato,
      rodadas: rodadasFormatadas,
    };
  }
}
