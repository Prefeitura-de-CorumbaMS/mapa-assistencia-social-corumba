# Atualizações da Área Administrativa

## 📝 Resumo das Alterações

Todos os textos da área administrativa foram adaptados do contexto de **Turismo** para **Assistência Social**.

## 🔄 Alterações Realizadas

### 1. Dashboard (`DashboardPage.jsx`)
- ✅ Título: "Painel de Turismo" → "Painel de Assistência Social"
- ✅ Estatística: "Locais Turísticos" → "Unidades de Assistência Social"

### 2. Layout Administrativo (`AdminLayout.jsx`)
- ✅ Menu lateral (collapsed): "MapaTur" → "SMAS"
- ✅ Menu lateral (expandido): "Painel MapaTur" → "Assistência Social"
- ✅ Item do menu: "Unidades Turísticas" → "Unidades"

### 3. Página de Unidades (`UnidadesPage.jsx`)
- ✅ Título: "Unidades Turísticas" → "Unidades de Assistência Social"
- ✅ Modal: "Nova Unidade Turística" → "Nova Unidade"
- ✅ Modal: "Editar Unidade Turística" → "Editar Unidade"
- ✅ Mensagens de sucesso: "unidade turística" → "unidade"
- ✅ Tooltips e labels atualizados

#### Setores Atualizados
Antiga lista (turismo):
- AGÊNCIA DE VIAGENS
- HOTEL
- POUSADA
- RESTAURANTE
- etc.

Nova lista (assistência social):
- SECRETARIA MUNICIPAL DE ASSISTÊNCIA SOCIAL E CIDADANIA
- CRAS - CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL
- CREAS - CENTRO DE REFERÊNCIA ESPECIALIZADO
- CENTRO POP
- CASA DE PASSAGEM
- CASA DE ACOLHIMENTO
- CENTRO DE CONVIVÊNCIA
- CENTRO DE ATENDIMENTO À MULHER
- CENTRO DE ATENDIMENTO AO IDOSO
- CONSELHO TUTELAR
- CASA DOS CONSELHOS
- ALMOXARIFADO
- OUTRO

### 4. Página de Categorias (`CategoriasPage.jsx`)
- ✅ Título: "Categorias Turísticas" → "Categorias de Assistência Social"

### 5. Mapa Público (`MapPage.jsx`)
- ✅ Comentário: "Buscar por Ponto Turístico" → "Buscar por Unidade"
- ✅ Zoom inicial: 11 → 13 (mais próximo)

## 🎨 Contexto Visual

### Antes:
- Painel MapaTur
- Unidades Turísticas
- Locais Turísticos
- Categorias Turísticas

### Depois:
- Assistência Social (ou SMAS quando colapsado)
- Unidades de Assistência Social / Unidades
- Categorias de Assistência Social

## 📋 Notas Importantes

1. **SMAS** = Secretaria Municipal de Assistência Social (sigla usada quando o menu está colapsado)
2. Todos os formulários e modais foram adaptados
3. Mensagens de feedback (sucesso/erro) atualizadas
4. Lista de setores completamente renovada para o contexto de assistência social
5. Mantida a funcionalidade de categorias para permitir organização das unidades

## ✅ Status

- [x] Dashboard adaptado
- [x] Layout administrativo adaptado
- [x] Página de Unidades adaptada
- [x] Setores de assistência social definidos
- [x] Página de Categorias adaptada
- [x] Mapa público atualizado
- [x] Zoom inicial ajustado

Todas as alterações mantêm a funcionalidade original, apenas adaptando os textos e contexto para Assistência Social.
