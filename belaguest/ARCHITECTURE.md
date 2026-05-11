# ARQUITETURA TÉCNICA - BelaGuest

## 1. VISÃO GERAL DA ARQUITETURA

BelaGuest segue uma **arquitetura em camadas (MVC)** com separação de responsabilidades clara:

```
REQUEST -> MIDDLEWARE -> ROUTES -> CONTROLLERS -> SERVICES -> MODELS -> DATABASE
         ^-- Auth, Validation, Error Handling, CORS, Rate Limit --^
```

### Fluxo de uma Requisição

1. **Middleware CORS** - Valida origem
2. **Rate Limiter** - Previne abuso
3. **Body Parser** - Converte JSON
4. **Request Logger** - Registra requisição (Morgan)
5. **Routes** - Mapeia para controller
6. **Auth Middleware** - Valida JWT (se necessário)
7. **Role Middleware** - Valida permissão (se necessário)
8. **Validate Request** - Valida dados de entrada
9. **Controller** - Orquestra a lógica
10. **Services** - Executa regras de negócio
11. **Models** - Acessa banco de dados
12. **Response** - Retorna resultado
13. **Error Handler** - Captura erros em qualquer etapa

---

## 2. PADRÕES E PRINCÍPIOS

### 2.1 Princípios SOLID

- **S**ingle Responsibility: Cada função tem uma responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov: Subclasses podem substituir classes base
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Depende de abstrações, não implementações

### 2.2 Design Patterns Utilizados

| Pattern | Onde | Por quê |
|---------|------|--------|
| MVC | Arquitetura geral | Separação de responsabilidades |
| Repository | Models | Abstração de acesso a dados |
| Service Locator | Controllers | Acesso a dependências |
| Middleware Chain | Express | Processamento em pipeline |
| Error Handler | Middleware | Tratamento centralizado de erros |
| DTO (Data Transfer Object) | Controllers/APIs | Segurança e validação |
| Factory | Models | Criação de instâncias |

### 2.3 Boas Práticas

```javascript
// BOM: Função pura e testável
async function calculateScheduelAvailability(date, serviceDuraton) {
  const booked = await agendamentoModel.findByDate(date);
  const slots = generateTimeSlots(date, serviceDuration);
  return slots.filter(slot => !isBooked(slot, booked));
}

// RUIM: Lógica misturada, side effects, não testável
async function getAvailability(req, res) {
  try {
    const data = format(new Date(req.body.date), 'yyyy-MM-dd');
    const db = require('./database');
    const result = await db.query(`SELECT * FROM schedules WHERE data = '${data}'`);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
```

---

## 3. ESTRUTURA DE DIRETÓRIOS E RESPONSABILIDADES

### 3.1 Raiz do Projeto

```
belaguest/
├── src/                    # Código-fonte
├── infra/                  # Infraestrutura (Docker)
├── database/               # Scripts SQL
├── public/                 # Arquivos estáticos
├── __tests__/              # Testes automatizados
├── .env.example            # Template de ambiente
├── .gitignore              # Arquivo Git ignore
├── jest.config.js          # Configuração de testes
├── package.json            # Dependências Node.js
└── README.md               # Este arquivo
```

### 3.2 Dentro de `/src`

```
src/
├── app.js                  # Configuração Express (middlewares, rotas)
├── server.js               # Inicialização do servidor HTTP
│
├── api/                    # Lógica de aplicação
│   ├── controllers/        # Orquestração HTTP
│   ├── services/           # Lógica de negócio
│   ├── models/             # Acesso a dados
│   ├── routes/             # Definição de endpoints
│   └── validators/         # Regras de validação
│
├── config/                 # Configuração centralizada
│   ├── env.js              # Variáveis de ambiente
│   ├── database.js         # Pool de conexões MySQL
│   └── socket.js           # Configuração WebSocket
│
└── middlewares/            # Tratamento de requisições
    ├── auth-middleware.js  # Valida JWT
    ├── role-middleware.js  # Valida permissão
    ├── error-handler.js    # Captura erros
    └── validate-request.js # Executa validações
```

