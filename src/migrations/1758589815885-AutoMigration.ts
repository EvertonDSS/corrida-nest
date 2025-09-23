import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1758589815885 implements MigrationInterface {
    name = 'AutoMigration1758589815885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cavalo" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, CONSTRAINT "PK_aacad217d88944af91534b62bfa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rodada" ("id" SERIAL NOT NULL, "nomeRodada" character varying(100) NOT NULL, CONSTRAINT "PK_47e70085599307225ba31078dda" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rodadas_detalhes" ("id" SERIAL NOT NULL, "campeonatoId" integer NOT NULL, "valorRodada" numeric(10,2) NOT NULL, "porcentagem" numeric(5,2) NOT NULL, "rodadaId" integer NOT NULL, "valorPremio" numeric(10,2) NOT NULL, CONSTRAINT "PK_1b48002195a047c0da33fb74693" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "campeonato" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, "ano" integer NOT NULL, CONSTRAINT "PK_bd82c1720b3b90a3bf6d22934a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "apostas" ("id" SERIAL NOT NULL, "cavaloId" integer NOT NULL, "campeonatoId" integer NOT NULL, "apostadorId" integer NOT NULL, "total" numeric(10,2) NOT NULL, "valorUnitario" numeric(10,2) NOT NULL, "porcentagem" numeric(5,2) NOT NULL, CONSTRAINT "PK_3d953015ea9f51b840343239ce6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "apostador" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, CONSTRAINT "PK_73c08deff6137cc9d17616a104f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rodadas_detalhes" ADD CONSTRAINT "FK_ab2c4fcaec1c0e9f4646ac438b7" FOREIGN KEY ("campeonatoId") REFERENCES "campeonato"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rodadas_detalhes" ADD CONSTRAINT "FK_d2f024369cc7bdf6a3caf04893c" FOREIGN KEY ("rodadaId") REFERENCES "rodada"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apostas" ADD CONSTRAINT "FK_3331afebc00f1aa5fa153d2f305" FOREIGN KEY ("cavaloId") REFERENCES "cavalo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apostas" ADD CONSTRAINT "FK_52f7624a3b3940bdea266c83600" FOREIGN KEY ("campeonatoId") REFERENCES "campeonato"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apostas" ADD CONSTRAINT "FK_ab6a8b6260328382970f676444c" FOREIGN KEY ("apostadorId") REFERENCES "apostador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apostas" DROP CONSTRAINT "FK_ab6a8b6260328382970f676444c"`);
        await queryRunner.query(`ALTER TABLE "apostas" DROP CONSTRAINT "FK_52f7624a3b3940bdea266c83600"`);
        await queryRunner.query(`ALTER TABLE "apostas" DROP CONSTRAINT "FK_3331afebc00f1aa5fa153d2f305"`);
        await queryRunner.query(`ALTER TABLE "rodadas_detalhes" DROP CONSTRAINT "FK_d2f024369cc7bdf6a3caf04893c"`);
        await queryRunner.query(`ALTER TABLE "rodadas_detalhes" DROP CONSTRAINT "FK_ab2c4fcaec1c0e9f4646ac438b7"`);
        await queryRunner.query(`DROP TABLE "apostador"`);
        await queryRunner.query(`DROP TABLE "apostas"`);
        await queryRunner.query(`DROP TABLE "campeonato"`);
        await queryRunner.query(`DROP TABLE "rodadas_detalhes"`);
        await queryRunner.query(`DROP TABLE "rodada"`);
        await queryRunner.query(`DROP TABLE "cavalo"`);
    }

}
