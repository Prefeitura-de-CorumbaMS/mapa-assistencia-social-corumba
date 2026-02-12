# 📦 Migration Kit - Guia de Instalação

## 🎯 Visão Geral

Este Migration Kit implementa três funcionalidades principais em aplicações de mapa similar:

1. **Sistema de Analytics Completo**
   - Tracking de eventos do usuário
   - Dashboards e gráficos
   - Estatísticas de acesso
   - Análise de conversão

2. **Sistema de Ícones (URL → ID)**
   - Migração de URLs para IDs
   - Gerenciamento de ícones
   - 22 ícones de Assistência Social

3. **Admin com Abas**
   - Layout otimizado
   - Modal com 6+ abas
   - Nome da unidade acima das abas

---

## 🚀 Início Rápido

### Opção 1: Instalação Automatizada (Recomendado)

```bash
# 1. Copie o migration-kit para o diretório desejado
cp -r migration-kit /caminho/destino/

# 2. Entre no diretório
cd /caminho/destino/migration-kit

# 3. Execute o instalador
./install.sh
```

O script interativo irá:
- ✅ Verificar pré-requisitos
- ✅ Coletar informações do projeto
- ✅ Fazer backup automático
- ✅ Executar migrações SQL
- ✅ Copiar arquivos backend e frontend
- ✅ Instalar dependências
- ✅ Fornecer instruções de configuração

### Opção 2: Instalação Manual

Siga as seções detalhadas abaixo.

---

## 📋 Pré-Requisitos

- Node.js 16+ e npm
- MySQL 5.7+ ou MariaDB 10+
- Prisma ORM (recomendado) ou Sequelize
- React 17+ com Redux (ou React Query)
- Ant Design 5+

**Dependências NPM necessárias:**

Frontend:
```json
{
  "recharts": "^2.x",
  "@ant-design/icons": "^5.x",
  "antd": "^5.x",
  "dayjs": "^1.x",
  "react-leaflet": "^4.x",
  "leaflet": "^1.x"
}
```

Backend:
```json
{
  "multer": "^1.x"
}
```

Instale com:
```bash
npm install recharts @ant-design/icons antd dayjs react-leaflet leaflet multer
```

---

## 🗄️ Migração do Banco de Dados

### Passo 1: Backup

**⚠️ IMPORTANTE:** Sempre faça backup antes de executar migrações!

```bash
mysqldump -u usuario -p nome_banco > backup_$(date +%Y%m%d).sql
```

### Passo 2: Executar Migrações

#### 2.1 Analytics Tables

```bash
mysql -u usuario -p nome_banco < database/01_analytics_tables.sql
```

Cria 4 tabelas:
- `analytics_event` - Eventos de usuário
- `analytics_session` - Sessões agregadas
- `analytics_unit_stats` - Estatísticas por unidade
- `analytics_search_stats` - Termos de busca

#### 2.2 Sistema de Ícones

**⚠️ ATENÇÃO:** Edite o arquivo antes de executar!

Abra `database/02_icones_system.sql` e substitua `prod_unidade` pelo nome real da sua tabela de unidades.

```sql
-- Exemplo: Se sua tabela se chama "staging_info_origem"
ALTER TABLE `staging_info_origem`
ADD COLUMN `id_icone` INT NULL AFTER `icone_url`,
...
```

Depois execute:
```bash
mysql -u usuario -p nome_banco < database/02_icones_system.sql
```

### Passo 3: Atualizar Schema Prisma

Adicione os modelos do arquivo `database/03_prisma_schema_reference.prisma` ao seu `schema.prisma`:

```prisma
// Copie os modelos:
// - ANALYTICS_Event
// - ANALYTICS_Session
// - ANALYTICS_UnitStats
// - ANALYTICS_SearchStats
// - PROD_Icone

// E adicione ao seu model de unidades:
model SuaTabelaUnidades {
  // ... campos existentes ...

  icone_url String? @db.VarChar(500)  // Deprecated
  id_icone  Int?

  icone PROD_Icone? @relation(fields: [id_icone], references: [id], onDelete: SetNull)

  @@index([id_icone])
}
```

Depois execute:
```bash
npx prisma generate
npx prisma db push  # ou use migrações
```

---

## 🔧 Configuração Backend

### Estrutura de Diretórios

Assuma que seu projeto backend tem esta estrutura:
```
src/
├── routes/
├── jobs/
└── middleware/
```

### Passo 1: Copiar Arquivos

```bash
# Copiar rotas
cp backend/analytics.routes.js seu-projeto/src/routes/
cp backend/icone.routes.js seu-projeto/src/routes/

# Copiar jobs
cp backend/analytics-aggregation.job.js seu-projeto/src/jobs/

# Copiar ícones
cp icones/*.png seu-projeto/uploads/icones/
```