### 3.3 Controllers - Responsabilidades

```javascript
/**
 * Controller: apenas RECEBE requisição e ORQUESTRA resposta
 * - Nunca contém lógica de negócio
 * - Nunca faz queries diretas ao BD
 * - Sempre delega para service
 * - Sempre trata erros enviando para next()
 */
async function createAgendamento(req, res, next) {
  try {
    // 1. Dados vêm tratados/validados pelo middleware
    // 2. Delega para service
    const result = await agendamentoService.create(req.body);
    // 3. Retorna resposta
    return res.status(201).json(result);
  } catch (error) {
    // 4. Envia para middleware de erro
    return next(error);
  }
}
```

### 3.4 Services - Responsabilidades

```javascript
/**
 * Service: contém TODA lógica de negócio
 * - Valida regras de negócio
 * - Orquestra múltiplas models
 * - Transforma dados (DTOs)
 * - Lança erros específicos
 * - ES6+, sem this, arrow functions
 */
async function create(agendamento) {
  // Validação de negócio
  if (!await isProfissionalAvailable(agendamento.profissionalId)) {
    throw new HttpError('Profissional não disponível', 409);
  }

  // Orquestração de múltiplas models
  const created = await agendamentoModel.insert(agendamento);
  await agendamentoObservacaoModel.insert({
    agendamentoId: created.id,
    descricao: 'Agendamento criado'
  });

  // Retorna DTO (sem dados sensíveis)
  return sanitizeAgendamento(created);
}
```

### 3.5 Models - Responsabilidades

```javascript
/**
 * Model: APENAS acesso ao banco de dados
 * - Execute queries SQL
 * - Retorne dados brutos
 * - Sem lógica de negócio
 * - Sem transformações
 * - Funções SQL-focused
 */
async function insert(agendamento) {
  const [result] = await db.query(
    'INSERT INTO agendamento (profissionalId, servicoId, dataHora) VALUES (?, ?, ?)',
    [agendamento.profissionalId, agendamento.servicoId, agendamento.dataHora]
  );
  return { id: result.insertId, ...agendamento };
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM agendamento WHERE id = ?', [id]);
  return rows[0] || null;
}
```

---

## 4. SEGURANÇA

### 4.1 Camadas de Segurança Implementadas

1. **Rate Limiting** - Previne força bruta
   - Auth endpoints: max 5 requisições/15min
   - API endpoints: max 100 requisições/15min

2. **CORS Configurável** - Apenas origens conhecidas
   - Production: especificar domínios
   - Development: permite localhost

3. **Headers HTTP Seguros**
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: enabled
   - Strict-Transport-Security: max-age 1 ano
   - Content-Security-Policy: restritiva

4. **JWT (JSON Web Tokens)**
   - Secret seguro (mín 16 chars)
   - Expiration (default 1d)
   - Refresh tokens (não implementado - TODO)

5. **Autenticação**
   - Senhas com bcryptjs (salt rounds: 10)
   - Nunca armazenar senha em plaintext
   - Sempre validar antes de usar

6. **Autorização (RBAC)**
   - 3 papéis: CLIENTE, PROFISSIONAL, ADMINISTRADOR
   - Middleware valida antes de executar
   - Cada endpoint documenta requisito

7. **Validação de Entrada**
   - express-validator com regras customizadas
   - Type checking em models
   - Sanitização de dados

8. **Proteção de Dados**
   - Limit tamanho de requisição: 10kb JSON
   - Sem dados sensíveis em logs
   - .env no .gitignore

### 4.2 Checklist de Deploy

```bash
# Segurança ANTES de fazer deploy
- [ ] JWT_SECRET alterado para valor seguro (mín 32 chars)
- [ ] NODE_ENV=production
- [ ] CORS_ORIGIN definido para domínios reais (não *)
- [ ] DB_PASSWORD segura e diferente de padrão
- [ ] HTTPS ativado (nginx + Let's Encrypt)
- [ ] .env arquivo não commitado
- [ ] Logs redirecionados e rotacionados
- [ ] Rate limiting ativo
- [ ] Backups automáticos configurados
- [ ] Monitoramento ativo
```

