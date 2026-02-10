# 🗺️ Mapa da Assistência Social - Corumbá/MS

> Sistema de geolocalização de serviços da Assistência Social de Corumbá

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

## 📋 Sobre o Projeto

O **Mapa da Assistência Social de Corumbá** é uma plataforma web que centraliza informações sobre todos os serviços, programas e unidades da Assistência Social do município, facilitando o acesso da população aos recursos disponíveis.

### 🎯 Funcionalidades

- 🗺️ **Mapa Interativo** - Visualização geolocalizada de todas as unidades
- 🔍 **Busca Avançada** - Filtros por categoria, bairro, tipo de serviço
- 📱 **Responsivo** - Funciona em desktop, tablet e mobile
- ℹ️ **Informações Completas** - Endereço, contatos, horários, serviços oferecidos
- 🎨 **Ícones Customizados** - Identificação visual por tipo de unidade (CRAS, CREAS, etc)
- 📊 **Painel Administrativo** - Gerenciamento de unidades, categorias e ícones

### 🏢 Tipos de Unidades

- **CRAS** - Centro de Referência de Assistência Social
- **CREAS** - Centro de Referência Especializado de Assistência Social
- **Centro POP** - Centro de Atendimento à População em Situação de Rua
- **Abrigos e Casas de Acolhimento**
- **Centros de Convivência**
- E outros serviços da rede socioassistencial

## 🚀 Tecnologias

### Frontend
- **React** 18 - Interface do usuário
- **Ant Design** - Componentes UI
- **Leaflet** - Mapas interativos
- **Redux Toolkit** - Gerenciamento de estado
- **Vite** - Build tool

### Backend
- **Node.js** + **Express** - API REST
- **Prisma** - ORM
- **MySQL** - Banco de dados
- **JWT** - Autenticação

### Infraestrutura
- **Monorepo** - Workspace structure
- **ESLint** + **Prettier** - Code quality

## 📦 Instalação

### Pré-requisitos

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/Prefeitura-de-CorumbaMS/mapa-assistencia-social-corumba.git
cd mapa-assistencia-social-corumba
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas credenciais do banco de dados
```

Variáveis necessárias no `.env`:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/mapa_assistencia"
JWT_SECRET="seu-secret-jwt-aqui"
NODE_ENV="development"
PORT=8011
```

4. **Execute as migrations do banco**
```bash
cd packages/database
npx prisma migrate deploy
npx prisma generate
cd ../..
```

5. **Inicie o servidor de desenvolvimento**
```bash
# Terminal 1 - API
npm run dev:api

# Terminal 2 - Frontend
npm run dev:web
```

6. **Acesse a aplicação**
- Frontend: http://localhost:8012
- API: http://localhost:8011

## 📁 Estrutura do Projeto

```
mapa-assistencia-social-corumba/
├── apps/
│   ├── api/              # Backend (Express + Prisma)
│   │   ├── src/
│   │   │   ├── routes/   # Rotas da API
│   │   │   ├── middleware/
│   │   │   └── index.js
│   │   └── package.json
│   └── web/              # Frontend (React + Vite)
│       ├── src/
│       │   ├── pages/    # Páginas
│       │   ├── components/
│       │   ├── store/    # Redux store
│       │   └── utils/
│       └── package.json
├── packages/
│   ├── database/         # Prisma schema e migrations
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── index.js
│   └── logger/           # Sistema de logs
└── uploads/              # Arquivos de mídia
```

## 🔐 Credenciais Padrão (Desenvolvimento)

```
Usuário: admin
Senha: admin123
```

⚠️ **IMPORTANTE:** Altere as credenciais antes de ir para produção!

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev:api        # Inicia API em modo desenvolvimento
npm run dev:web        # Inicia frontend em modo desenvolvimento

# Produção
npm run build          # Build de todos os pacotes
npm run start          # Inicia em modo produção

# Banco de Dados
npm run db:migrate     # Executa migrations
npm run db:seed        # Popula banco com dados de exemplo
npm run db:studio      # Abre Prisma Studio
```

## 📝 Rotas da API

### Públicas
- `GET /api/unidades` - Lista todas as unidades ativas
- `GET /api/unidades/:id` - Detalhes de uma unidade
- `GET /api/categorias` - Lista categorias
- `GET /api/icones` - Lista ícones ativos

### Autenticadas (Admin)
- `POST /api/auth/login` - Login
- `POST /api/unidades` - Criar unidade
- `PUT /api/unidades/:id` - Atualizar unidade
- `DELETE /api/unidades/:id` - Deletar unidade
- `GET /api/analytics/*` - Estatísticas de uso

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Prefeitura Municipal de Corumbá** - *Iniciativa*
- **Núcleo de Gestão Estratégica e Inovação** - *Desenvolvimento*

## 📞 Contato

- **Site:** [www.corumba.ms.gov.br](https://www.corumba.ms.gov.br)
- **Email:** contato@corumba.ms.gov.br

## 🙏 Agradecimentos

- Equipe da Secretaria de Assistência Social
- Comunidade Open Source
- Todos que contribuíram com feedback e sugestões

---

Desenvolvido com ❤️ pelo Núcleo de Gestão Estratégica e Inovação - Prefeitura de Corumbá/MS
