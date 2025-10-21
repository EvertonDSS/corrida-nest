import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Campeonato } from "../entity/campeonato.entity";
import { Apostador } from "../entity/apostador.entity";
import { Aposta } from "../entity/aposta.entity";
import { CavaloCampeonato } from "../entity/cavalo-campeonato.entity";
import { Excecao } from "../entity/excecao.entity";

@Injectable()
export class CampeonatoService {
  constructor(
    @InjectRepository(Campeonato)
    private campeonatoRepository: Repository<Campeonato>,
    @InjectRepository(Apostador)
    private apostadorRepository: Repository<Apostador>,
    @InjectRepository(Aposta)
    private apostaRepository: Repository<Aposta>,
    private dataSource: DataSource,
  ) {}

  async buscarTodos(): Promise<Campeonato[]> {
    return await this.campeonatoRepository.find();
  }

  async buscarPorId(id: number): Promise<Campeonato | null> {
    const campeonato = await this.campeonatoRepository.findOne({
      where: { id },
    });
    if (!campeonato) {
      throw new NotFoundException(`Campeonato com id ${id} não encontrado`);
    }
    return campeonato;
  }

  async criar(campeonato: Campeonato): Promise<Campeonato> {
    return await this.campeonatoRepository.save(campeonato);
  }

  async buscarApostadoresDoCampeonato(
    campeonatoId: number,
  ): Promise<Apostador[]> {
    const apostadores = await this.apostadorRepository
      .createQueryBuilder("apostador")
      .innerJoin("apostador.apostas", "aposta")
      .where("aposta.campeonatoId = :campeonatoId", { campeonatoId })
      .distinct(true)
      .getMany();

    return apostadores;
  }

  async buscarApostasDoApostadorNoCampeonato(
    campeonatoId: number,
    apostadorId: number,
  ): Promise<any[]> {
    const apostas = await this.apostaRepository.find({
      where: {
        campeonatoId,
        apostadorId,
      },
      relations: ["campeonato", "rodadas", "rodadas.rodada"],
    });

    // Enriquecer cada aposta com informações dos cavalos filtrados por exceções
    return await Promise.all(
      apostas.map(async (aposta) => {
        const cavalosInfo = await this.buscarCavalosDoGrupo(
          aposta.campeonatoId!,
          aposta.grupoId!,
        );
        return {
          ...aposta,
          cavalos: cavalosInfo,
        };
      }),
    );
  }

  async buscarApostasDoApostadorNoCampeonatoV2(
    campeonatoId: number,
    apostadorId: number,
  ): Promise<any[]> {
    const apostas = await this.apostaRepository.find({
      where: {
        campeonatoId,
        apostadorId,
      },
      relations: ["campeonato", "apostador", "rodadas", "rodadas.rodada"],
    });

    // Buscar todas as exceções do campeonato
    const excecoes = await this.dataSource.getRepository(Excecao).find({
      where: { campeonatoId },
    });

    // Filtrar e enriquecer apostas
    const apostasProcessadas = await Promise.all(
      apostas.map(async (aposta) => {
        // Buscar cavalos do grupo
        const cavalosDoGrupo = await this.dataSource
          .getRepository(CavaloCampeonato)
          .find({
            where: {
              campeonatoId,
              grupoId: aposta.grupoId,
            },
            relations: ["cavalo"],
            order: { id: "ASC" },
          });

        // Buscar exceções deste grupo
        const excecoesDoGrupo = excecoes.filter(
          (e) => e.grupoId === aposta.grupoId,
        );

        // Filtrar cavalos disponíveis
        const cavalosDisponiveis = cavalosDoGrupo.filter(
          (cavalo) =>
            !excecoesDoGrupo.some((exc) => exc.cavaloId === cavalo.cavaloId),
        );

        // Se não tem cavalos disponíveis, retorna null (será filtrado depois)
        if (cavalosDisponiveis.length === 0) {
          return null;
        }

        // Formatar string de cavalos
        const nomes = cavalosDisponiveis
          .map((cc) => cc.cavalo?.nome || "")
          .filter((nome) => nome);
        const cavalosString =
          cavalosDoGrupo.length > 0
            ? `${cavalosDoGrupo[0].numeroPareo} - ${nomes.join(" - ")}`
            : "";

        // Calcular valorPremio correto e total da aposta
        const rodada = aposta.rodadas;
        let valorPremioCalculado: string | number | undefined =
          rodada?.valorPremio;
        let totalCalculado: string | number | undefined = aposta.total;

        if (rodada && rodada.valorRodada && rodada.porcentagem) {
          const valorRodadaNum = Number(rodada.valorRodada);
          const porcentagemRodadaNum = Number(rodada.porcentagem);
          const porcentagemApostaNum = Number(aposta.porcentagem);

          // valorPremio = valorRodada - (valorRodada * porcentagemRodada / 100)
          // Ex: 2750 - (2750 * 20 / 100) = 2750 - 550 = 2200
          valorPremioCalculado = (
            valorRodadaNum -
            (valorRodadaNum * porcentagemRodadaNum) / 100
          ).toFixed(2);

          // total = (valorPremio * porcentagemAposta) / 100
          // Ex: 2200 * 100 / 100 = 2200
          const valorPremioNum = Number(valorPremioCalculado);
          totalCalculado = (
            (valorPremioNum * porcentagemApostaNum) /
            100
          ).toFixed(2);
        }

        // Retornar aposta com valores calculados
        return {
          id: aposta.id,
          campeonatoId: aposta.campeonatoId,
          campeonato: aposta.campeonato,
          apostadorId: aposta.apostadorId,
          apostador: aposta.apostador,
          total: totalCalculado,
          valorUnitario: aposta.valorUnitario,
          porcentagem: aposta.porcentagem,
          rodadasId: aposta.rodadasId,
          rodadas: rodada
            ? {
                ...rodada,
                valorPremio: valorPremioCalculado,
              }
            : null,
          grupoId: aposta.grupoId,
          cavalos: cavalosString,
        };
      }),
    );

    // Filtrar apostas nulas (sem cavalos disponíveis)
    return apostasProcessadas.filter((aposta) => aposta !== null);
  }