---

## 5. PADRÕES DE CÓDIGO

### 5.1 Nomenclatura

```javascript
// Diretorios: lowercase
/src/api/controllers
/src/middlewares

// Arquivos: kebab-case
auth-controller.js
user-service.js
database-config.js

// Funções: camelCase
async function getUserById(userId) { }
const calculateDiscount = (price) => price * 0.9;

// Classes: PascalCase
class HttpError extends Error { }
const UserService = { };

// Constantes: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;
const JWT_EXPIRATION_MS = 86400000;

// Booleanos: is*, has*, can*, should*
const isAdmin = user.tipoUsuario === 'ADMINISTRADOR';
const hasPermission = permissions.includes('DELETE_USER');
const canSchedule = availability.length > 0;
```

### 5.2 JavaScript Modern (ES6+)

```javascript
// SEMPRE use
const/let (nunca var)
Arrow functions para callbacks
Template literals para strings
Destructuring para objetos/arrays
Async/await (nunca .then())
Optional chaining (?.)
Nullish coalescing (??)

// EXEMPLO
const { email, senha } = req.body;
const user = await userModel.findByEmail(email);
const hashedPassword = await bcrypt.hash(senha, 10);

const tipoUsuario = user?.tipoUsuario ?? 'CLIENTE';
if (!hashedPassword || !user?.id) return null;

// Map/Filter/Reduce ao invés de for loops
const adminUsers = users.filter(u => u.tipoUsuario === 'ADMIN');
const userIds = users.map(u => u.id);
const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
```

### 5.3 Async/Await Correto

```javascript
// BOM
async function findUser(email) {
  try {
    const db = getConnection();
    const user = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    return user?.[0] || null;
  } catch (error) {
    logger.error(`Erro ao buscar usuário ${email}`, error);
    throw new HttpError('Erro ao buscar usuário', 500);
  }
}

// RUIM - Promise hell
function findUser(email) {
  return getConnection()
    .then(db => db.query('SELECT * FROM user WHERE email = ?', [email]))
    .then(user => user?.[0] || null)
    .catch(error => console.log(error)); // Silencia erros!
}

// RUIM - Parallel execution incorrect
async function getCompleteUser(userId) {
  const user = await userModel.findById(userId);
  const posts = await postModel.findByUserId(userId);
  const followers = await followerModel.findByUserId(userId);
}

// BOM - Parallel execution
async function getCompleteUser(userId) {
  const [user, posts, followers] = await Promise.all([
    userModel.findById(userId),
    postModel.findByUserId(userId),
    followerModel.findByUserId(userId)
  ]);
}
```

---

## 6. TESTES

### 6.1 Estrutura de Testes

```
__tests__/
├── setup.js                         # Configuração global
├── api/
│   ├── services/
│   │   └── auth-service.test.js    # Testes unitários
│   ├── controllers/
│   │   └── auth-controller.test.js # Testes de integração
│   └── routes/
│       └── auth-routes.test.js     # Testes E2E
└── fixtures/
    └── sample-data.js              # Dados de teste
```

### 6.2 Exemplo de Teste

```javascript
// auth-service.test.js
const authService = require('../../../src/api/services/auth-service');
const userModel = require('../../../src/api/models/user-model');

jest.mock('../../../src/api/models/user-model');

describe('AuthService.register', () => {
  beforeEach(() => jest.clearAllMocks());

  test('deve registrar novo usuário com dados válidos', async () => {
    const userData = {
      nome: 'Test User',
      email: 'test@example.com',
      senha: 'SecurePass123'
    };

    userModel.findUserByEmail.mockResolvedValue(null);
    userModel.insert.mockResolvedValue({ id: 1, ...userData });

    const result = await authService.register(userData);

    expect(result).toHaveProperty('id');
    expect(result.email).toBe(userData.email);
    expect(userModel.insert).toHaveBeenCalled();
  });

  test('deve rejeitar email já cadastrado', async () => {
    userModel.findUserByEmail.mockResolvedValue({ id: 1 });

    await expect(
      authService.register({ email: 'existing@example.com' })
    ).rejects.toThrow('Email já cadastrado');
  });
});
```

