<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200710095131 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE player (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE score ADD player_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE score ADD CONSTRAINT FK_3299375199E6F5DF FOREIGN KEY (player_id) REFERENCES score (id)');
        $this->addSql('CREATE INDEX IDX_3299375199E6F5DF ON score (player_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE player');
        $this->addSql('ALTER TABLE score DROP FOREIGN KEY FK_3299375199E6F5DF');
        $this->addSql('DROP INDEX IDX_3299375199E6F5DF ON score');
        $this->addSql('ALTER TABLE score DROP player_id');
    }
}
