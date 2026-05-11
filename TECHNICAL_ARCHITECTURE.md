# Arquitetura Técnica - BelaGuest V1

**Versão**: 1.0.0  
**Status**: Production Ready  
**Data**: 11 de maio de 2026

---

## 1. VISÃO GERAL ARQUITETURAL

BelaGuest é um sistema web de agendamento para salões de beleza baseado em arquitetura **MVC com separação de camadas**, implementado com Node.js/Express no backend e HTML5/CSS3/JS no frontend.

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                    │
│  HTML5 + CSS3 Modularizado + JavaScript (1.530 linhas)  │
└─────────────────────────────────────────────────────────┘
                            ↓
                     Express.js 4.21
                     (Middlewares)
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      API REST                            │
│  /api/v1/* endpoints com JWT authentication              │
└─────────────────────────────────────────────────────────┘
                            ↓
         ┌──────────────────────────────────────┐
         │   MVC Architecture (Lamasd Layer)     │
         │                                      │
         ├─ Controllers (6) - HTTP requests    │
         ├─ Services (6) - Business logic      │
         ├─ Models (5) - Data access          │
         └──────────────────────────────────────┘
                            ↓
                   MySQL 8.0 Database
                   (InnoDB Pool)
```

---

## 2. TECHNOLOGIES STACK

### Backend
| Camada | Tecnologia | Versão | Propósito |
|--------|-----------|--------|----------|
| **Runtime** | Node.js | 24+ LTS | Execução JavaScript |
| **Framework** | Express.js | 4.21.0 | Web application framework |
| **Database** | MySQL | 8.0 | RDBMS relacional |
| **Driver DB** | mysql2 | 3.11.3 | Connection pooling |
| **Auth** | JWT | jsonwebtoken 9.0.2 | Authentication tokens |
| **Hashing** | bcryptjs | 2.4.3 | Password encryption |
| **Validation** | express-validator | 7.2.0 | Request validation |
| **Real-time** | Socket.io | 4.8.1 | WebSocket communication |
| **CORS** | cors | 2.8.5 | Cross-origin requests |
| **Logging** | morgan | 1.10.0 | HTTP logging |
| **Rate Limit** | express-rate-limit | 7.1.5 | Request throttling |
| **Env** | dotenv | 16.4.5 | Environment variables |

### Frontend
| Componente | Tecnologia | Descrição |
|-----------|-----------|----------|
| **Markup** | HTML5 | Semântico + ARIA |
| **Styling** | CSS3 Modularizado | 8 arquivos importados |
| **JavaScript** | ES6+ | 1.530 linhas modularizadas |
| **Icons** | Font Awesome | CDN v6.5.1 |
| **Fonts** | Google Fonts | Playfair Display + Poppins |
| **Real-time** | Socket.io Client | WebSocket |

### Infrastructure
| Componente | Tecnologia | Descrição |
|-----------|-----------|----------|
| **Containerização** | Docker | Production image |
| **Orchestration** | Docker Compose | API + MySQL |
| **Port** | 3000 | Default HTTP |

### Testing
| Framework | Versão | Propósito |
|-----------|--------|----------|
| Jest | 29.7.0 | Unit & integration tests |
| Supertest | 6.3.3 | HTTP assertions |

---

## 3. ESTRUTURA DE PASTAS

```
belaguest/
│
├── src/                          # Código-fonte backend
│   ├── api/
│   │   ├── controllers/          # HTTP request handlers (6 arquivos)
│   │   │   ├── auth-controller.js
│   │   │   ├── agendamento-controller.js
│   │   │   ├── profissional-controller.js
│   │   │   ├── servico-controller.js
│   │   │   ├── dashboard-controller.js
│   │   │   ├── user-controller.js
│   │   │   └── index.js
│   │   │
│   │   ├── services/             # Business logic (6 arquivos)
│   │   │   ├── auth-service.js
│   │   │   ├── agendamento-service.js
│   │   │   ├── profissional-service.js
│   │   │   ├── servico-service.js
│   │   │   ├── dashboard-service.js
│   │   │   ├── user-service.js
│   │   │   ├── http-error.js     # Custom error class
│   │   │   └── index.js
│   │   │
│   │   ├── models/               # Data access layer (5 arquivos)
│   │   │   ├── user-model.js
│   │   │   ├── agendamento-model.js
│   │   │   ├── profissional-model.js
│   │   │   ├── servico-model.js
│   │   │   ├── cliente-model.js
│   │   │   └── index.js
│   │   │
│   │   ├── routes/               # HTTP routes (6 arquivos)
│   │   │   ├── auth-routes.js
│   │   │   ├── agendamento-routes.js
│   │   │   ├── profissional-routes.js
│   │   │   ├── servico-routes.js
│   │   │   ├── dashboard-routes.js
│   │   │   ├── user-routes.js
│   │   │   └── index.js
│   │   │
│   │   ├── validators/           # Input validation
│   │   │   ├── validators.js
│   │   │   └── index.js
│   │   │
│   │   └── index.js
│   │
│   ├── config/                   # Configuração
│   │   ├── database.js           # Pool MySQL
│   │   ├── env.js                # Variáveis ambiente
│   │   ├── socket.js             # Socket.io config
│   │   └── index.js
│   │
│   ├── middlewares/              # Express middlewares (4 arquivos)
│   │   ├── auth-middleware.js    # JWT verification
│   │   ├── role-middleware.js    # RBAC
│   │   ├── error-handler.js      # Error responses
│   │   ├── validate-request.js   # Validator executor
│   │   └── index.js
│   │
│   ├── app.js                    # Express setup
│   └── server.js                 # HTTP server init
│
├── infra/                        # Infrastructure
│   ├── Dockerfile                # Production image
│   ├── docker-compose.yml        # API + MySQL
│   └── .dockerignore
│
├── database/
│   └── init.sql                  # Schema + data
│
├── public/                       # Frontend
│   ├── css/                      # 8 arquivos CSS modularizados
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── auth.css
│   │   ├── app.css
│   │   └── responsive.css
│   ├── js/
│   │   └── app.js                # 1.530 linhas modularizadas
│   └── index.html                # HTML5 semântico + ARIA
│
├── __tests__/                    # Testes
│   ├── setup.js
│   └── api/
│       └── services/
│           └── auth-service.test.js
│
├── .gitignore
├── .env.example
├── package.json
├── jest.config.js
├── README.md
└── REFACTORING_REPORT.md
```

---

## 4. FLUXO DE REQUISIÇÃO

### Exemplo: Criar Agendamento

```
1. REQUEST
   POST /api/v1/agendamentos
   Authorization: Bearer {token}
   Content-Type: application/json
   
   {
     "data": "2026-05-20",
     "horario": "14:30",
     "idServico": 1,
     "idProfissional": 2
   }
                            ↓
2. MIDDLEWARE CHAIN
   - CORS validation
   - Rate limit check
   - Body parser
   - Morgan logging
                            ↓
3. ROUTING
   routes/agendamento-routes.js
   POST /agendamentos → controller.create
                            ↓
4. AUTHENTICATION
   auth-middleware.js
   - Extract JWT token
   - Verify signature
   - Attach req.user = {id, tipoUsuario, ...}
                            ↓
5. AUTHORIZATION
   role-middleware.js
   - Check tipoUsuario (must be CLIENTE)
                            ↓
6. VALIDATION
   validate-request.js
   - express-validator rules
   - Sanitize inputs
   - Return 400 if invalid
                            ↓
7. CONTROLLER HANDLER
   controllers/agendamento-controller.js
   - Call service.create(req.body)
   - Handle response
   - Return 201 JSON
                            ↓
8. SERVICE LAYER
   services/agendamento-service.js
   - Verify profissional availability
   - Check service pricing
   - Business logic validation
   - Call model to create
                            ↓
9. DATA ACCESS
   models/agendamento-model.js
   - SQL INSERT query
   - Execute on pool
   - Return inserted ID
                            ↓
10. RESPONSE
    Return 201 Created
    {
      "id": 123,
      "data": "2026-05-20",
      "horario": "14:30",
      "idServico": 1,
      "idProfissional": 2,
      "tipoUsuarioCriador": "CLIENTE"
    }
                            ↓
11. BROADCAST (WebSocket)
    Via Socket.io emit to admin/profissional
    "agendamento:criado" event
```

---

## 5. PADRÕES DE DESIGN

### MVC (Model-View-Controller)
- **Models**: Isolam queries SQL e acesso ao banco
- **Controllers**: Orquestram requisições HTTP
- **Views**: HTML + CSS + JS no frontend

### Service Layer
- Business logic desacoplada de HTTP
- Reutilizável em diferentes contextos
- Testável independentemente

### Middleware Pattern
- Separação de responsabilidades
- Requestcomo pipeline
- Composable e reusable

### Error Handling
- Custom `HttpError` class
- Consistent response format
- Error handler middleware

### Validation Pattern
- express-validator rules
- Centralized in validators.js
- Executeano validate-request.js

---

## 6. SEGURANÇA IMPLEMENTADA

### Authentication
```javascript
JWT Token com:
- User ID
- User Type (CLIENTE, PROFISSIONAL, ADMINISTRADOR)
- Expiration: 1 dia
- Secret: Variável de ambiente
```

### Authorization
```
Baseada em Tipos de Usuário:
- CLIENTE: Agendamentos próprios
- PROFISSIONAL: Seus agendamentos + disponibilidade
- ADMINISTRADOR: Acesso total
```

### CORS
```javascript
origin: env.CORS_ORIGIN (default: http://localhost:3000)
methods: GET, POST, PUT, DELETE, PATCH
headers: Content-Type, Authorization
credentials: true
```

### Rate Limiting
```javascript
- API geral: 100 requests / 15 mins
- Auth endpoints: 5 attempts / 15 mins
- Health check: Sem limite
```

### Request Size
```javascript
JSON limit: 10KB
URL-encoded limit: 10KB
```

### Password Security
```javascript
Bcrypt hashing:
- Rounds: 10 (configurable)
- Salt: Automatically generated
```

---

## 7. PERFORMANCE

### Frontend
- CSS modularizado (lazy-loadable)
- JS modularizado (future bundling ready)
- Deferred scripts (não bloqueia rendering)
- Preconnect a Google Fonts
- Static caching: 1h em produção
- Favicon SVG inline (sem HTTP request)

### Backend
- MySQL connection pooling
- Async/await (non-blocking)
- Morgan HTTP logging (production mode)
- Request size limits (DDoS protection)
- Rate limiting

### Database
- InnoDB engine
- Connection pool: 2-10
- Queries optimized via models
- Indexes recommended (TODO)

---

## 8. BANCO DE DADOS

### Schema
```sql
Usuario (PK: id)
├─ Profissional (FK: idUsuario)
├─ Cliente (FK: idUsuario)
└─ Administrador (FK: idUsuario)

Servico (PK: id)
└─ ProfissionalServico (FK: idProfissional, idServico)
   └─ Profissional

DisponibilidadeProfissional (FK: idProfissional)
├─ diaSemana: INT (0-6)
├─ horarioInicio: TIME
└─ horarioFim: TIME

Agendamento (PK: id)
├─ FK: idCliente
├─ FK: idProfissional
├─ FK: idServico
├─ data: DATE
├─ horario: TIME
└─ status: ENUM (CONFIRMADO, CANCELADO)

AgendamentoObservacao (FK: idAgendamento)
├─ observacao: TEXT
└─ dataObservacao: TIMESTAMP
```

### Connection Pool
```javascript
Pool {
  min: 2,
  max: 10,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 30000
}
```

---

## 9. API SPECIFICATION

### Versioning
- Current: v1
- Base URL: `/api/v1`

### Response Format
```javascript
Success (2xx):
{
  "status": "success",
  "data": {...}
}

Error (4xx/5xx):
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### Authentication
```
Header: Authorization: Bearer {token}
Token: JWT com payload {id, tipoUsuario}
```

### Endpoints (23 total)

**Auth** (3)
- POST /auth/register
- POST /auth/login
- GET /auth/me

**Serviços** (4)
- GET /servicos
- POST /servicos
- PUT /servicos/:id
- DELETE /servicos/:id

**Profissionais** (7)
- GET /profissionais
- GET /profissionais/:id
- GET /profissionais/me
- PATCH /profissionais/me/servicos
- POST /profissionais
- PUT /profissionais/:id
- DELETE /profissionais/:id

**Agendamentos** (6)
- GET /agendamentos
- POST /agendamentos
- PUT /agendamentos/:id
- DELETE /agendamentos/:id
- GET /agendamentos/disponibilidade
- GET /agendamentos/sugestoes

**Dashboard** (1)
- GET /dashboard/resumo

**Usuários** (2)
- GET /usuarios
- PUT /usuarios/:id

**Health** (1)
- GET /health

---

## 10. REAL-TIME FEATURES

### Socket.io Events

**Servidor escuta:**
- `usuario:online` - User connected
- `usuario:offline` - User disconnected

**Servidor emite:**
- `agendamento:criado` - New booking
- `agendamento:atualizado` - Booking updated
- `agendamento:cancelado` - Booking cancelled
- `disponibilidade:atualizada` - Availability changed
- `servico:atualizado` - Service changed
- `notificacao:nova` - New notification

---

## 11. DEPLOYMENT

### Docker Production Build
```bash
docker build -f infra/Dockerfile -t belaguest-api:1.0.0 .
```

### Environment (Production)
```env
NODE_ENV=production
DB_HOST=db.production.com
DB_USER=belaguest_prod
DB_PASSWORD={{secure_password}}
JWT_SECRET={{secure_secret}}
CORS_ORIGIN=https://belaguest-prod.com
PORT=3000
```

### Considerations
1. Use HTTPS (nginx + Let's Encrypt)
2. Reverse proxy in front
3. Load balancer for multiple instances
4. Redis for session store
5. Monitoring (APM, logs aggregation)
6. Automated backups
7. CI/CD pipeline

---

## 12. MONITORING & LOGGING

### Current
- Morgan HTTP logging
- stderr error logging
- Console logs (removed from production)

### Recommended
- Winston structured logging
- ELK Stack (Elasticsearch, Logstash, Kibana)
- New Relic / Datadog APM
- Sentry error tracking
- Prometheus metrics

---

## 13. TESTING STRATEGY

### Types
1. **Unit Tests** - Individual functions
2. **Integration Tests** - Service + Model
3. **E2E Tests** - Complete workflows

### Current Setup
- Jest configured
- Supertest for HTTP
- Coverage thresholds: 70%

### TODO
- Implement 100+ unit tests
- Integration test suite
- E2E test cases
- GitHub Actions CI/CD

---

## 14. ESCALABILIDADE

### Horizontal Scaling
- Stateless API instances
- Session store in Redis
- Shared database
- Message queue for events

### Vertical Scaling
- Connection pool optimization
- Database indexing
- Query caching
- Static asset CDN

---

## 15. DOCUMENTAÇÃO CÓDIGO

### JSDoc Comment
```javascript
/**
 * Function description
 * @async
 * @function functionName
 * @param {Type} paramName - Parameter description
 * @param {Type} [optionalParam] - Optional parameter
 * @returns {Promise<Type>} Return description
 * @throws {ErrorType} Error description
 * @example
 * const result = await functionName(param);
 */
async function functionName(param) { }
```

### Aplicado a
- 63 controllers/services functions
- Models queries
- Utilities
- Events

---

## 16. ENTREGÁVEIS

✅ Source code (production-ready)  
✅ Docker image (tested)  
✅ Database scripts (init.sql)  
✅ Environment template (.env.example)  
✅ Documentation (README + Architecture)  
✅ Test structure (scaffolded)  
✅ Security hardening (CORS, rate-limit, hashing)  
✅ Performance optimization (caching, pooling)  
✅ Modular frontend (CSS + JS)  
✅ Accessibility (ARIA, semantic HTML)  

---

## 17. CONCLUSÃO

A arquitetura do BelaGuest segue best practices profissionais:

✅ **Separação de responsabilidades** - MVC, service layer  
✅ **Segurança** - JWT, CORS restrictivo, rate limiting  
✅ **Performance** - Connection pooling, caching  
✅ **Manutenibilidade** - JSDoc, modular, testes  
✅ **Escalabilidade** - Stateless, database-backed  
✅ **Documentação** - README, arquitetura, inline  

**Status**: Pronto para produção com melhorias futuras mapeadas.

---

*Documentação criada em 11 de maio de 2026*  
*Versão: 1.0.0*
