-- ============================================================================
-- ATUALIZAÇÃO: Ícones de Assistência Social
-- Data: 2026-02-09
-- Descrição: Substitui ícones antigos de turismo por ícones de assistência social
-- ============================================================================

-- Limpar ícones antigos (de turismo)
TRUNCATE TABLE prod_icone;

-- Inserir novos ícones de Assistência Social
INSERT INTO prod_icone (nome, url, ativo, ordem) VALUES
('CRAS', '/uploads/icones/icone_ass_social_01.png', TRUE, 1),
('CREAS', '/uploads/icones/icone_ass_social_02.png', TRUE, 2),
('Abrigo Institucional', '/uploads/icones/icone_ass_social_03.png', TRUE, 3),
('Casa de Passagem', '/uploads/icones/icone_ass_social_04.png', TRUE, 4),
('Centro de Convivência', '/uploads/icones/icone_ass_social_05.png', TRUE, 5),
('Centro Pop', '/uploads/icones/icone_ass_social_06.png', TRUE, 6),
('Unidade de Acolhimento', '/uploads/icones/icone_ass_social_07.png', TRUE, 7),
('Centro Dia', '/uploads/icones/icone_ass_social_08.png', TRUE, 8),
('Casa Lar', '/uploads/icones/icone_ass_social_09.png', TRUE, 9),
('SCFV - Serviço de Convivência', '/uploads/icones/icone_ass_social_10.png', TRUE, 10),
('Centro de Referência', '/uploads/icones/icone_ass_social_11.png', TRUE, 11),
('Assistência Social Geral', '/uploads/icones/icone_ass_social_12.png', TRUE, 12),
('Proteção Social Básica', '/uploads/icones/icone_ass_social_13.png', TRUE, 13),
('Proteção Social Especial', '/uploads/icones/icone_ass_social_14.png', TRUE, 14),
('Benefícios Eventuais', '/uploads/icones/icone_ass_social_15.png', TRUE, 15),
('Cadastro Único', '/uploads/icones/icone_ass_social_16.png', TRUE, 16),
('Bolsa Família', '/uploads/icones/icone_ass_social_17.png', TRUE, 17),
('Conselho Tutelar', '/uploads/icones/icone_ass_social_18.png', TRUE, 18),
('Centro de Atendimento à Mulher', '/uploads/icones/icone_ass_social_19.png', TRUE, 19),
('Centro de Atendimento ao Idoso', '/uploads/icones/icone_ass_social_20.png', TRUE, 20),
('Serviço de Acolhimento Familiar', '/uploads/icones/icone_ass_social_21.png', TRUE, 21),
('Outros Serviços', '/uploads/icones/icone_ass_social_22.png', TRUE, 22);

-- ============================================================================
-- Verificar inserção
-- ============================================================================
SELECT
  id,
  nome,
  url,
  ativo,
  ordem
FROM prod_icone
ORDER BY ordem;
