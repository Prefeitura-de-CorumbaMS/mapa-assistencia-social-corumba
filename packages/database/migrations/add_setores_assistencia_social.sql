-- ============================================================================
-- MIGRAÇÃO: Adicionar tabela de Setores para Assistência Social
-- Data: 2026-02-09
-- Descrição: Cria tabela para armazenar setores das unidades de assistência
--            social (similar aos guias/professores do sistema de turismo)
-- ============================================================================

-- 1. CRIAR TABELA DE SETORES
CREATE TABLE IF NOT EXISTS prod_setor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  gestor VARCHAR(255),
  numero VARCHAR(100),
  whatsapp VARCHAR(100),
  email VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_ativo (ativo),
  INDEX idx_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CRIAR TABELA JUNCTION (Unidade ↔ Setor)
CREATE TABLE IF NOT EXISTS junction_unidade_setor (
  id_unidade INT NOT NULL,
  id_setor INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id_unidade, id_setor),
  INDEX idx_unidade (id_unidade),
  INDEX idx_setor (id_setor),
  FOREIGN KEY (id_unidade) REFERENCES prod_unidade_turistica(id) ON DELETE CASCADE,
  FOREIGN KEY (id_setor) REFERENCES prod_setor(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verificar criação
SELECT
  'prod_setor' as tabela,
  COUNT(*) as total
FROM prod_setor
UNION ALL
SELECT
  'junction_unidade_setor' as tabela,
  COUNT(*) as total
FROM junction_unidade_setor;

-- ============================================================================
-- RESULTADO ESPERADO: Tabelas criadas com 0 registros
-- ============================================================================
