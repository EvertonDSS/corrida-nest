import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGrupoIdToApostas1758600000000 implements MigrationInterface {
    name = 'AddGrupoIdToApostas1758600000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apostas" ADD "grupoid" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apostas" DROP COLUMN "grupoid"`);
    }
}
