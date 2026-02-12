# 📦 Migration Kit - Analytics, Ícones e Admin

> Kit completo para implementar sistema de analytics, gerenciamento de ícones e interface admin com abas em aplicações de mapa similares.

## 🎯 O que este kit faz?

Este Migration Kit permite replicar três funcionalidades desenvolvidas no Mapa da Assistência Social de Corumbá para outras aplicações similares:

### 1. 📊 Sistema de Analytics Completo

- **Tracking de eventos**: PAGE_VIEW, SEARCH, UNIT_VIEW, MAP_CLICK, CONTACT_CLICK, etc.
- **Dashboard administrativo** com cards de estatísticas (acessos hoje/semana/mês/ano)
- **Página de analytics** com gráficos interativos (Recharts)
- **Análise de conversão** e funil de vendas
- **Termos de busca** mais populares
- **Unidades mais visualizadas** com taxa de conversão
- **Jobs automáticos** de agregação e limpeza de dados

### 2. 🎨 Sistema de Ícones (URL → ID)

- **Migração de ícones**: de URLs para IDs referenciados
- **Tabela prod_icone** com 22 ícones de Assistência Social
- **API completa** para gerenciamento (CRUD, upload, reordenação)
- **Seleção visual** de ícones no admin
- **Melhor performance** com foreign keys

### 3. 🗂️ Admin com Abas

- **Layout otimizado** do admin com menu lateral
- **Modal de unidades** dividido em 6+ abas:
  - Informações Básicas
  - Categorização
  - Localização (com mapa interativo)
  - Contato
  - Mídia (upload + ícones)
  - Serviços
- **Nome da unidade** exibido acima das abas
- **UX melhorada** para cadastro/edição

---

## 📂 Estrutura do Kit

```
migration-kit/
├── install.sh                    # Script de instalação automatizado ⭐
├── README.md                     # Este arquivo
├── database/
│   ├── 01_analytics_tables.sql   # Criação das 4 tabelas de analytics
│   ├── 02_icones_system.sql      # Sistema de ícones + 22 inserts
│   └── 03_prisma_schema_reference.prisma  # Modelos Prisma
├── backend/
│   ├── analytics.routes.js       # 7 endpoints de analytics
│   ├── icone.routes.js           # 7 endpoints de ícones
│   └── analytics-aggregation.job.js  # Jobs de background
├── frontend/
│   ├── pages/
│   │   ├── AnalyticsPage.jsx     # Página de analytics com gráficos
│   │   ├── DashboardPage.jsx     # Dashboard com cards de acesso
│   │   └── UnidadesPage.jsx      # CRUD de unidades com abas
│   ├── utils/
│   │   └── analytics.js          # Funções de tracking
│   └── layouts/
│       └── AdminLayout.jsx       # Layout admin com menu
├── icones/
│   └── *.png                     # 22 ícones de Assistência Social
└── docs/
    └── INSTALLATION_GUIDE.md     # Documentação completa 📖
```

---

## 🚀 Instalação Rápida

### Pré-requisitos

- Node.js 16+ e npm
- MySQL 5.7+ ou MariaDB 10+
- Prisma ORM (ou Sequelize)
- React 17+ com Redux/React Query
- Ant Design 5+

### Opção 1: Instalação Automatizada (Recomendado)

```bash
# 1. Copie o migration-kit
cp -r migration-kit /caminho/do/seu/projeto/

# 2. Execute o instalador
cd /caminho/do/seu/projeto/migration-kit
./install.sh
```

O script irá:
- ✅ Verificar dependências
- ✅ Coletar informações do projeto
- ✅ Fazer backup do banco
- ✅ Executar migrações SQL
- ✅ Copiar arquivos backend/frontend
- ✅ Instalar dependências npm
- ✅ Fornecer próximos passos

### Opção 2: Instalação Manual

Consulte a [Documentação Completa](docs/INSTALLATION_GUIDE.md) para instruções detalhadas.

---

## 📊 Funcionalidades do Analytics

### Eventos Rastreados

| Evento | Descrição | Onde é usado |
|--------|-----------|--------------|
| `PAGE_VIEW` | Visualização de página | Todas as páginas |
| `SEARCH` | Busca realizada | Barra de busca |
| `UNIT_VIEW` | Unidade visualizada | Clique na unidade |
| `MAP_CLICK` | Clique no marcador | Mapa interativo |
| `CONTACT_CLICK` | Clique em contato | Botões de WhatsApp, telefone, etc. |
| `SOCIAL_CLICK` | Clique em rede social | Links de redes sociais |
| `FILTER_APPLIED` | Filtro aplicado | Filtros do mapa |
| `ERROR` | Erro capturado | Error boundaries |

### APIs Disponíveis

**Públicas:**
- `POST /api/analytics/event` - Registrar evento

**Admin (autenticadas):**
- `GET /api/analytics/access-stats` - Estatísticas de acesso
- `GET /api/analytics/overview` - Visão geral
- `GET /api/analytics/popular-units` - Unidades populares
- `GET /api/analytics/search-terms` - Termos de busca
- `GET /api/analytics/conversion-funnel` - Funil de conversão
- `GET /api/analytics/timeline` - Série temporal

### Dashboards Inclusos

1. **DashboardPage**: 4 cards com estatísticas de acesso (hoje/semana/mês/ano)
2. **AnalyticsPage**: Gráficos e tabelas detalhadas
   - Gráfico de linha com eventos ao longo do tempo
   - Tabela de unidades mais populares
   - Tabela de termos de busca
   - Funil de conversão