---

## 7. PERFORMANCE

### 7.1 Otimizações Implementadas

1. **Connection Pool** - Reutiliza conexões DB
   - Máximo 10 conexões simultâneas
   - Timeout 30 segundos

2. **Query Optimization**
   - Índices em campos frequentemente buscados
   - Evita N+1 queries
   - Limit de resultados

3. **Caching** - TODO
   - Redis para sessões
   - Cache de serviços frequentes

4. **Async/Await**
   - Parallel requests com Promise.all()
   - Não bloqueia event loop

### 7.2 Monitoramento

```javascript
// Ferramentas recomendadas
- PM2: Process manager e monitoramento
- New Relic: APM (Application Performance Monitoring)
- Sentry: Error tracking
- DataDog: Logging centralizado
- Prometheus: Métricas
```

---

## 8. LOGGING

### 8.1 Estratégia

```javascript
// Produção: JSON estruturado
{
  "timestamp": "2026-05-11T10:30:00Z",
  "level": "error",
  "message": "Database connection failed",
  "userId": 123,
  "path": "/api/v1/agendamentos",
  "statusCode": 500,
  "error": { "code": "ECONNREFUSED" }
}

// Desenvolvimento: formato legível (Morgan)
POST /api/v1/auth/login 200 2.5ms - 156B
GET /api/v1/agendamentos 200 15ms - 2.3kb
```

### 8.2 Boas Práticas

```javascript
// Log importante: entrada/saída de funções críticas
logger.info('Payment processed', { orderId, amount, status });

// Log de erro: sempre incluir stack trace
logger.error('Failed to create order', error, { userId, orderId });

// Nunca log: senhas, tokens, dados sensíveis
// RUIM: logger.info('User login', { email, senha, token });
// BOM:  logger.info('User login', { email, tipoUsuario });
```

---

## 9. TRATAMENTO DE ERROS

### 9.1 Error Hierarchy

```javascript
// Base class
class HttpError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Tipos específicos
class ValidationError extends HttpError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends HttpError {
  constructor(message) {
    super(message, 404);
  }
}

class UnauthorizedError extends HttpError {
  constructor(message) {
    super(message, 401);
  }
}

class ForbiddenError extends HttpError {
  constructor(message) {
    super(message, 403);
  }
}
```

### 9.2 Global Error Handler

```javascript
// Captura TODOS os erros
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const isDevelopment = env.NODE_ENV === 'development';

  logger.error('Unhandled error', error, {
    path: req.path,
    method: req.method
  });

  return res.status(statusCode).json({
    error: {
      message: error.message,
      status: statusCode,
      timestamp: new Date().toISOString(),
      ...(isDevelopment && { stack: error.stack })
    }
  });
});
```

---

## 10. PRÓXIMOS PASSOS - DÉBITOS TÉCNICOS

### Melhorias Futuras (Priority Ordem)

1. **Tests Coverage** - Adicionar testes E2E
2. **Refresh Tokens** - Implementar refresh token para melhor segurança
3. **Redis Caching** - Cache distribuído
4. **Email Service** - Integração com SendGrid/Mailgun
5. **Logging Centralizado** - Sentry/DataDog
6. **OpenAPI/Swagger** - Documentação automática
7. **GraphQL** - Alternative a REST
8. **Message Queue** - RabbitMQ/Bull para background jobs
9. **Audit Logs** - Rastreamento de ações
10. **CI/CD Pipeline** - GitHub Actions/GitLab CI

---

**Última atualização**: Maio 2026  
**Versão**: 1.0.0  
**Status**: Production Ready
