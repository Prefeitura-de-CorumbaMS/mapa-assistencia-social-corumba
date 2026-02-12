# ⚡ Quick Start - Migration Kit

## 🎯 Instalação em 5 Minutos

### 1️⃣ Copiar o Kit
```bash
cp -r migration-kit /seu-projeto/
cd /seu-projeto/migration-kit
```

### 2️⃣ Executar Instalador
```bash
./install.sh
```

### 3️⃣ Seguir Prompts
O script irá perguntar:
- Caminho do projeto
- Estrutura (monorepo/separado/único)
- Nome da tabela de unidades
- Credenciais do banco (opcional)

### 4️⃣ Ações Manuais (5 min)

#### Backend (`seu-projeto/src/app.js`):
```javascript
// Adicionar rotas
const analyticsRoutes = require('./routes/analytics.routes');
const iconeRoutes = require('./routes/icone.routes');

app.use('/api/analytics', analyticsRoutes);
app.use('/api/icones', iconeRoutes);
```

#### Frontend (`seu-projeto/src/App.jsx`):
```javascript
// Adicionar rotas
import AnalyticsPage from './pages/admin/AnalyticsPage';
import DashboardPage from './pages/admin/DashboardPage';

<Route path="/admin/dashboard" element={<DashboardPage />} />
<Route path="/admin/analytics" element={<AnalyticsPage />} />
```

#### Schema Prisma (`prisma/schema.prisma`):
```bash
# Copiar modelos de: database/03_prisma_schema_reference.prisma
npx prisma generate
```

### 5️⃣ Testar
```bash
# Backend
npm run dev

# Frontend
npm run dev

# Acesse: http://localhost:3000/admin/dashboard
```

---

## 🔥 Comandos Úteis

### Banco de Dados
```bash
# Executar migrações manualmente
mysql -u user -p database < database/01_analytics_tables.sql
mysql -u user -p database < database/02_icones_system.sql

# Verificar tabelas criadas
mysql -u user -p database -e "SHOW TABLES LIKE 'analytics_%'"
```

### Testar APIs
```bash
# Analytics (público)
curl -X POST http://localhost:3000/api/analytics/event \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test-123","event_type":"PAGE_VIEW","event_data":{}}'

# Ícones (público)
curl http://localhost:3000/api/icones

# Stats (requer auth)
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:3000/api/analytics/access-stats
```

---

## 📦 O Que Foi Instalado?

✅ **Banco de Dados:**
- 4 tabelas de analytics
- 1 tabela de ícones (+ 22 registros)

✅ **Backend:**
- 2 arquivos de rotas
- 1 arquivo de jobs
- 22 ícones PNG

✅ **Frontend:**
- 3 páginas React
- 1 arquivo de utils (tracking)
- 1 layout admin

---

## 🎨 Próximos Passos

### 1. Configurar Jobs (Opcional)
```javascript
// Adicione em seu arquivo de jobs
const cron = require('node-cron');
const analyticsJob = require('./jobs/analytics-aggregation.job');

cron.schedule('0 * * * *', analyticsJob.calculateSessionDurations);
cron.schedule('0 0 * * *', analyticsJob.calculateConversionRates);
cron.schedule('0 2 * * 0', analyticsJob.cleanOldData);
```

### 2. Integrar Tracking
```javascript
// Em qualquer componente
import { trackPageView, trackBusca } from '../utils/analytics';

useEffect(() => {
  trackPageView(location.pathname, document.title);
}, [location]);

const handleSearch = (termo) => {
  trackBusca({ tipo: 'texto_livre', termo, resultados: data.length });
};
```

### 3. Customizar Ícones
```bash
# Adicionar novos ícones
# 1. Copie PNG para: uploads/icones/
# 2. Insira no banco:
INSERT INTO prod_icone (nome, url, ativo, ordem)
VALUES ('Novo Tipo', '/uploads/icones/novo.png', 1, 23);
```

---

## 🐛 Problemas?

### Erro: "Cannot find module @prisma/client"
```bash
npx prisma generate
```

### Ícones não aparecem
```javascript
// Adicione no servidor Express:
app.use('/uploads', express.static('uploads'));
```

### Analytics não registra eventos
```javascript
// Verifique se analytics.js foi importado:
import { trackPageView } from './utils/analytics';
```

---

## 📚 Documentação Completa

Para informações detalhadas, consulte:
- **[README.md](README.md)** - Visão geral completa
- **[INSTALLATION_GUIDE.md](docs/INSTALLATION_GUIDE.md)** - Guia detalhado (30+ páginas)

---

## ✅ Checklist de Instalação

```
□ Kit copiado para o projeto
□ Script install.sh executado
□ Migrações SQL aplicadas
□ Schema Prisma atualizado
□ Rotas backend registradas
□ Rotas frontend registradas
□ Dependências npm instaladas
□ Servidor testado
□ Dashboard acessível
□ Analytics testado
□ Ícones funcionando
□ Tracking implementado (opcional)
□ Jobs configurados (opcional)
```

---

**Tudo pronto? Agora você tem analytics profissional no seu mapa! 📊🎉**
