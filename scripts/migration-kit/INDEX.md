# 📑 Migration Kit - Índice de Arquivos

## 🗂️ Navegação Rápida

### 📖 Documentação
- **[README.md](README.md)** - Visão geral completa do kit
- **[QUICKSTART.md](QUICKSTART.md)** - Guia rápido de 5 minutos
- **[docs/INSTALLATION_GUIDE.md](docs/INSTALLATION_GUIDE.md)** - Guia completo de instalação (~600 linhas)
- **[MANIFEST.txt](MANIFEST.txt)** - Manifesto do pacote com detalhamento completo
- **[INDEX.md](INDEX.md)** - Este arquivo (índice de navegação)

### 🔧 Scripts de Instalação
- **[install.sh](install.sh)** ⭐ - Script principal de instalação automatizada
- **[package.sh](package.sh)** - Script para empacotar o kit em .tar.gz

---

## 📂 Estrutura Detalhada

### 🗄️ Database (Banco de Dados)

| Arquivo | Descrição | Linhas | Uso |
|---------|-----------|--------|-----|
| [01_analytics_tables.sql](database/01_analytics_tables.sql) | Criação das 4 tabelas de analytics | ~80 | Execute primeiro |
| [02_icones_system.sql](database/02_icones_system.sql) | Sistema de ícones + 22 inserts | ~120 | Execute depois |
| [03_prisma_schema_reference.prisma](database/03_prisma_schema_reference.prisma) | Modelos Prisma de referência | ~150 | Copiar para schema.prisma |

**Ordem de execução:**
1. `01_analytics_tables.sql`
2. `02_icones_system.sql` (ajuste o nome da tabela antes)
3. Atualizar `schema.prisma` com base em `03_prisma_schema_reference.prisma`

---

### 🔧 Backend (APIs e Jobs)

| Arquivo | Descrição | Endpoints/Funções | Linhas |
|---------|-----------|-------------------|--------|
| [analytics.routes.js](backend/analytics.routes.js) | Rotas de analytics | 7 endpoints | ~300 |
| [icone.routes.js](backend/icone.routes.js) | Rotas de ícones | 7 endpoints | ~250 |
| [analytics-aggregation.job.js](backend/analytics-aggregation.job.js) | Jobs de agregação | 3 funções | ~150 |

#### Analytics Routes (analytics.routes.js)
**Endpoints:**
1. `POST /api/analytics/event` - Registrar evento (público)
2. `GET /api/analytics/access-stats` - Estatísticas de acesso (admin)
3. `GET /api/analytics/overview` - Visão geral (admin)
4. `GET /api/analytics/popular-units` - Unidades populares (admin)
5. `GET /api/analytics/search-terms` - Termos de busca (admin)
6. `GET /api/analytics/conversion-funnel` - Funil de conversão (admin)
7. `GET /api/analytics/timeline` - Série temporal (admin)

#### Icone Routes (icone.routes.js)
**Endpoints:**
1. `GET /api/icones` - Listar ícones
2. `GET /api/icones/:id` - Obter ícone
3. `POST /api/icones` - Criar ícone
4. `POST /api/icones/upload` - Upload de arquivo
5. `PUT /api/icones/:id` - Atualizar ícone
6. `DELETE /api/icones/:id` - Deletar ícone
7. `PUT /api/icones/reordenar/batch` - Reordenar múltiplos

#### Analytics Jobs (analytics-aggregation.job.js)
**Funções:**
1. `calculateSessionDurations()` - Calcular durações (executar a cada hora)
2. `calculateConversionRates()` - Calcular taxas (executar diariamente)
3. `cleanOldData()` - Limpar dados antigos (executar semanalmente)

---

### 🎨 Frontend (React Components)

#### Pages (Páginas)

