# BelaGuest API

Sistema profissional de agendamento para salão de beleza com arquitetura MVC, Node.js + Express, MySQL e Docker, preparado para evolução para API REST pública.

## 📋 Arquitetura do Projeto

```text
belaguest/
├── src/
│   ├── api/
│   │   ├── controllers/          # Recebem requisições
│   │   ├── models/               # Acesso ao banco de dados
│   │   ├── services/             # Lógica de negócio
│   │   ├── routes/               # Definição de rotas
│   │   ├── validators/           # Validação de requisições
│   │   └── index.js              # Exporta módulos
│   ├── config/
│   │   ├── database.js           # Conexão MySQL
│   │   ├── env.js                # Variáveis de ambiente
│   │   ├── socket.js             # WebSocket (Socket.io)
│   │   └── index.js              # Exporta módulos
│   ├── middlewares/
│   │   ├── auth-middleware.js    # Autenticação JWT
│   │   ├── role-middleware.js    # Autorização por perfil
│   │   ├── error-handler.js      # Tratamento de erros
│   │   ├── validate-request.js   # Validação de requisições
│   │   └── index.js              # Exporta módulos
│   ├── app.js                    # Configuração Express
│   └── server.js                 # Inicialização do servidor
│
├── infra/
│   ├── Dockerfile                # Imagem Docker
│   ├── docker-compose.yml        # Orquestração de containers
│   └── .dockerignore             # Arquivos ignorados no build
│
├── database/
│   └── init.sql                  # Script de inicialização do banco
│
├── docs/
│   ├── getting-started.md        # Guia de inicialização
│   ├── services-system.md        # Sistema de serviços
│   └── test-users.md             # Usuários de teste
│
├── public/                       # Arquivos estáticos (frontend)
├── package.json                  # Dependências do projeto
├── .env.example                  # Variáveis de ambiente exemplo
└── README.md                     # Este arquivo
```

## 🏗️ Arquitetura de Camadas

### Princípios Aplicados
- **Controllers**: Apenas recebem requisições HTTP e delegam para Services
- **Services**: Concentram toda a lógica de negócio da aplicação
- **Models**: Isolam o acesso direto ao banco de dados
- **Routes**: Definem endpoints sem conter regra de negócio
- **Middlewares**: Prototipam autenticação, autorização e validação

### Padrões de Nomenclatura
- **Arquivos**: kebab-case (`auth-middleware.js`, `servico-service.js`)
- **Classes/Exports**: PascalCase quando aplicável
- **Funções**: camelCase
- **Pastas**: lowercase

## 🔧 Configuração do Projeto

### Variáveis de Ambiente

Use o arquivo `.env.example` como base. Crie um arquivo `.env` na raiz:

```env
# Database
DB_HOST=mysql
DB_USER=belaguest_user
DB_PASSWORD=belaguest_pass
DB_NAME=belaguest

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=super_secret_change_me
JWT_EXPIRES_IN=1d

# Logging
LOG_LEVEL=debug
CORS_ORIGIN=*
```

> **⚠️ IMPORTANTE**: Nunca comita o arquivo `.env` com dados reais no repositório!

## 🚀 Como Executar

### Docker Compose (Recomendado para Produção)

```bash
cd belaguest

# Iniciar os containers (API + MySQL)
docker-compose -f infra/docker-compose.yml up -d

# Para verificar logs
docker-compose -f infra/docker-compose.yml logs -f

# Para parar
docker-compose -f infra/docker-compose.yml down
```

**API disponível em**: `http://localhost:3000`

### Instalação Manual com Node.js

```bash
cd belaguest

# Instalar dependências
npm install

# Iniciar servidor
npm start
```

**Requer MySQL 8.0+ instalado e rodando localmente**

## 📚 Banco de Dados

O script `database/init.sql` cria automaticamente:

### Tabelas Principais
- **Usuario**: Usuários da aplicação
- **Cliente**: Perfil de cliente
- **Administrador**: Perfil de administrador
- **Profissional**: Profissionais (funcionários)
- **Servico**: Serviços oferecidos
- **Agendamento**: Agendamentos de clientes
- **ProfissionalServico**: Vinculação profissional ↔ serviço
- **DisponibilidadeProfissional**: Horários de disponibilidade
- **AgendamentoObservacao**: Observações em agendamentos

### Usuários Pré-configurados

| Email | Senha | Tipo | Permissões |
|-------|-------|------|------------|
| `admin@belaguest.com` | `123456` | ADMINISTRADOR | Acesso total |
| `funcionaria@belaguest.com` | `123456` | FUNCIONARIO | Gerenciar disponibilidade e agendamentos |
| `cliente@belaguest.com` | `123456` | CLIENTE | Agendar serviços |

## 🔌 Endpoints Principais (`/api/v1`)

### Autenticação
```
POST   /auth/register        # Registrar novo cliente
POST   /auth/login           # Fazer login
GET    /auth/me              # Obter dados do usuário (JWT)
```

### Serviços
```
GET    /servicos             # Listar todos os serviços
POST   /servicos             # Criar serviço (ADMIN)
PUT    /servicos/:id         # Atualizar serviço (ADMIN)
DELETE /servicos/:id         # Deletar serviço (ADMIN)
```

### Profissionais
```
GET    /profissionais                      # Listar profissionais
GET    /profissionais/me                   # Meus dados (FUNCIONARIO)
GET    /profissionais/me/servicos          # Meus serviços (FUNCIONARIO)
PATCH  /profissionais/me/servicos          # Atualizar meus serviços (FUNCIONARIO)
GET    /profissionais/:id                  # Detalhes do profissional
POST   /profissionais                      # Criar profissional (ADMIN)
PUT    /profissionais/:id                  # Atualizar profissional (ADMIN)
DELETE /profissionais/:id                  # Deletar profissional (ADMIN)
```

