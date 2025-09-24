import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRodadasIdToApostas1758590000000 implements MigrationInterface {
    name = 'AddRodadasIdToApostas1758590000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionar a coluna rodadasId na tabela apostas
        await queryRunner.query(`ALTER TABLE "apostas" ADD "rodadasId" integer`);
        
        // Adicionar a foreign key constraint
        await queryRunner.query(`ALTER TABLE "apostas" ADD CONSTRAINT "FK_apostas_rodadas" FOREIGN KEY ("rodadasId") REFERENCES "rodadas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover a foreign key constraint
        await queryRunner.query(`ALTER TABLE "apostas" DROP CONSTRAINT "FK_apostas_rodadas"`);
        
        // Remover a coluna rodadasId
        await queryRunner.query(`ALTER TABLE "apostas" DROP COLUMN "rodadasId"`);
    }
}