---

## 🎨 Sistema de Ícones

### 22 Ícones Inclusos

1. CRAS
2. CREAS
3. Abrigo Institucional
4. Casa de Passagem
5. Centro de Convivência
6. Centro Pop
7. Unidade de Acolhimento
8. Centro Dia
9. Casa Lar
10. SCFV - Serviço de Convivência
11. Programa Criança Feliz
12. PAIF - Serviço de Proteção
13. PAEFI - Serviço de Proteção Especial
14. Conselho Tutelar
15. MSE - Medida Socioeducativa
16. Casa de Acolhimento
17. Residência Inclusiva
18. Centro de Referência
19. Serviço de Acolhimento
20. Unidade de Atendimento
21. Centro de Apoio
22. Espaço de Convivência

### APIs de Ícones

- `GET /api/icones` - Listar ícones
- `GET /api/icones/:id` - Obter ícone
- `POST /api/icones` - Criar ícone
- `POST /api/icones/upload` - Upload de arquivo
- `PUT /api/icones/:id` - Atualizar ícone
- `DELETE /api/icones/:id` - Deletar ícone
- `PUT /api/icones/reordenar/batch` - Reordenar múltiplos

---

## 🗂️ Modal com Abas

### Estrutura do Modal de Unidades

```
┌─────────────────────────────────────────────┐
│  📍 Editando: Nome da Unidade               │  ← Alert com nome
├─────────────────────────────────────────────┤
│  [Básicas] [Categorias] [Local] [Contato]  │  ← Abas
│  [Mídia] [Serviços]                         │
├─────────────────────────────────────────────┤
│                                             │
│  [Conteúdo da aba ativa]                   │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

### Abas Implementadas

1. **Informações Básicas**: Nome, CNPJ, setor, endereço, status
2. **Categorização**: Categorias multi-select, serviços oferecidos
3. **Localização**: Mapa interativo (Leaflet) com seletor de coordenadas
4. **Contato**: Telefone, WhatsApp, email, horário
5. **Mídia**: Upload de imagem, seleção visual de ícone, redes sociais
6. **Serviços**: Lista de serviços com gestor e contatos

---

## 🔧 Configuração Pós-Instalação

### Backend

1. **Registrar rotas** no arquivo principal
2. **Configurar jobs** com node-cron
3. **Adicionar middleware** de autenticação
4. **Configurar upload** de arquivos estáticos

### Frontend

1. **Adicionar rotas** no router
2. **Configurar Redux/React Query** para APIs de analytics
3. **Integrar tracking** nos componentes relevantes
4. **Importar estilos** do Ant Design

### Banco de Dados

1. **Executar migrações** SQL
2. **Atualizar schema.prisma** com novos modelos
3. **Executar** `npx prisma generate`
4. **(Opcional)** Migrar dados existentes de icone_url → id_icone

Consulte a [Documentação Completa](docs/INSTALLATION_GUIDE.md) para detalhes.

---

## 📦 Dependências NPM

### Frontend
```bash
npm install recharts @ant-design/icons antd dayjs react-leaflet leaflet
```

### Backend
```bash
npm install multer node-cron
```

---

## 🧪 Testando

### Backend
```bash
# Testar endpoint público
curl -X POST http://localhost:3000/api/analytics/event \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","event_type":"PAGE_VIEW"}'

# Testar ícones
curl http://localhost:3000/api/icones
```

### Frontend
1. Acesse `/admin/dashboard`
2. Acesse `/admin/analytics`
3. Teste cadastro de unidades com ícones
4. Verifique tracking no Network do DevTools

### Banco de Dados
```sql
SELECT * FROM analytics_event ORDER BY created_at DESC LIMIT 10;
SELECT * FROM prod_icone;
```

---

## 📈 Estatísticas do Kit

- **4 tabelas** de banco de dados (analytics)
- **1 tabela** de ícones
- **14 endpoints** de API (7 analytics + 7 ícones)
- **3 páginas** React (Dashboard, Analytics, Unidades)
- **10 funções** de tracking
- **22 ícones** inclusos
- **6 abas** no modal de unidades
- **3 jobs** de background

---

## 🐛 Troubleshooting

Problemas comuns e soluções na [Documentação Completa](docs/INSTALLATION_GUIDE.md#-troubleshooting).

---

## 📚 Documentação

- **[INSTALLATION_GUIDE.md](docs/INSTALLATION_GUIDE.md)** - Guia completo de instalação (30+ páginas)
- **[README.md](README.md)** - Este arquivo (visão geral)

---

## 🤝 Contribuindo

Este kit foi desenvolvido para facilitar a implementação de funcionalidades entre projetos similares. Se você melhorar ou adicionar funcionalidades:

1. Documente as mudanças
2. Atualize a versão
3. Compartilhe com a equipe

---

## 📄 Licença

Este Migration Kit é parte do projeto Mapa da Assistência Social de Corumbá.

---

## ✨ Créditos

**Desenvolvido com base em:**
- Mapa da Assistência Social de Corumbá
- Commit: 771e9c5 (Analytics)
- Commit: 3e3727e (Base inicial)

---

## 📞 Suporte

Se precisar de ajuda:
1. Consulte a [Documentação Completa](docs/INSTALLATION_GUIDE.md)
2. Revise a seção [Troubleshooting](docs/INSTALLATION_GUIDE.md#-troubleshooting)
3. Verifique os logs de erro

---

**Pronto para começar? Execute `./install.sh` e siga as instruções! 🚀**