### Passo 2: Registrar Rotas

No seu arquivo principal (ex: `app.js`, `index.js`, `server.js`):

```javascript
// Importar rotas
const analyticsRoutes = require('./routes/analytics.routes');
const iconeRoutes = require('./routes/icone.routes');

// Registrar rotas
app.use('/api/analytics', analyticsRoutes);
app.use('/api/icones', iconeRoutes);
```

### Passo 3: Configurar Jobs de Agregação

Instale node-cron se ainda não tiver:
```bash
npm install node-cron
```

No seu arquivo de jobs (ex: `jobs/index.js`):

```javascript
const cron = require('node-cron');
const analyticsJob = require('./analytics-aggregation.job');

// Calcular durações de sessão (a cada hora)
cron.schedule('0 * * * *', async () => {
  console.log('Executando: calculateSessionDurations');
  await analyticsJob.calculateSessionDurations();
});

// Calcular taxas de conversão (diariamente à meia-noite)
cron.schedule('0 0 * * *', async () => {
  console.log('Executando: calculateConversionRates');
  await analyticsJob.calculateConversionRates();
});

// Limpar dados antigos (semanalmente aos domingos às 2h)
cron.schedule('0 2 * * 0', async () => {
  console.log('Executando: cleanOldData');
  await analyticsJob.cleanOldData();
});
```

### Passo 4: Configurar Upload de Ícones

Certifique-se de que o diretório `uploads/icones/` existe e tem permissões corretas:

```bash
mkdir -p uploads/icones
chmod 755 uploads/icones
```

No seu servidor Express, adicione suporte a arquivos estáticos:

```javascript
app.use('/uploads', express.static('uploads'));
```

---

## 🎨 Configuração Frontend

### Estrutura de Diretórios

Assuma que seu projeto frontend tem esta estrutura:
```
src/
├── pages/
│   └── admin/
├── layouts/
├── utils/
└── store/ (ou services/)
```

### Passo 1: Copiar Arquivos

```bash
# Copiar páginas
cp frontend/pages/AnalyticsPage.jsx seu-projeto/src/pages/admin/
cp frontend/pages/DashboardPage.jsx seu-projeto/src/pages/admin/
cp frontend/pages/UnidadesPage.jsx seu-projeto/src/pages/admin/

# Copiar utils
cp frontend/utils/analytics.js seu-projeto/src/utils/

# Copiar layouts
cp frontend/layouts/AdminLayout.jsx seu-projeto/src/layouts/
```

### Passo 2: Registrar Rotas

No seu router (ex: `App.jsx`, `routes.jsx`):

```javascript
import AnalyticsPage from './pages/admin/AnalyticsPage';
import DashboardPage from './pages/admin/DashboardPage';
import UnidadesPage from './pages/admin/UnidadesPage';

// Dentro das suas rotas protegidas (admin):
<Route path="/admin/dashboard" element={<DashboardPage />} />
<Route path="/admin/analytics" element={<AnalyticsPage />} />
<Route path="/admin/unidades" element={<UnidadesPage />} />
```

### Passo 3: Configurar Redux/React Query

#### Opção A: Redux (exemplo)

Crie um arquivo `store/analytics.slice.js`:

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAccessStats: builder.query({
      query: () => '/analytics/access-stats',
    }),
    getOverview: builder.query({
      query: ({ start_date, end_date }) =>
        `/analytics/overview?start_date=${start_date}&end_date=${end_date}`,
    }),
    // ... outros endpoints
  }),
});

export const {
  useGetAccessStatsQuery,
  useGetOverviewQuery,
  // ... outros hooks
} = analyticsApi;
```

Adicione ao store:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import { analyticsApi } from './analytics.slice';

export const store = configureStore({
  reducer: {
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    // ... outros reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(analyticsApi.middleware),
});
```

#### Opção B: React Query

```javascript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useAccessStats = () => {
  return useQuery({
    queryKey: ['accessStats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/analytics/access-stats');
      return data;
    },
  });
};
```

### Passo 4: Integrar Tracking de Analytics

Em componentes que precisam de tracking (ex: `MapPage.jsx`):

```javascript
import {
  trackPageView,
  trackVisualizacaoUnidade,
  trackBusca,
  trackContatoUnidade,
  trackFiltroMapa
} from '../utils/analytics';

function MapPage() {
  // Tracking ao montar componente
  useEffect(() => {
    trackPageView(window.location.pathname, document.title);
  }, []);

  // Tracking ao clicar em unidade
  const handleUnitClick = (unidade) => {
    trackVisualizacaoUnidade({
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
      origem: 'mapa'
    });
  };

  // Tracking ao buscar
  const handleSearch = (termo) => {
    trackBusca({
      tipo: 'texto_livre',
      termo: termo,
      resultados: results.length
    });
  };

  // ... resto do componente
}
```