| Arquivo | Descrição | Componentes | Linhas |
|---------|-----------|-------------|--------|
| [DashboardPage.jsx](frontend/pages/DashboardPage.jsx) | Dashboard com cards de estatísticas | 4 cards de acesso | ~200 |
| [AnalyticsPage.jsx](frontend/pages/AnalyticsPage.jsx) | Página de analytics detalhada | Gráficos + tabelas | ~400 |
| [UnidadesPage.jsx](frontend/pages/UnidadesPage.jsx) | CRUD de unidades com abas | Modal com 6+ abas | ~1200 |

**DashboardPage.jsx:**
- Card: Acessos Hoje
- Card: Acessos na Semana
- Card: Acessos no Mês
- Card: Acessos no Ano

**AnalyticsPage.jsx:**
- DatePicker para filtrar período
- LineChart com eventos ao longo do tempo
- Tabela de unidades populares
- Tabela de termos de busca
- Funil de conversão

**UnidadesPage.jsx:**
- Aba 1: Informações Básicas
- Aba 2: Categorização
- Aba 3: Localização (mapa)
- Aba 4: Contato
- Aba 5: Mídia (upload + ícones)
- Aba 6: Serviços

#### Layouts

| Arquivo | Descrição | Componentes | Linhas |
|---------|-----------|-------------|--------|
| [AdminLayout.jsx](frontend/layouts/AdminLayout.jsx) | Layout admin com menu lateral | Sider + Header + Content | ~250 |

**AdminLayout.jsx:**
- Menu lateral (desktop)
- Drawer (mobile)
- Navegação entre páginas
- Itens de menu: Dashboard, Analytics, Unidades, Categorias, Ícones, Bairros, Usuários, Auditoria

#### Utils

| Arquivo | Descrição | Funções | Linhas |
|---------|-----------|---------|--------|
| [analytics.js](frontend/utils/analytics.js) | Funções de tracking | 10 funções | ~200 |

**Funções exportadas:**
1. `getSessionId()` - Gerar/recuperar session ID
2. `sendEvent()` - Enviar evento para API
3. `trackPageView()` - Rastrear visualização de página
4. `trackBusca()` - Rastrear busca
5. `trackVisualizacaoUnidade()` - Rastrear visualização de unidade
6. `trackCliqueMapaUnidade()` - Rastrear clique no mapa
7. `trackContatoUnidade()` - Rastrear clique em contato
8. `trackRedeSocialUnidade()` - Rastrear clique em rede social
9. `trackFiltroMapa()` - Rastrear filtro aplicado
10. `trackErro()` - Rastrear erro

---

### 🖼️ Ícones (22 arquivos PNG)

| ID | Arquivo | Nome | Tamanho |
|----|---------|------|---------|
| 1 | icone_ass_social_01.png | CRAS | ~29KB |
| 2 | icone_ass_social_02.png | CREAS | ~30KB |
| 3 | icone_ass_social_03.png | Abrigo Institucional | ~45KB |
| 4 | icone_ass_social_04.png | Casa de Passagem | ~43KB |
| 5 | icone_ass_social_05.png | Centro de Convivência | ~43KB |
| 6 | icone_ass_social_06.png | Centro Pop | ~44KB |
| 7 | icone_ass_social_07.png | Unidade de Acolhimento | ~44KB |
| 8 | icone_ass_social_08.png | Centro Dia | ~42KB |
| 9 | icone_ass_social_09.png | Casa Lar | ~45KB |
| 10 | icone_ass_social_10.png | SCFV | ~41KB |
| 11 | icone_ass_social_11.png | Programa Criança Feliz | ~47KB |
| 12 | icone_ass_social_12.png | PAIF | ~45KB |
| 13 | icone_ass_social_13.png | PAEFI | ~40KB |
| 14 | icone_ass_social_14.png | Conselho Tutelar | ~36KB |
| 15 | icone_ass_social_15.png | MSE | ~38KB |
| 16 | icone_ass_social_16.png | Casa de Acolhimento | ~48KB |
| 17 | icone_ass_social_17.png | Residência Inclusiva | ~41KB |
| 18 | icone_ass_social_18.png | Centro de Referência | ~39KB |
| 19 | icone_ass_social_19.png | Serviço de Acolhimento | ~48KB |
| 20 | icone_ass_social_20.png | Unidade de Atendimento | ~48KB |
| 21 | icone_ass_social_21.png | Centro de Apoio | ~41KB |
| 22 | icone_ass_social_22.png | Espaço de Convivência | ~45KB |

