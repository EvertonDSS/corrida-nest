import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Aposta } from "../entity/aposta.entity";
import { Apostador } from "../entity/apostador.entity";
import { Campeonato } from "../entity/campeonato.entity";
import { Cavalo } from "../entity/cavalo.entity";
import { Rodada } from "../entity/rodada.entity";
import { Rodadas } from "../entity/rodadas.entity";

@Injectable()
export class CleanupService {
  constructor(
    @InjectRepository(Aposta)
    private apostaRepository: Repository<Aposta>,
    @InjectRepository(Apostador)
    private apostadorRepository: Repository<Apostador>,
    @InjectRepository(Campeonato)
    private campeonatoRepository: Repository<Campeonato>,
    @InjectRepository(Cavalo)
    private cavaloRepository: Repository<Cavalo>,
    @InjectRepository(Rodada)
    private rodadaRepository: Repository<Rodada>,
    @InjectRepository(Rodadas)
    private rodadasRepository: Repository<Rodadas>,
  ) {}

  async truncateApostas(): Promise<void> {
    await this.apostaRepository.query("TRUNCATE TABLE apostas CASCADE");
  }

  async truncateApostadores(): Promise<void> {
    await this.apostadorRepository.query("TRUNCATE TABLE apostador CASCADE");
  }

  async truncateCampeonatos(): Promise<void> {
    await this.campeonatoRepository.query("TRUNCATE TABLE campeonato CASCADE");
  }

  async truncateCavalos(): Promise<void> {
    await this.cavaloRepository.query("TRUNCATE TABLE cavalo CASCADE");
  }

  async truncateRodadas(): Promise<void> {
    await this.rodadasRepository.query("TRUNCATE TABLE rodadas CASCADE");
    await this.rodadaRepository.query("TRUNCATE TABLE rodada CASCADE");
  }

  async truncateAll(): Promise<void> {
    // Ordem específica para evitar problemas de foreign key
    await this.apostaRepository.query("TRUNCATE TABLE apostas CASCADE");
    await this.rodadasRepository.query("TRUNCATE TABLE rodadas CASCADE");
    await this.rodadaRepository.query("TRUNCATE TABLE rodada CASCADE");
    await this.apostadorRepository.query("TRUNCATE TABLE apostador CASCADE");
    await this.cavaloRepository.query("TRUNCATE TABLE cavalo CASCADE");
    await this.campeonatoRepository.query("TRUNCATE TABLE campeonato CASCADE");
  }

  async resetSequences(): Promise<void> {
    // Resetar as sequências dos IDs para começar do 1
    await this.apostaRepository.query("ALTER SEQUENCE apostas_id_seq RESTART WITH 1");
    await this.apostadorRepository.query("ALTER SEQUENCE apostador_id_seq RESTART WITH 1");
    await this.campeonatoRepository.query("ALTER SEQUENCE campeonato_id_seq RESTART WITH 1");
    await this.cavaloRepository.query("ALTER SEQUENCE cavalo_id_seq RESTART WITH 1");
    await this.rodadaRepository.query("ALTER SEQUENCE rodada_id_seq RESTART WITH 1");
    await this.rodadasRepository.query("ALTER SEQUENCE rodadas_id_seq RESTART WITH 1");
  }

  async truncateAllWithReset(): Promise<void> {
    await this.truncateAll();
    await this.resetSequences();
  }
}
