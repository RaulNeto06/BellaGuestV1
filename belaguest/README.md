# BelaGuest API

Sistema profissional de agendamento para salão de beleza com arquitetura MVC completa. Desenvolvido com Node.js, Express, MySQL e Socket.io, pronto para deploy em produção.

## Overview

BelaGuest é uma aplicação web para gerenciamento de agendamentos em salões de beleza, permitindo que clientes agendem serviços, profissionais gerenciem sua disponibilidade e administradores controlem toda a operação.

### Funcionalidades Principais
- Autenticação segura com JWT
- Cadastro e gerenciamento de serviços
- Agendamento de clientes com verificação de disponibilidade
- Dashboard com resumo diário
- Sistema de notificações em tempo real via WebSocket
- Interface web responsiva
- Controle de acesso baseado em papéis (RBAC)

## Stack Tecnológico

### Backend
- Node.js 24+ (LTS)
- Express.js 4.21.0
- MySQL 8.0
- JWT (jsonwebtoken)
- Socket.io para real-time
- bcryptjs para password hashing
- express-validator para validações

### Frontend
- HTML5 semântico
- CSS3 modularizado
- JavaScript ES6+
- responsive design (mobile-first)

### Infrastructure
- Docker para containerização
- Docker Compose para orquestração
- Port 3000

## Estrutura do Projeto

```
belaguest/
├── src/
│   ├── api/
│   │   ├── controllers/         # Controladores HTTP
│   │   ├── models/              # Acesso ao banco de dados
│   │   ├── services/            # Lógica de negócio
│   │   ├── routes/              # Definição de endpoints
│   │   └── validators/          # Express-validator rules
│   ├── config/
│   │   ├── database.js          # Pool de conexões MySQL
│   │   ├── env.js               # Variáveis de ambiente
│   │   └── socket.js            # Configuração WebSocket
│   ├── middlewares/
│   │   ├── auth-middleware.js   # Autenticação JWT
│   │   ├── role-middleware.js   # Autorização RBAC
│   │   ├── error-handler.js     # Tratamento de erros
│   │   └── validate-request.js  # Execução de validações
│   ├── app.js                   # Configuração Express
│   └── server.js                # Inicialização do servidor
├── infra/
│   ├── Dockerfile               # Imagem Docker
│   └── docker-compose.yml       # Orquestração
├── database/
│   └── init.sql                 # Schema + dados iniciais
├── public/                      # Arquivos estáticos
│   ├── index.html
│   ├── app.css
│   └── app.js
├── .env.example                 # Template de variáveis
├── .gitignore
├── package.json
└── README.md
```

## Arquitetura de Camadas

### MVC Pattern

- **Models**: Isolam acesso ao banco de dados via SQL queries
- **Services**: Contêm toda a lógica de negócio da aplicação
- **Controllers**: Recebem requisições HTTP e orquestram respostas
- **Routes**: Definem endpoints sem conter lógica
- **Middlewares**: Autenticação, autorização, validação e tratamento de erros

## Instalação Local

### Pré-requisitos
- Node.js 24+
- MySQL 8.0+
- Docker (opcional, recomendado)

### Setup

1. Clone o repositório:
```bash
git clone https://github.com/RaulNeto06/BellaGuestV1.git
cd BellaGuestV1/belaguest
```

2. Instale dependências:
```bash
npm install
```

3. Configure variáveis de ambiente:
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

4. Inicie o servidor:
```bash
npm start
```

API estará disponível em `http://localhost:3000`

## Executar com Docker

Recomendado para produção:

```bash
cd belaguest

# Iniciar containers
docker-compose -f infra/docker-compose.yml up -d

# Verificar logs
docker-compose -f infra/docker-compose.yml logs -f

# Parar containers
docker-compose -f infra/docker-compose.yml down
```

API estará disponível em `http://localhost:3000`

## Banco de Dados

O arquivo `database/init.sql` cria automaticamente:

### Tabelas
- Usuario: usuários do sistema
- Profissional: prestadores de serviço
- Servico: serviços oferecidos
- Agendamento: agendamentos de clientes
- ProfissionalServico: relacionamento profissional-serviço
- DisponibilidadeProfissional: horários disponíveis
- AgendamentoObservacao: anotações

### Usuários Padrão

| Email | Senha | Papel |
|-------|-------|-------|
| admin@belaguest.com | 123456 | ADMINISTRADOR |
| profissional@belaguest.com | 123456 | PROFISSIONAL |
| cliente@belaguest.com | 123456 | CLIENTE |

## API Endpoints

Todos os endpoints requerem autenticação JWT (exceto login/register).

### Auth
- `POST /api/v1/auth/register` - Registrar novo cliente
- `POST /api/v1/auth/login` - Fazer login
- `GET /api/v1/auth/me` - Dados do usuário autenticado

### Servicos
- `GET /api/v1/servicos` - Listar serviços
- `POST /api/v1/servicos` - Criar serviço (admin)
- `PUT /api/v1/servicos/:id` - Atualizar serviço (admin)
- `DELETE /api/v1/servicos/:id` - Deletar serviço (admin)

