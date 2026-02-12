-- =====================================================
-- MIGRAÇÃO: Sistema de Ícones (URL → ID)
-- =====================================================
-- Este script adiciona suporte a ícones por ID e cria a tabela de ícones

-- PASSO 1: Criar tabela prod_icone
CREATE TABLE IF NOT EXISTS `prod_icone` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `ativo` BOOLEAN NOT NULL DEFAULT true,
  `ordem` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nome` (`nome`),
  INDEX `idx_ativo` (`ativo`),
  INDEX `idx_ordem` (`ordem`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PASSO 2: Adicionar coluna id_icone na tabela de unidades
-- IMPORTANTE: Ajuste o nome da tabela conforme sua aplicação
-- Exemplos: prod_unidade, prod_unidade_saude, staging_info_origem, etc.

-- Para tabela prod_unidade (ajuste conforme necessário):
ALTER TABLE `prod_unidade`
ADD COLUMN `id_icone` INT NULL AFTER `icone_url`,
ADD INDEX `idx_id_icone` (`id_icone`);

-- PASSO 3: Adicionar Foreign Key
-- IMPORTANTE: Ajuste o nome da tabela conforme sua aplicação
ALTER TABLE `prod_unidade`
ADD CONSTRAINT `fk_unidade_icone`
FOREIGN KEY (`id_icone`) REFERENCES `prod_icone`(`id`)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- =====================================================
-- INSERÇÃO DE ÍCONES: Assistência Social
-- =====================================================
-- Você pode personalizar esses ícones conforme sua aplicação

INSERT INTO `prod_icone` (`id`, `nome`, `url`, `ativo`, `ordem`) VALUES
(1, 'CRAS', '/uploads/icones/icone_ass_social_01.png', 1, 1),
(2, 'CREAS', '/uploads/icones/icone_ass_social_02.png', 1, 2),
(3, 'Abrigo Institucional', '/uploads/icones/icone_ass_social_03.png', 1, 3),
(4, 'Casa de Passagem', '/uploads/icones/icone_ass_social_04.png', 1, 4),
(5, 'Centro de Convivência', '/uploads/icones/icone_ass_social_05.png', 1, 5),
(6, 'Centro Pop', '/uploads/icones/icone_ass_social_06.png', 1, 6),
(7, 'Unidade de Acolhimento', '/uploads/icones/icone_ass_social_07.png', 1, 7),
(8, 'Centro Dia', '/uploads/icones/icone_ass_social_08.png', 1, 8),
(9, 'Casa Lar', '/uploads/icones/icone_ass_social_09.png', 1, 9),
(10, 'SCFV - Serviço de Convivência', '/uploads/icones/icone_ass_social_10.png', 1, 10),
(11, 'Programa Criança Feliz', '/uploads/icones/icone_ass_social_11.png', 1, 11),
(12, 'PAIF - Serviço de Proteção', '/uploads/icones/icone_ass_social_12.png', 1, 12),
(13, 'PAEFI - Serviço de Proteção Especial', '/uploads/icones/icone_ass_social_13.png', 1, 13),
(14, 'Conselho Tutelar', '/uploads/icones/icone_ass_social_14.png', 1, 14),
(15, 'MSE - Medida Socioeducativa', '/uploads/icones/icone_ass_social_15.png', 1, 15),
(16, 'Casa de Acolhimento', '/uploads/icones/icone_ass_social_16.png', 1, 16),
(17, 'Residência Inclusiva', '/uploads/icones/icone_ass_social_17.png', 1, 17),
(18, 'Centro de Referência', '/uploads/icones/icone_ass_social_18.png', 1, 18),
(19, 'Serviço de Acolhimento', '/uploads/icones/icone_ass_social_19.png', 1, 19),
(20, 'Unidade de Atendimento', '/uploads/icones/icone_ass_social_20.png', 1, 20),
(21, 'Centro de Apoio', '/uploads/icones/icone_ass_social_21.png', 1, 21),
(22, 'Espaço de Convivência', '/uploads/icones/icone_ass_social_22.png', 1, 22)
ON DUPLICATE KEY UPDATE
  `nome` = VALUES(`nome`),
  `url` = VALUES(`url`),
  `ativo` = VALUES(`ativo`),
  `ordem` = VALUES(`ordem`);

-- =====================================================
-- MIGRAÇÃO DE DADOS: icone_url → id_icone (OPCIONAL)
-- =====================================================
-- Se você já possui unidades com icone_url, pode migrar para id_icone
-- Este é um exemplo - ajuste conforme sua necessidade

-- Exemplo: Migrar unidades que usam URL específica para ID correspondente
-- UPDATE prod_unidade
-- SET id_icone = 1
-- WHERE icone_url LIKE '%icone_ass_social_01.png%';

-- =====================================================
-- FIM: Sistema de Ícones
-- =====================================================
