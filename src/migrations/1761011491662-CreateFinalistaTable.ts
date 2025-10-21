import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFinalistaTable1761011491662 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "finalista" (
                "id" SERIAL NOT NULL,
                "campeonatoid" integer NOT NULL,
                "tipoid" integer NOT NULL,
                "cavaloid" integer NOT NULL,
                "grupoid" integer NOT NULL,
                CONSTRAINT "PK_finalista" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "finalista" ADD CONSTRAINT "FK_finalista_campeonato"
            FOREIGN KEY ("campeonatoid") REFERENCES "campeonato"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "finalista" ADD CONSTRAINT "FK_finalista_tipo"
            FOREIGN KEY ("tipoid") REFERENCES "tipo"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "finalista" ADD CONSTRAINT "FK_finalista_cavalo"
            FOREIGN KEY ("cavaloid") REFERENCES "cavalo"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finalista" DROP CONSTRAINT "FK_finalista_cavalo"`);
        await queryRunner.query(`ALTER TABLE "finalista" DROP CONSTRAINT "FK_finalista_tipo"`);
        await queryRunner.query(`ALTER TABLE "finalista" DROP CONSTRAINT "FK_finalista_campeonato"`);
        await queryRunner.query(`DROP TABLE "finalista"`);
    }

}
