import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCasaToRodadas1761008857255 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "rodadas" 
            ADD COLUMN "casa" numeric(10,2) DEFAULT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "rodadas" 
            DROP COLUMN "casa"
        `);
    }

}