**Total:** ~950KB de ícones

---

## 🚀 Fluxo de Instalação Recomendado

### 1. Leitura Inicial
```
README.md → QUICKSTART.md
```

### 2. Instalação
```
./install.sh (automatizado)
ou
docs/INSTALLATION_GUIDE.md (manual)
```

### 3. Configuração
```
Siga as instruções fornecidas pelo install.sh ou pelo guia
```

### 4. Testes
```
INSTALLATION_GUIDE.md → Seção "Testando a Instalação"
```

---

## 🔍 Busca Rápida por Funcionalidade

### 📊 Analytics
- **Backend:** [analytics.routes.js](backend/analytics.routes.js), [analytics-aggregation.job.js](backend/analytics-aggregation.job.js)
- **Frontend:** [DashboardPage.jsx](frontend/pages/DashboardPage.jsx), [AnalyticsPage.jsx](frontend/pages/AnalyticsPage.jsx), [analytics.js](frontend/utils/analytics.js)
- **Database:** [01_analytics_tables.sql](database/01_analytics_tables.sql)
- **Docs:** [INSTALLATION_GUIDE.md](docs/INSTALLATION_GUIDE.md) - Seção "Sistema de Analytics"

### 🎨 Ícones
- **Backend:** [icone.routes.js](backend/icone.routes.js)
- **Frontend:** [UnidadesPage.jsx](frontend/pages/UnidadesPage.jsx) (seção de seleção visual)
- **Database:** [02_icones_system.sql](database/02_icones_system.sql)
- **Arquivos:** [icones/](icones/)
- **Docs:** [INSTALLATION_GUIDE.md](docs/INSTALLATION_GUIDE.md) - Seção "Sistema de Ícones"

### 🗂️ Admin com Abas
- **Frontend:** [UnidadesPage.jsx](frontend/pages/UnidadesPage.jsx), [AdminLayout.jsx](frontend/layouts/AdminLayout.jsx)
- **Docs:** [INSTALLATION_GUIDE.md](docs/INSTALLATION_GUIDE.md) - Seção "Admin com Abas"

---

## 📊 Estatísticas do Kit

| Categoria | Quantidade |
|-----------|------------|
| **Arquivos Totais** | 39 |
| **Arquivos Backend** | 3 |
| **Arquivos Frontend** | 5 |
| **Arquivos Database** | 3 |
| **Ícones PNG** | 22 |
| **Documentação** | 5 |
| **Scripts** | 2 |
| **Tamanho Total** | ~1.2MB |
| **Endpoints API** | 14 |
| **Funções de Tracking** | 10 |
| **Tabelas de Banco** | 5 |
| **Páginas React** | 3 |

---

## 🎯 Links Úteis

### Documentação Interna
- [Visão Geral](README.md)
- [Guia Rápido](QUICKSTART.md)
- [Instalação Completa](docs/INSTALLATION_GUIDE.md)
- [Manifesto](MANIFEST.txt)

### Arquivos de Configuração
- [Migrações SQL](database/)
- [Rotas Backend](backend/)
- [Componentes Frontend](frontend/)

### Scripts Auxiliares
- [Instalador](install.sh)
- [Empacotador](package.sh)

---

## 💡 Dicas de Navegação

1. **Começando?** Leia primeiro [README.md](README.md)
2. **Com pressa?** Vá direto para [QUICKSTART.md](QUICKSTART.md)
3. **Instalação detalhada?** Consulte [INSTALLATION_GUIDE.md](docs/INSTALLATION_GUIDE.md)
4. **Problemas?** Veja [Troubleshooting](docs/INSTALLATION_GUIDE.md#-troubleshooting)
5. **Entender estrutura?** Você está no lugar certo! (INDEX.md)

---

**Última atualização:** 2026-02-12
**Versão:** 1.0.0
