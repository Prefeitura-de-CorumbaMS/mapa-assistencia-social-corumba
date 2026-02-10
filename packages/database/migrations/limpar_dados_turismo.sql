-- ============================================================================
-- LIMPEZA: Dados de Turismo
-- Data: 2026-02-09
-- Descrição: Remove todos os dados de turismo para preparar migração para
--            assistência social
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Limpar tabelas relacionadas (junction tables)
TRUNCATE TABLE junction_unidade_categoria;

-- 2. Limpar redes sociais
TRUNCATE TABLE prod_unidade_turistica_redesocial;

-- 3. Limpar categorias
TRUNCATE TABLE prod_categoria;

-- 4. Limpar unidades turísticas
TRUNCATE TABLE prod_unidade_turistica;

SET FOREIGN_KEY_CHECKS = 1;

-- Verificar limpeza
SELECT
  'prod_unidade_turistica' as tabela,
  COUNT(*) as total
FROM prod_unidade_turistica
UNION ALL
SELECT
  'prod_categoria' as tabela,
  COUNT(*) as total
FROM prod_categoria
UNION ALL
SELECT
  'junction_unidade_categoria' as tabela,
  COUNT(*) as total
FROM junction_unidade_categoria
UNION ALL
SELECT
  'prod_unidade_turistica_redesocial' as tabela,
  COUNT(*) as total
FROM prod_unidade_turistica_redesocial;

-- ============================================================================
-- RESULTADO ESPERADO: Todas as tabelas devem ter 0 registros
-- ============================================================================
