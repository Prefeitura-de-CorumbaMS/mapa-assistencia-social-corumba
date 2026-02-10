-- ============================================================================
-- MIGRAÇÃO: Renomear Tabelas - Turismo → Assistência Social
-- Data: 2026-02-10
-- Descrição: Renomeia as tabelas para refletir o domínio de Assistência Social
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Renomear tabela principal: Unidade Turística → Unidade de Assistência Social
RENAME TABLE prod_unidade_turistica TO prod_unidade_assistencia_social;

-- 2. Renomear tabela de redes sociais
RENAME TABLE prod_unidade_turistica_redesocial TO prod_unidade_assistencia_social_redesocial;

-- 3. Renomear tabela junction para maior clareza
RENAME TABLE junction_unidade_categoria TO junction_unidade_assistencia_social_categoria;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- Verificar renomeação
-- ============================================================================

SELECT
  TABLE_NAME,
  TABLE_ROWS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN (
    'prod_unidade_assistencia_social',
    'prod_unidade_assistencia_social_redesocial',
    'junction_unidade_assistencia_social_categoria'
  )
ORDER BY TABLE_NAME;

-- ============================================================================
-- RESULTADO ESPERADO:
-- - prod_unidade_assistencia_social
-- - prod_unidade_assistencia_social_redesocial
-- - junction_unidade_assistencia_social_categoria
-- ============================================================================
