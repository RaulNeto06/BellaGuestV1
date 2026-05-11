# ⚡ QUICK START - BelaGuest Produção

## 🎯 5 Minutos para Rodar em Produção

### 1️⃣ Clonar/Acessar
```bash
cd /workspaces/BellaGuestV1/belaguest
```

### 2️⃣ Docker (Recomendado)
```bash
docker-compose -f infra/docker-compose.yml up -d
```
✅ API em: `http://localhost:3000`  
✅ MySQL: Automático (container)

### 3️⃣ Node.js Direto (Se não tiver Docker)
```bash
npm install --production
npm start
```
✅ API em: `http://localhost:3000`

---

## 📡 Primeiro Teste

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Login de teste
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@belaguest.com",
    "senha": "123456"
  }'
```

---

## 🛑 Parar Servidores

```bash
# Docker
docker-compose -f infra/docker-compose.yml down

# Node.js
Ctrl + C
```

---

## 📋 Variáveis de Ambiente

Copie `.env.example` para `.env` (Git vai ignorar automaticamente):

```bash
cp .env.example .env
# Edite com suas credentials reais
nano .env
```

---

## 🔍 Verificar Status

```bash
# Docker
docker ps
docker logs <container_id>

# Node.js (npm start)
# Logs aparecem no terminal

# Conectar ao MySQL (com docker)
docker exec -it <mysql_container_id> mysql -u belaguest_user -p
```

---

## 📊 Stack Produção

✅ **Node.js** - v24 (versão LTS)  
✅ **Express** - 4.21.0 API Framework  
✅ **MySQL** - 8.0 Banco de dados  
✅ **JWT** - Autenticação segura  
✅ **Socket.io** - WebSockets real-time  
✅ **Docker** - Containerização  

---

## 📚 Docs Completos

- **API Endpoints:** Ver [README.md](./README.md)
- **Estrutura Código:** Ver [README.md](./README.md)
- **Cleanup Details:** Ver [PRODUCTION_CLEANUP_REPORT.md](../PRODUCTION_CLEANUP_REPORT.md)
- **Full Checklist:** Ver [PRODUCTION_READY.md](../PRODUCTION_READY.md)

---

## ⚠️ Troubleshooting

### "Port 3000 já em uso"
```bash
lsof -i :3000
kill -9 <PID>
```

### "Erro de conexão MySQL"
```bash
# Com Docker
docker-compose -f infra/docker-compose.yml restart mysql

# Manual - verificar .env
cat .env | grep DB_
```

### "Dependencies not found"
```bash
rm -rf node_modules package-lock.json
npm install --production
```

---

## 🚀 Deploy Cloud (AWS/Azure/GCP)

```bash
# 1. Build imagem
docker build -f infra/Dockerfile -t belaguest-api:1.0.0 .

# 2. Push para registry
docker tag belaguest-api:1.0.0 YOUR_REGISTRY/belaguest-api:1.0.0
docker push YOUR_REGISTRY/belaguest-api:1.0.0

# 3. Deploy (exemplo AWS ECS/EC2, Azure Container Instances, etc)
# Usar docker-compose.yml ou kubernetes manifests
```

---

**Pronto para produção! 🎉**
