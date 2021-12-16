import { MigrationInterface, QueryRunner } from 'typeorm';

export default class Setup1622031960671 implements MigrationInterface {
  name = 'Setup1622031960671';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE roles (
        id varchar(36) NOT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        name varchar(40) NOT NULL,
        INDEX IDX_4d018866397b1e7e78d03b4566 (createdAt),
        UNIQUE INDEX IDX_648e3f5447f725579d7d4ffdfb (name),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE users (
        id varchar(36) NOT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        name varchar(255) NULL,
        image varchar(255) NULL,
        email varchar(255) NULL,
        password varchar(100) NULL,
        temporaryPassword varchar(100) NULL,
        facebookId varchar(255) NULL,
        facebookImage text NULL,
        googleId varchar(255) NULL,
        googleImage text NULL,
        appleId varchar(255) NULL,
        roleId varchar(36) NOT NULL,
        INDEX IDX_204e9b624861ff4a5b26819210 (createdAt),
        INDEX IDX_51b8b26ac168fbe7d6f5653e6c (name),
        INDEX IDX_2a32f641edba1d0f973c19cc94 (email),
        INDEX IDX_df199bc6e53abe32d64bbcf211 (facebookId),
        INDEX IDX_7044ce3fd64239a415b643096d (googleId),
        INDEX IDX_6c19d05a6bbce0d3a0c298c4f7 (appleId),
        UNIQUE INDEX IDX_97672ac88f789774dd47f7c8be (email),
        UNIQUE INDEX IDX_f9740e1e654a5daddb82c60bd7 (facebookId),
        UNIQUE INDEX IDX_f382af58ab36057334fb262efd (googleId),
        UNIQUE INDEX IDX_60cea0d80c39eedaaaf5e21f17 (appleId),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE users
        ADD CONSTRAINT FK_368e146b785b574f42ae9e53d5e FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users
        DROP FOREIGN KEY FK_368e146b785b574f42ae9e53d5e`
    );
    await queryRunner.query(
      'DROP INDEX IDX_4d018866397b1e7e78d03b4566 ON roles'
    );
    await queryRunner.query(
      'DROP INDEX IDX_648e3f5447f725579d7d4ffdfb ON roles'
    );
    await queryRunner.query('DROP TABLE roles');
    await queryRunner.query(
      'DROP INDEX IDX_204e9b624861ff4a5b26819210 ON users'
    );
    await queryRunner.query(
      'DROP INDEX IDX_6c19d05a6bbce0d3a0c298c4f7 ON users'
    );
    await queryRunner.query(
      'DROP INDEX IDX_7044ce3fd64239a415b643096d ON users'
    );
    await queryRunner.query(
      'DROP INDEX IDX_2a32f641edba1d0f973c19cc94 ON users'
    );
    await queryRunner.query(
      'DROP INDEX IDX_f9740e1e654a5daddb82c60bd7 ON users'
    );
    await queryRunner.query(
      'DROP INDEX IDX_df199bc6e53abe32d64bbcf211 ON users'
    );
    await queryRunner.query(
      'DROP INDEX IDX_f382af58ab36057334fb262efd ON users'
    );
    await queryRunner.query(
      'DROP INDEX IDX_60cea0d80c39eedaaaf5e21f17 ON users'
    );
    await queryRunner.query(
      'DROP INDEX IDX_97672ac88f789774dd47f7c8be ON users'
    );
    await queryRunner.query(
      'DROP INDEX IDX_51b8b26ac168fbe7d6f5653e6c ON users'
    );
    await queryRunner.query('DROP TABLE users');
  }
}
