import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1761007516000 implements MigrationInterface {
  name = "InitialSchema1761007516000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tables
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "apostador" (
        "id" SERIAL NOT NULL,
        "nome" character varying(100) NOT NULL,
        CONSTRAINT "PK_apostador" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "rodada" (
        "id" SERIAL NOT NULL,
        "nomeRodada" character varying(100) NOT NULL,
        CONSTRAINT "PK_rodada" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "campeonato" (
        "id" SERIAL NOT NULL,
        "nome" character varying(100) NOT NULL,
        "ano" integer NOT NULL,
        CONSTRAINT "PK_campeonato" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tipo" (
        "id" SERIAL NOT NULL,
        "nome" character varying(100) NOT NULL,
        CONSTRAINT "PK_tipo" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cavalo" (
        "id" SERIAL NOT NULL,
        "nome" character varying(100) NOT NULL,
        CONSTRAINT "PK_cavalo" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "rodadas" (
        "id" SERIAL NOT NULL,
        "campeonatoId" integer NOT NULL,
        "valorRodada" numeric(10,2) NOT NULL DEFAULT 0,
        "porcentagem" numeric(5,2) NOT NULL DEFAULT 0,
        "rodadaId" integer NOT NULL,
        "valorPremio" numeric(10,2) NOT NULL DEFAULT 0,
        "tipoid" integer NOT NULL,
        CONSTRAINT "PK_rodadas" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cavalo_campeonato" (
        "id" SERIAL NOT NULL,
        "cavaloid" integer NOT NULL,
        "campeonatoid" integer NOT NULL,
        "numeropareo" character varying(2) NOT NULL,
        "grupoid" integer NOT NULL,
        CONSTRAINT "PK_cavalo_campeonato" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "apostas" (
        "id" SERIAL NOT NULL,
        "campeonatoId" integer NOT NULL,
        "apostadorId" integer NOT NULL,
        "total" numeric(10,2) NOT NULL,
        "valorUnitario" numeric(10,2) NOT NULL,
        "porcentagem" numeric(5,2) NOT NULL,
        "rodadasid" integer NOT NULL,
        "grupoid" integer NOT NULL,
        CONSTRAINT "PK_apostas" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "excecao" (
        "id" SERIAL NOT NULL,
        "campeonatoid" integer NOT NULL,
        "grupoid" integer NOT NULL,
        "cavaloid" integer NOT NULL,
        CONSTRAINT "PK_excecao" PRIMARY KEY ("id")
      )
    `);

    // Add foreign keys
    await queryRunner.query(`
      ALTER TABLE "rodadas" ADD CONSTRAINT "FK_rodadas_campeonato"
      FOREIGN KEY ("campeonatoId") REFERENCES "campeonato"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "rodadas" ADD CONSTRAINT "FK_rodadas_rodada"
      FOREIGN KEY ("rodadaId") REFERENCES "rodada"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "rodadas" ADD CONSTRAINT "FK_rodadas_tipo"
      FOREIGN KEY ("tipoid") REFERENCES "tipo"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "cavalo_campeonato" ADD CONSTRAINT "FK_cavalo_campeonato_cavalo"
      FOREIGN KEY ("cavaloid") REFERENCES "cavalo"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "cavalo_campeonato" ADD CONSTRAINT "FK_cavalo_campeonato_campeonato"
      FOREIGN KEY ("campeonatoid") REFERENCES "campeonato"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "apostas" ADD CONSTRAINT "FK_apostas_campeonato"
      FOREIGN KEY ("campeonatoId") REFERENCES "campeonato"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "apostas" ADD CONSTRAINT "FK_apostas_apostador"
      FOREIGN KEY ("apostadorId") REFERENCES "apostador"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "apostas" ADD CONSTRAINT "FK_apostas_rodadas"
      FOREIGN KEY ("rodadasid") REFERENCES "rodadas"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "excecao" ADD CONSTRAINT "FK_excecao_campeonato"
      FOREIGN KEY ("campeonatoid") REFERENCES "campeonato"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "excecao" ADD CONSTRAINT "FK_excecao_cavalo"
      FOREIGN KEY ("cavaloid") REFERENCES "cavalo"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.query(`ALTER TABLE "excecao" DROP CONSTRAINT "FK_excecao_cavalo"`);
    await queryRunner.query(`ALTER TABLE "excecao" DROP CONSTRAINT "FK_excecao_campeonato"`);
    await queryRunner.query(`ALTER TABLE "apostas" DROP CONSTRAINT "FK_apostas_rodadas"`);
    await queryRunner.query(`ALTER TABLE "apostas" DROP CONSTRAINT "FK_apostas_apostador"`);
    await queryRunner.query(`ALTER TABLE "apostas" DROP CONSTRAINT "FK_apostas_campeonato"`);
    await queryRunner.query(`ALTER TABLE "cavalo_campeonato" DROP CONSTRAINT "FK_cavalo_campeonato_campeonato"`);
    await queryRunner.query(`ALTER TABLE "cavalo_campeonato" DROP CONSTRAINT "FK_cavalo_campeonato_cavalo"`);
    await queryRunner.query(`ALTER TABLE "rodadas" DROP CONSTRAINT "FK_rodadas_tipo"`);
    await queryRunner.query(`ALTER TABLE "rodadas" DROP CONSTRAINT "FK_rodadas_rodada"`);
    await queryRunner.query(`ALTER TABLE "rodadas" DROP CONSTRAINT "FK_rodadas_campeonato"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "excecao"`);
    await queryRunner.query(`DROP TABLE "apostas"`);
    await queryRunner.query(`DROP TABLE "cavalo_campeonato"`);
    await queryRunner.query(`DROP TABLE "rodadas"`);
    await queryRunner.query(`DROP TABLE "cavalo"`);
    await queryRunner.query(`DROP TABLE "tipo"`);
    await queryRunner.query(`DROP TABLE "campeonato"`);
    await queryRunner.query(`DROP TABLE "rodada"`);
    await queryRunner.query(`DROP TABLE "apostador"`);
  }
}