### Passo 5: Ajustar Imports dos Ícones

Nos componentes que usam ícones, certifique-se de importar do Ant Design:

```javascript
import {
  DashboardOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  // ... outros ícones
} from '@ant-design/icons';
```

---

## 🔐 Configuração de Segurança

### Autenticação nas Rotas de Analytics

As rotas de analytics (exceto POST /api/analytics/event) requerem autenticação.

Certifique-se de ter um middleware de autenticação:

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;
```

Aplicar nas rotas:

```javascript
// routes/analytics.routes.js
const authMiddleware = require('../middleware/auth');

// Rotas protegidas
router.get('/access-stats', authMiddleware, getAccessStats);
router.get('/overview', authMiddleware, getOverview);
// ...
```

### Permissões de Upload

Configure limites de upload no multer (já configurado em `icone.routes.js`):

```javascript
const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 500 * 1024 }, // 500KB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
});
```

---

## 🧪 Testando a Instalação

### 1. Testar Backend

```bash
# Iniciar servidor
npm run dev

# Testar endpoint público de analytics
curl -X POST http://localhost:3000/api/analytics/event \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-session-123",
    "event_type": "PAGE_VIEW",
    "event_data": {"page": "/test"}
  }'

# Testar endpoint de ícones (com autenticação)
curl http://localhost:3000/api/icones
```

### 2. Testar Frontend

1. Acesse `/admin/dashboard` - deve ver os cards de estatísticas
2. Acesse `/admin/analytics` - deve ver gráficos e tabelas
3. Acesse `/admin/unidades` - deve ver o modal com abas
4. Teste tracking:
   - Abra DevTools > Network
   - Navegue pelo mapa
   - Procure chamadas para `/api/analytics/event`

### 3. Verificar Banco de Dados

```sql
-- Verificar se eventos estão sendo registrados
SELECT * FROM analytics_event ORDER BY created_at DESC LIMIT 10;

-- Verificar sessões
SELECT * FROM analytics_session ORDER BY first_seen DESC LIMIT 10;

-- Verificar ícones
SELECT * FROM prod_icone;
```

---

## 🐛 Troubleshooting

### Problema: Erro "Cannot find module '@prisma/client'"

**Solução:**
```bash
npx prisma generate
```

### Problema: Ícones não aparecem no frontend

**Verificações:**
1. Ícones copiados para `uploads/icones/`?
2. Diretório `uploads` exposto como estático no Express?
3. URLs dos ícones corretas no banco de dados?

**Solução:**
```javascript
// No servidor Express
app.use('/uploads', express.static('uploads'));
```

### Problema: Analytics não registra eventos

**Verificações:**
1. Endpoint `/api/analytics/event` está acessível?
2. `utils/analytics.js` importado corretamente?
3. Funções de tracking sendo chamadas?

**Debug:**
```javascript
// Em utils/analytics.js, adicione console.log temporário:
export const sendEvent = async (eventType, eventData) => {
  console.log('Sending event:', eventType, eventData); // DEBUG
  // ... resto do código
};
```

### Problema: Modal de unidades não abre

**Verificações:**
1. Ant Design instalado?
2. Estilos do Ant Design importados?
3. Redux/React Query configurado?

**Solução:**
```javascript
// No arquivo principal (index.js ou App.jsx)
import 'antd/dist/reset.css';
```

### Problema: Jobs não executam

**Verificações:**
1. node-cron instalado?
2. Jobs configurados no arquivo principal?
3. Servidor rodando continuamente?

**Teste manual:**
```javascript
// Em um arquivo de teste
const analyticsJob = require('./jobs/analytics-aggregation.job');

(async () => {
  await analyticsJob.calculateSessionDurations();
  console.log('Job executado com sucesso');
})();
```

---

## 📊 Estrutura de Dados

### Tipos de Eventos (event_type)

| Tipo | Descrição | Dados Típicos |
|------|-----------|---------------|
| `PAGE_VIEW` | Visualização de página | `{ page, title }` |
| `SEARCH` | Busca realizada | `{ tipo, termo, resultados }` |
| `UNIT_VIEW` | Unidade visualizada | `{ unidadeId, unidadeNome, origem }` |
| `MAP_CLICK` | Clique no mapa | `{ unidadeId, latitude, longitude }` |
| `CONTACT_CLICK` | Clique em contato | `{ tipo, unidadeId }` |
| `SOCIAL_CLICK` | Clique em rede social | `{ redeSocial, unidadeId }` |
| `FILTER_APPLIED` | Filtro aplicado | `{ tipoFiltro, valorFiltro }` |
| `ERROR` | Erro capturado | `{ mensagem, pagina }` |

### Tipos de Busca (search_type)

- `texto_livre`
- `bairro`
- `unidade`
- `categoria`
- `especialidade`

### Tipos de Contato (tipo)

- `whatsapp`
- `phone`
- `email`
- `como_chegar`

---

## 🔄 Migrando Dados Existentes

Se você já possui unidades com `icone_url` e quer migrar para `id_icone`:

### Estratégia 1: Migração por Script SQL

```sql
-- Exemplo: Migrar todas as unidades que usam icone_ass_social_01.png
UPDATE prod_unidade
SET id_icone = 1
WHERE icone_url LIKE '%icone_ass_social_01.png%';