  async buscarCavalosAgrupadosPorTipo(campeonatoId: number): Promise<any> {
    // Buscar todas as apostas do campeonato com suas relações
    const apostas = await this.apostaRepository.find({
      where: { campeonatoId },
      relations: ["rodadas", "rodadas.tipo"],
    });

    if (!apostas || apostas.length === 0) {
      throw new NotFoundException(
        `Nenhuma aposta encontrada para o campeonato ${campeonatoId}`,
      );
    }

    // Buscar todos os cavalos do campeonato
    const cavalos = await this.dataSource.getRepository(CavaloCampeonato).find({
      where: { campeonatoId },
      relations: ["cavalo"],
      order: { numeroPareo: "ASC" },
    });

    // Agrupar por tipoId
    const agrupadoPorTipo: any = {};

    for (const aposta of apostas) {
      const tipoId = aposta.rodadas?.tipoId;
      const tipoNome = aposta.rodadas?.tipo?.nome || "Sem tipo";

      if (!tipoId) continue;

      // Inicializar o grupo se não existir
      if (!agrupadoPorTipo[tipoId]) {
        agrupadoPorTipo[tipoId] = {
          tipoId,
          tipoNome,
          cavalos: {},
        };
      }

      // Buscar cavalos do grupo desta aposta
      const cavalosDoGrupo = cavalos.filter(
        (c) => c.grupoId === aposta.grupoId,
      );

      // Para cada cavalo do grupo, somar os valores
      for (const cavaloCampeonato of cavalosDoGrupo) {
        const cavaloId = cavaloCampeonato.cavaloId;
        const cavaloNome = cavaloCampeonato.cavalo?.nome || "Desconhecido";
        const numeroPareo = cavaloCampeonato.numeroPareo || "";
        const grupoId = cavaloCampeonato.grupoId;

        if (!cavaloId) continue;

        // Criar chave única por cavalo E grupo
        const chave = `${cavaloId}_${grupoId}`;

        // Inicializar o cavalo se não existir
        if (!agrupadoPorTipo[tipoId].cavalos[chave]) {
          agrupadoPorTipo[tipoId].cavalos[chave] = {
            cavaloId,
            cavaloNome,
            numeroPareo,
            grupoId,
            valorTotal: 0,
          };
        }

        // Somar o valor da aposta
        agrupadoPorTipo[tipoId].cavalos[chave].valorTotal += Number(
          aposta.valorUnitario || 0,
        );
      }
    }

    // Converter o objeto em array e formatar
    const resultado = Object.values(agrupadoPorTipo).map((tipo: any) => ({
      tipoId: tipo.tipoId,
      tipoNome: tipo.tipoNome,
      cavalos: Object.values(tipo.cavalos)
        .map((cavalo: any) => ({
          cavaloId: cavalo.cavaloId,
          cavaloNome: cavalo.cavaloNome,
          numeroPareo: cavalo.numeroPareo,
          grupoId: cavalo.grupoId,
          valorTotal: Number(cavalo.valorTotal).toFixed(2),
        }))
        .sort((a: any, b: any) => a.numeroPareo.localeCompare(b.numeroPareo)),
    }));

    return resultado;
  }

  async buscarCavalosPorTipo(
    campeonatoId: number,
    tipoId: number,
  ): Promise<any> {
    // Reutilizar a lógica existente e filtrar pelo tipo
    const todosOsTipos = await this.buscarCavalosAgrupadosPorTipo(campeonatoId);

    // Converter tipoId para número para garantir comparação correta
    const tipoIdNumber = Number(tipoId);

    // Encontrar o tipo específico
    const tipoEspecifico = todosOsTipos.find(
      (t: any) => t.tipoId === tipoIdNumber,
    );

    if (!tipoEspecifico) {
      throw new NotFoundException(
        `Nenhuma aposta encontrada para o tipo ${tipoId} no campeonato ${campeonatoId}`,
      );
    }

    return tipoEspecifico;
  }

  private async buscarCavalosDoGrupo(
    campeonatoId: number,
    grupoId: number,
  ): Promise<string | null> {
    if (!campeonatoId || !grupoId) return null;

    // Buscar cavalos do grupo
    const cavalos = await this.dataSource.getRepository(CavaloCampeonato).find({
      where: { campeonatoId, grupoId },
      relations: ["cavalo"],
      order: { id: "ASC" },
    });

    if (!cavalos || cavalos.length === 0) return null;

    // Buscar exceções do grupo
    const excecoes = await this.dataSource.getRepository(Excecao).find({
      where: { campeonatoId, grupoId },
    });

    const cavalosExcluidos = excecoes.map((e) => e.cavaloId);

    // Filtrar cavalos removidos por exceções
    const cavalosFiltrados = cavalos.filter(
      (cc) => cc.cavaloId && !cavalosExcluidos.includes(cc.cavaloId),
    );

    if (cavalosFiltrados.length === 0) return "Nenhum cavalo disponível";

    // Retornar nomes dos cavalos concatenados
    const nomes = cavalosFiltrados
      .map((cc) => cc.cavalo?.nome || "")
      .filter((nome) => nome);

    return `${cavalos[0].numeroPareo} - ${nomes.join(" - ")}`;
  }
}