### Profissionais
- `GET /api/v1/profissionais` - Listar profissionais
- `GET /api/v1/profissionais/:id` - Detalhes do profissional
- `GET /api/v1/profissionais/me` - Dados do profissional logado
- `POST /api/v1/profissionais` - Criar profissional (admin)
- `PUT /api/v1/profissionais/:id` - Atualizar profissional (admin)
- `DELETE /api/v1/profissionais/:id` - Deletar profissional (admin)

### Agendamentos
- `GET /api/v1/agendamentos` - Listar agendamentos
- `POST /api/v1/agendamentos` - Criar agendamento
- `PUT /api/v1/agendamentos/:id` - Atualizar agendamento
- `DELETE /api/v1/agendamentos/:id` - Cancelar agendamento
- `GET /api/v1/agendamentos/disponibilidade` - Verificar disponibilidade
- `GET /api/v1/agendamentos/sugestoes` - Obter sugestões de horários

### Dashboard
- `GET /api/v1/dashboard/resumo` - Resumo do dia

### Health
- `GET /health` - Status da API e banco de dados

## Autenticação

Usa JWT (JSON Web Tokens) com Bearer token.

### Exemplo: Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@belaguest.com",
    "senha": "123456"
  }'
```

Resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Cliente",
    "email": "cliente@belaguest.com",
    "tipoUsuario": "CLIENTE"
  }
}
```

### Usar Token
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Variáveis de Ambiente

Crie um arquivo `.env` baseado em `.env.example`:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha_segura
DB_NAME=belaguest

# Server
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=sua_chave_secreta_bem_segura
JWT_EXPIRES_IN=1d

# CORS
CORS_ORIGIN=https://seu-dominio.com
```

**Segurança**: Nunca commite o arquivo `.env` com dados reais.

## Desenvolvimento

### Em Modo Dev (with auto-reload)
```bash
npm run dev
```

Usa nodemon para auto-reload em mudanças.

### Testes

Faltam testes. Para implementar:
```bash
npm install --save-dev jest supertest
```

## Scripts NPM

```bash
npm start          # Iniciar servidor (produção)
npm run dev        # Iniciar com nodemon (desenvolvimento)
npm install        # Instalar dependências
```

## Troubleshooting

### Porta 3000 já em uso
```bash
lsof -i :3000
kill -9 <PID>
```

### Conexão com banco recusada
Verifique se MySQL está rodando e credenciais estão corretas em `.env`.

Com Docker:
```bash
docker-compose -f infra/docker-compose.yml restart mysql
```

### Resetar banco de dados
```bash
docker-compose -f infra/docker-compose.yml down -v
docker-compose -f infra/docker-compose.yml up -d
```

## Padrões de Código

### Nomenclatura
- Pastas: lowercase (api/, config/)
- Arquivos: kebab-case (auth-controller.js)
- Variáveis/funções: camelCase (getUserById)
- Classes: PascalCase (UserService)

### ES6+
- Use const/let (não var)
- Arrow functions
- Template literals
- Destructuring
- Async/await

### Estrutura
- Controllers: delegam para Services
- Services: implementam lógica
- Models: apenas queries SQL
- Middlewares: reutilizáveis

## Deployment

### Docker (Recomendado)

```bash
# Build
docker build -f infra/Dockerfile -t belaguest-api:latest .

# Run
docker run -p 3000:3000 --env-file .env belaguest-api:latest
```

Com Docker Compose:
```bash
docker-compose -f infra/docker-compose.yml up -d
```

### Considerações de Produção
1. Use HTTPS (nginx com Let's Encrypt)
2. Altere JWT_SECRET para valor seguro
3. Use variáveis de ambiente reais (não .env)
4. Implemente rate limiting
5. Configure CORS para domínios conhecidos
6. Monitore logs e performance
7. Use reverse proxy (nginx)
8. Implemente backups automáticos do DB
9. Configure SSL/TLS
10. Use processo manager (PM2)

## Dependências de Produção

| Pacote | Versão | Uso |
|--------|--------|-----|
| express | 4.21.0 | Framework web |
| mysql2 | 3.11.3 | Driver MySQL |
| jsonwebtoken | 9.0.2 | JWT authentication |
| bcryptjs | 2.4.3 | Password hashing |
| express-validator | 7.2.0 | Validações |
| socket.io | 4.8.1 | WebSocket real-time |
| cors | 2.8.5 | CORS handling |
| morgan | 1.10.0 | HTTP logging |
| dotenv | 16.4.5 | Variáveis de ambiente |

## Débitos Técnicos

Implementações futuras recomendadas:
- Testes unitários (Jest)
- Testes de integração
- Rate limiting
- Sanitização adicional de inputs
- Logging estruturado
- Database transactions
- API documentation (Swagger/OpenAPI)
- Caching (Redis)
- Monitoramento (APM)
- Paginação em endpoints listar

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

ISC

## Contato

- GitHub: https://github.com/RaulNeto06/BellaGuestV1
- Issues: https://github.com/RaulNeto06/BellaGuestV1/issues
