# 🚀 Backend - Chá de Fraldas

## Sobre

Backend Node.js + Express para gerenciar registros e estoque do sistema de Chá de Fraldas.

## Requisitos

- Node.js 14+
- npm ou yarn
- PostgreSQL (já configurado)

## Instalação

```bash
cd backend
npm install
```

## Configuração

O arquivo `.env` já está configurado com sua credencial PostgreSQL:

```
DATABASE_URL=postgres://chafrauda:Ideal2015net@easypanel.ronnysenna.com.br:5420/chafrauda?sslmode=disable
PORT=3000
NODE_ENV=development
```

## Rodar Localmente

```bash
npm start
```

Ou com nodemon (auto-reload):

```bash
npm run dev
```

O servidor vai estar rodando em: **http://localhost:3000**

## Rotas da API

### Registros
- `GET /api/records` - Obter todos os registros
- `POST /api/records` - Criar novo registro
- `DELETE /api/records/:id` - Deletar um registro

### Estoque
- `GET /api/stock` - Obter estoque atual
- `POST /api/stock/initialize` - Inicializar estoque
- `POST /api/stock/reduce` - Reduzir quantidade de um item
- `POST /api/stock/increase` - Aumentar quantidade de um item

### Estatísticas
- `GET /api/stats` - Obter estatísticas

## Estrutura do Banco de Dados

### Tabela: attendance_records
```sql
id (SERIAL PRIMARY KEY)
nome (VARCHAR 255)
presenca (VARCHAR 10) - 'Sim' ou 'Não'
itens (TEXT) - Items separados por vírgula
observacoes (TEXT)
data_registro (TIMESTAMP) - Automático
```

### Tabela: item_stock
```sql
id (SERIAL PRIMARY KEY)
item_name (VARCHAR 255) - UNIQUE
quantity (INTEGER)
initial_quantity (INTEGER)
last_updated (TIMESTAMP) - Automático
```

## Deployment (Produção)

### Em Easypanel/VPS

1. Fazer upload dos arquivos para seu servidor
2. Instalar Node.js no servidor
3. Configurar variáveis de ambiente (`.env`)
4. Usar PM2 para manter o processo rodando:

```bash
npm install -g pm2
pm2 start server.js --name "cha-frauda-api"
pm2 startup
pm2 save
```

5. Configurar Nginx como reverse proxy (opcional, para melhor performance)

## CORS

O backend permite requisições de qualquer origem (CORS habilitado globalmente). Em produção, considere restringir:

```javascript
app.use(cors({
  origin: 'https://seudominio.com.br'
}));
```

## Variáveis de Ambiente

Criar arquivo `.env`:
```
DATABASE_URL=seu_postgres_url
PORT=3000
NODE_ENV=production
```

## Troubleshooting

### Erro: "Não consegue conectar ao PostgreSQL"
- Verificar se a URL está correta
- Testar conexão com `psql` diretamente
- Verificar firewall/porta 5420

### Erro: "CORS bloqueado"
- Certificar que `script-api.js` está usando o URL correto
- Verificar se o backend está rodando

### Tabelas não criadas
- Executar `POST /api/stock/initialize` uma vez via Postman/curl

## Debug

Ativar logs detalhados adicionando console.log em `server.js`.

## Suporte

Para problemas, verificar logs do servidor ou console do navegador.
