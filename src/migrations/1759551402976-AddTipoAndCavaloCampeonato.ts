import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTipoAndCavaloCampeonato1759551402976 implements MigrationInterface {
    name = 'AddTipoAndCavaloCampeonato1759551402976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rodadas" DROP CONSTRAINT "FK_ab2c4fcaec1c0e9f4646ac438b7"`);
        await queryRunner.query(`ALTER TABLE "rodadas" DROP CONSTRAINT "FK_d2f024369cc7bdf6a3caf04893c"`);
        await queryRunner.query(`ALTER TABLE "apostas" DROP CONSTRAINT "fk_apostas_rodadas"`);
        await queryRunner.query(`CREATE TABLE "tipo" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, CONSTRAINT "PK_a67247249373b958a16801211c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cavalo_campeonato" ("id" SERIAL NOT NULL, "cavaloId" integer NOT NULL, "campeonatoId" integer NOT NULL, "numeroPareo" character varying(2) NOT NULL, CONSTRAINT "PK_b6c4d67a83b1624d265bae45857" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rodadas" ADD "tipoId" integer NOT NULL`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "rodadas_id_seq" OWNED BY "rodadas"."id"`);
        await queryRunner.query(`ALTER TABLE "rodadas" ALTER COLUMN "id" SET DEFAULT nextval('"rodadas_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "rodadas" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "apostas" ALTER COLUMN "rodadasid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rodadas" ADD CONSTRAINT "FK_41e8aa340df09370e317a4b3cca" FOREIGN KEY ("campeonatoId") REFERENCES "campeonato"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rodadas" ADD CONSTRAINT "FK_f01e204bc6fab5615cdca16da3e" FOREIGN KEY ("rodadaId") REFERENCES "rodada"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rodadas" ADD CONSTRAINT "FK_8fff9a42142bb2ef7c39342e884" FOREIGN KEY ("tipoId") REFERENCES "tipo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cavalo_campeonato" ADD CONSTRAINT "FK_8026ef6c2b30501f36921a82b85" FOREIGN KEY ("cavaloId") REFERENCES "cavalo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cavalo_campeonato" ADD CONSTRAINT "FK_7705f90a1ac0432fd9a211848e5" FOREIGN KEY ("campeonatoId") REFERENCES "campeonato"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apostas" ADD CONSTRAINT "FK_caa902079b22497fdb4b1e4bcd5" FOREIGN KEY ("rodadasid") REFERENCES "rodadas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apostas" DROP CONSTRAINT "FK_caa902079b22497fdb4b1e4bcd5"`);
        await queryRunner.query(`ALTER TABLE "cavalo_campeonato" DROP CONSTRAINT "FK_7705f90a1ac0432fd9a211848e5"`);
        await queryRunner.query(`ALTER TABLE "cavalo_campeonato" DROP CONSTRAINT "FK_8026ef6c2b30501f36921a82b85"`);
        await queryRunner.query(`ALTER TABLE "rodadas" DROP CONSTRAINT "FK_8fff9a42142bb2ef7c39342e884"`);
        await queryRunner.query(`ALTER TABLE "rodadas" DROP CONSTRAINT "FK_f01e204bc6fab5615cdca16da3e"`);
        await queryRunner.query(`ALTER TABLE "rodadas" DROP CONSTRAINT "FK_41e8aa340df09370e317a4b3cca"`);
        await queryRunner.query(`ALTER TABLE "apostas" ALTER COLUMN "rodadasid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rodadas" ALTER COLUMN "id" SET DEFAULT nextval('rodadas_detalhes_id_seq')`);
        await queryRunner.query(`ALTER TABLE "rodadas" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "rodadas_id_seq"`);
        await queryRunner.query(`ALTER TABLE "rodadas" DROP COLUMN "tipoId"`);
        await queryRunner.query(`DROP TABLE "cavalo_campeonato"`);
        await queryRunner.query(`DROP TABLE "tipo"`);
        await queryRunner.query(`ALTER TABLE "apostas" ADD CONSTRAINT "fk_apostas_rodadas" FOREIGN KEY ("rodadasid") REFERENCES "rodadas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rodadas" ADD CONSTRAINT "FK_d2f024369cc7bdf6a3caf04893c" FOREIGN KEY ("rodadaId") REFERENCES "rodada"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rodadas" ADD CONSTRAINT "FK_ab2c4fcaec1c0e9f4646ac438b7" FOREIGN KEY ("campeonatoId") REFERENCES "campeonato"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
