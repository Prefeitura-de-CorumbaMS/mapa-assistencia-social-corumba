-- =====================================================
-- MIGRAÇÃO: Sistema de Analytics Completo
-- =====================================================
-- Este script cria todas as tabelas necessárias para o sistema de analytics

-- Tabela: analytics_event
-- Armazena todos os eventos de interação dos usuários
CREATE TABLE IF NOT EXISTS `analytics_event` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `session_id` VARCHAR(255) NOT NULL,
  `event_type` VARCHAR(50) NOT NULL COMMENT 'PAGE_VIEW, SEARCH, UNIT_VIEW, MAP_CLICK, CONTACT_CLICK, SOCIAL_CLICK, FILTER_APPLIED, ERROR',
  `event_data` TEXT NULL COMMENT 'JSON com dados específicos do evento',
  `user_agent` VARCHAR(500) NULL,
  `ip_hash` VARCHAR(64) NULL COMMENT 'Hash SHA256 do IP (anonimizado)',
  `referrer` VARCHAR(500) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_session_id` (`session_id`),
  INDEX `idx_event_type` (`event_type`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: analytics_session
-- Armazena informações agregadas por sessão de usuário
CREATE TABLE IF NOT EXISTS `analytics_session` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `session_id` VARCHAR(255) NOT NULL,
  `first_seen` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `last_seen` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `user_agent` VARCHAR(500) NULL,
  `ip_hash` VARCHAR(64) NULL,
  `page_views` INT NOT NULL DEFAULT 0,
  `searches` INT NOT NULL DEFAULT 0,
  `unit_views` INT NOT NULL DEFAULT 0,
  `contacts` INT NOT NULL DEFAULT 0,
  `duration_seconds` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `session_id` (`session_id`),
  INDEX `idx_first_seen` (`first_seen`),
  INDEX `idx_last_seen` (`last_seen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: analytics_unit_stats
-- Armazena estatísticas diárias por unidade
CREATE TABLE IF NOT EXISTS `analytics_unit_stats` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `unit_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `views` INT NOT NULL DEFAULT 0,
  `map_clicks` INT NOT NULL DEFAULT 0,
  `contacts_whatsapp` INT NOT NULL DEFAULT 0,
  `contacts_phone` INT NOT NULL DEFAULT 0,
  `contacts_email` INT NOT NULL DEFAULT 0,
  `contacts_directions` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unit_id_date` (`unit_id`, `date`),
  INDEX `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: analytics_search_stats
-- Armazena estatísticas de termos de busca
CREATE TABLE IF NOT EXISTS `analytics_search_stats` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `search_term` VARCHAR(255) NOT NULL,
  `search_type` VARCHAR(50) NOT NULL COMMENT 'texto_livre, bairro, unidade, categoria, etc.',
  `count` INT NOT NULL DEFAULT 0,
  `last_searched` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `search_term_type` (`search_term`, `search_type`),
  INDEX `idx_last_searched` (`last_searched`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- FIM: Sistema de Analytics
-- =====================================================
