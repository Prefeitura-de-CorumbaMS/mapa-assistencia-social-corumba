-- ============================================================================
-- MIGRAÇÃO: Adicionar relacionamento id_icone em prod_unidade
-- Data: 2026-02-10
-- Descrição: Adiciona coluna id_icone para relacionamento com prod_icone
--            Mantém icone_url temporariamente para compatibilidade
-- ============================================================================

-- 1. Adicionar coluna id_icone (nullable)
ALTER TABLE prod_unidade
ADD COLUMN id_icone INT NULL AFTER icone_url;

-- 2. Adicionar índice para melhor performance
ALTER TABLE prod_unidade
ADD INDEX idx_id_icone (id_icone);

-- 3. Adicionar foreign key para prod_icone
ALTER TABLE prod_unidade
ADD CONSTRAINT fk_unidade_icone
FOREIGN KEY (id_icone) REFERENCES prod_icone(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- ============================================================================
-- Verificar alterações
-- ============================================================================

DESCRIBE prod_unidade;

-- Verificar a estrutura da coluna id_icone
SELECT
  COLUMN_NAME,
  DATA_TYPE,
  IS_NULLABLE,
  COLUMN_KEY
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'prod_unidade'
  AND COLUMN_NAME = 'id_icone';

-- ============================================================================
-- PRÓXIMOS PASSOS (Manual):
-- 1. Atualizar schema.prisma para incluir o campo id_icone
-- 2. Regenerar Prisma Client
-- 3. Atualizar rotas da API para trabalhar com id_icone
-- 4. Após testes, remover coluna icone_url (futura migration)
-- ============================================================================