-- Repetir para cada ícone (1-22)
```

### Estratégia 2: Migração por Script Node.js

Crie um arquivo `scripts/migrate-icons.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateIcons() {
  const unidades = await prisma.pROD_UnidadeAssistenciaSocial.findMany({
    where: {
      icone_url: { not: null },
      id_icone: null
    }
  });

  for (const unidade of unidades) {
    // Extrair número do ícone da URL
    const match = unidade.icone_url.match(/icone_ass_social_(\d+)/);
    if (match) {
      const iconeId = parseInt(match[1]);
      await prisma.pROD_UnidadeAssistenciaSocial.update({
        where: { id: unidade.id },
        data: { id_icone: iconeId }
      });
      console.log(`Migrado: ${unidade.nome} → ícone ${iconeId}`);
    }
  }

  console.log('Migração concluída!');
}

migrateIcons().catch(console.error).finally(() => prisma.$disconnect());
```

Execute:
```bash
node scripts/migrate-icons.js
```

---

## 📈 Monitoramento e Performance

### Índices de Banco de Dados

Todos os índices necessários já são criados pelas migrações. Verifique:

```sql
-- Analytics
SHOW INDEX FROM analytics_event;
SHOW INDEX FROM analytics_session;
SHOW INDEX FROM analytics_unit_stats;

-- Ícones
SHOW INDEX FROM prod_icone;
SHOW INDEX FROM prod_unidade;
```

### Limpeza de Dados

Os jobs de agregação limpam dados antigos automaticamente:
- Eventos: > 90 dias
- Sessões: > 90 dias

Para ajustar o período, edite `backend/analytics-aggregation.job.js`:

```javascript
// Alterar período de limpeza
const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - 180); // 180 dias ao invés de 90
```

### Otimização de Queries

Para grandes volumes de dados, considere:

1. **Particionamento de tabelas** por data
2. **Agregação incremental** em tabelas separadas
3. **Cache** de queries frequentes (Redis)

---

## 🔗 Integração com Outras Ferramentas

### Google Analytics (GA4)

Envie eventos também para o GA4:

```javascript
// Em utils/analytics.js
export const sendEvent = async (eventType, eventData) => {
  // Enviar para backend
  // ... código existente ...

  // Enviar para GA4
  if (window.gtag) {
    window.gtag('event', eventType, eventData);
  }
};
```

### Sentry (Error Tracking)

Integre o tracking de erros com Sentry:

```javascript
import * as Sentry from '@sentry/react';
import { trackErro } from './utils/analytics';

export const trackErro = (mensagem, pagina) => {
  // Enviar para backend
  sendEvent('ERROR', { mensagem, pagina });

  // Enviar para Sentry
  Sentry.captureMessage(mensagem, {
    level: 'error',
    extra: { pagina }
  });
};
```

---

## 📝 Changelog

### v1.0.0 (2025-02-12)

**Funcionalidades incluídas:**
- ✅ Sistema de Analytics completo (4 tabelas)
- ✅ 7 endpoints de analytics
- ✅ Tracking automático de 8 tipos de eventos
- ✅ Dashboard com 4 cards de estatísticas
- ✅ Página de analytics com gráficos e tabelas
- ✅ Sistema de ícones com 22 ícones de Assistência Social
- ✅ Migração URL → ID para ícones
- ✅ API de gerenciamento de ícones
- ✅ Modal de unidades com 6+ abas
- ✅ Layout admin otimizado
- ✅ Jobs de agregação e limpeza
- ✅ Script de instalação automatizado

---

## 🤝 Suporte

Se encontrar problemas durante a instalação:

1. Verifique a seção **Troubleshooting** acima
2. Revise os logs do backend e frontend
3. Consulte a documentação original do projeto

---

## 📄 Licença

Este Migration Kit é parte do projeto Mapa da Assistência Social de Corumbá.

---

**Desenvolvido com ❤️ para facilitar a implementação de funcionalidades entre projetos similares.**

---

## 📚 Referências Úteis

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Ant Design Components](https://ant.design/components/overview/)
- [Recharts Documentation](https://recharts.org/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Node-cron](https://www.npmjs.com/package/node-cron)
- [Multer](https://www.npmjs.com/package/multer)