### Agendamentos
```
GET    /agendamentos                   # Listar agendamentos (filtrado por permissão)
POST   /agendamentos                   # Criar agendamento (CLIENTE)
PUT    /agendamentos/:id               # Atualizar agendamento
DELETE /agendamentos/:id               # Cancelar agendamento
GET    /agendamentos/sugestoes         # Obter sugestões de horários
GET    /agendamentos/disponibilidade   # Verificar disponibilidade
```

### Dashboard
```
GET    /dashboard/resumo                # Resumo do dia (ADMIN/FUNCIONARIO)
```

### Usuários
```
GET    /usuarios                        # Listar usuários (ADMIN)
PUT    /usuarios/:id                    # Atualizar usuário (ADMIN)
```

### Health Check
```
GET    /health                          # Status da API e banco de dados
```

## 📖 Documentação Completa

Para informações detalhadas sobre endpoints, exemplos de requisições e autenticação, consulte a seção **Endpoints Principais** abaixo.

## 🛠️ Scripts NPM

```bash
npm start            # Iniciar servidor em produção
npm install          # Instalar dependências
```

## 🔐 Autenticação

A aplicação usa **JWT (JSON Web Tokens)** para autenticação:

```bash
# 1. Fazer login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@belaguest.com",
    "senha": "123456"
  }'

# Resposta contém o token
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { "id": 1, "nome": "...", "email": "...", "tipoUsuario": "CLIENTE" }
}

# 2. Usar o token em requisições subsequentes
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🧪 Testing

Recomendamos usar **Postman** ou **Insomnia** para testar a API.

## 🐛 Troubleshooting

### Porta 3000 já está em uso
```bash
lsof -i :3000          # Identificar processo
kill -9 <PID>          # Matar processo
```

### Banco de dados não conecta com Docker
```bash
# Verifique se os containers estão rodando
docker ps

# Reinicie os containers
docker-compose -f infra/docker-compose.yml down
docker-compose -f infra/docker-compose.yml up -d
```

## 📝 Logs

### Com Docker
```bash
# Logs da API
docker-compose -f infra/docker-compose.yml logs -f api

# Logs do MySQL
docker-compose -f infra/docker-compose.yml logs -f mysql

# Ambos
docker-compose -f infra/docker-compose.yml logs -f
```

### Verificar containers
```bash
docker ps
```

## 💡 Dicas

- Em desenvolvimento, a aplicação recarrega automaticamente (`npm run dev`)
- Tokens JWT expiram em 1 dia (configurável em `.env`)
- Para resetar dados do banco: `docker-compose -f infra/docker-compose.yml down -v`
- Sempre use HTTPS em produção
- Altere `JWT_SECRET` antes de ir para produção

## 📧 Contato e Suporte

- **Desenvolvedor**: RaulNeto06
- **Repositório**: https://github.com/RaulNeto06/BellaGuestV1
- **Issues**: https://github.com/RaulNeto06/BellaGuestV1/issues

## 📄 Licença

ISC
- `POST /profissionais` (ADMIN)
- `PUT /profissionais/:id` (ADMIN)
- `DELETE /profissionais/:id` (ADMIN)

### Agendamentos
- `GET /agendamentos`
- `GET /agendamentos/sugestoes?data=YYYY-MM-DD&idServico=1`
- `GET /agendamentos/disponibilidade?data=YYYY-MM-DD&idServico=1&idProfissional=2`
- `POST /agendamentos` (CLIENTE)
- `PUT /agendamentos/:id` (ADMIN/FUNCIONARIO/CLIENTE com regra de acesso)
- `PATCH /agendamentos/:id/cancelar`
- `POST /agendamentos/:id/observacoes` (ADMIN/FUNCIONARIO)

### Dashboard
- `GET /dashboard/resumo` (ADMIN)

## Regras de negócio de agendamento
- Bloqueio de conflito: não permite dois agendamentos no mesmo horário para o mesmo profissional.
- Opção “qualquer profissional disponível”: alocação automática de profissional livre e apto ao serviço.
- Validação de disponibilidade por dia da semana e faixa de horário.
- Cada agendamento ocupa o slot completo.
- Emissão de eventos em tempo real via `socket.io`:
  - `agendamento:created`
  - `agendamento:updated`
  - `agendamento:cancelled`

## UX e evolução de produto
Base pronta para evolução com front-end responsivo (desktop/mobile) com:
- calendário mensal interativo;
- status visual de horários (livre/ocupado/bloqueado);
- filtros por profissional/serviço;
- alertas em tempo real;
- sugestões inteligentes de horários para clientes.

## Interface web já implementada
- Login e cadastro na mesma tela.
- Área de cliente: calendário mensal, filtro por profissional/serviço, reserva de horários e aba de meus agendamentos.
- Área de funcionário: perfil, visão de calendário e agendamentos do dia com marcação de presença/cancelamento/observações, sempre vinculados ao próprio profissional.
- Área de administrador: dashboard, CRUD de profissionais e serviços, visão geral de reservas e calendário operacional.

## Vínculo funcionário-profissional
- O profissional pode ser vinculado a um usuário funcionário pelo campo `idUsuario` no cadastro de profissional.
- Após vínculo, o funcionário passa a operar apenas a própria agenda (visualização e ações).

## Observações
- O projeto já está preparado para deploy futuro em ambientes externos com configuração por variáveis de ambiente.
- A camada de API está organizada para futura abertura pública com versionamento (`/api/v1`).
