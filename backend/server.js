require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Pool de conexão com PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Testar conexão
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
  } else {
    console.log("✅ Conectado ao PostgreSQL!", res.rows[0]);
  }
});

// ===== CRIAR TABELAS SE NÃO EXISTIREM =====
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        presenca VARCHAR(10) NOT NULL,
        itens TEXT,
        observacoes TEXT,
        data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS item_stock (
        id SERIAL PRIMARY KEY,
        item_name VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(50),
        quantity INTEGER NOT NULL,
        initial_quantity INTEGER NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migração para adicionar coluna category se não existir (para bancos já criados)
    await pool.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='item_stock' AND column_name='category') THEN
              ALTER TABLE item_stock ADD COLUMN category VARCHAR(50);
          END IF;
      END
      $$;
    `);

    console.log("✅ Tabelas criadas/atualizadas com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao criar tabelas:", err);
  }
}

initializeDatabase();

// ===== ROTAS =====

// 1️⃣ GET - Obter todos os registros
app.get("/api/records", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM attendance_records ORDER BY data_registro DESC"
    );

    // Garantir que `itens` seja um array ao enviar ao cliente
    const rows = result.rows.map((r) => {
      try {
        if (typeof r.itens === "string") {
          return { ...r, itens: JSON.parse(r.itens) };
        }
      } catch (e) {
        // não conseguiu parsear, mantém como string
      }
      return r;
    });

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2️⃣ POST - Criar novo registro
app.post("/api/records", async (req, res) => {
  const { nome, presenca, itens, observacoes } = req.body;

  try {
    // armazenar itens como JSON string para compatibilidade
    const itensToStore = JSON.stringify(itens || []);

    const result = await pool.query(
      "INSERT INTO attendance_records (nome, presenca, itens, observacoes) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, presenca, itensToStore, observacoes]
    );

    const inserted = result.rows[0];
    try {
      if (typeof inserted.itens === "string")
        inserted.itens = JSON.parse(inserted.itens);
    } catch (e) {}

    res.json({ success: true, data: inserted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3️⃣ DELETE - Deletar um registro
app.delete("/api/records/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM attendance_records WHERE id = $1", [id]);
    res.json({ success: true, message: "Registro deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4️⃣ GET - Obter estoque de itens
app.get("/api/stock", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM item_stock");
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5️⃣ POST - Inicializar estoque (executar uma vez)
app.post("/api/stock/initialize", async (req, res) => {
  const stockItems = [
    // Fraldas
    { name: "Fraldas P", category: "fraldas", qty: 5 },
    { name: "Fraldas M", category: "fraldas", qty: 13 },
    { name: "Fraldas G", category: "fraldas", qty: 17 },
    { name: "Fraldas GG", category: "fraldas", qty: 25 },
    { name: "Pacote Fralda de Pano", category: "fraldas", qty: 3 },
    // Berço
    { name: "Cobertor de Berço", category: "berco", qty: 2 },
    { name: "Manta Micro Fibra", category: "berco", qty: 2 },
    { name: "Jogo de Lençol de Berço", category: "berco", qty: 2 },
    { name: "Móbile Safári", category: "berco", qty: 1 },
    { name: "Travesseiro Respirável", category: "berco", qty: 2 },
    { name: "Ninho Redutor", category: "berco", qty: 1 },
    { name: "Kit Abajur", category: "berco", qty: 1 },
    { name: "Manta de Passeio", category: "berco", qty: 2 },
    // Roupas
    { name: "Babador", category: "roupas", qty: 3 },
    { name: "Bodies Manga Curta P", category: "roupas", qty: 4 },
    { name: "Bodies Manga Longa P", category: "roupas", qty: 4 },
    { name: "Bodies Manga Curta M", category: "roupas", qty: 4 },
    { name: "Bodies Manga Longa M", category: "roupas", qty: 4 },
    { name: "Cueiro", category: "roupas", qty: 3 },
    { name: "Kit Mijões c/3 RN", category: "roupas", qty: 2 },
    { name: "Kit Mijões c/3 P", category: "roupas", qty: 2 },
    { name: "Macacões RN", category: "roupas", qty: 4 },
    { name: "Macacões P", category: "roupas", qty: 4 },
    { name: "Kit c/3 Pares de Luva", category: "roupas", qty: 1 },
    { name: "Kit c/3 Pares de Meia", category: "roupas", qty: 2 },
    { name: "Saída da Maternidade", category: "roupas", qty: 1 },
    // Higiene
    { name: "Toalha com Capuz", category: "higiene", qty: 2 },
    { name: "Toalha de Fralda", category: "higiene", qty: 2 },
    { name: "Aspirador Nasal", category: "higiene", qty: 1 },
    { name: "Kit de Mamadeira", category: "higiene", qty: 1 },
    { name: "Kit Plástico s/Banheira", category: "higiene", qty: 1 },
    { name: "Kit Manicure p/Bebê", category: "higiene", qty: 1 },
    { name: "Kit Escova e Pente", category: "higiene", qty: 1 },
    { name: "Lenço Umedecido", category: "higiene", qty: 3 },
    { name: "Sabonete Líquido", category: "higiene", qty: 5 },
    { name: "Pomada Bepantol Baby", category: "higiene", qty: 5 },
    { name: "Talco", category: "higiene", qty: 2 },
  ];

  try {
    for (const item of stockItems) {
      await pool.query(
        "INSERT INTO item_stock (item_name, category, quantity, initial_quantity) VALUES ($1, $2, $3, $4) ON CONFLICT (item_name) DO UPDATE SET quantity = $3, initial_quantity = $4, category = $2",
        [item.name, item.category, item.qty, item.qty]
      );
    }
    res.json({ success: true, message: "Estoque inicializado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6️⃣ POST - Reduzir quantidade de um item
app.post("/api/stock/reduce", async (req, res) => {
  const { item_name, quantidade = 1 } = req.body;

  try {
    const result = await pool.query(
      "UPDATE item_stock SET quantity = GREATEST(quantity - $1, 0), last_updated = CURRENT_TIMESTAMP WHERE item_name = $2 RETURNING *",
      [quantidade, item_name]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Item não encontrado" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7️⃣ POST - Aumentar quantidade de um item
app.post("/api/stock/increase", async (req, res) => {
  const { item_name, quantidade = 1 } = req.body;

  try {
    const result = await pool.query(
      "UPDATE item_stock SET quantity = quantity + $1, last_updated = CURRENT_TIMESTAMP WHERE item_name = $2 RETURNING *",
      [quantidade, item_name]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Item não encontrado" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8️⃣ GET - Estatísticas
app.get("/api/stats", async (req, res) => {
  try {
    const totalRecords = await pool.query(
      "SELECT COUNT(*) FROM attendance_records"
    );
    const presentes = await pool.query(
      "SELECT COUNT(*) FROM attendance_records WHERE LOWER(presenca) = 'sim'"
    );
    const ausentes = await pool.query(
      "SELECT COUNT(*) FROM attendance_records WHERE LOWER(presenca) = 'nao'"
    );

    // Calcular itens selecionados
    const allRecords = await pool.query("SELECT itens FROM attendance_records");
    const itensSelecionados = {};

    allRecords.rows.forEach((row) => {
      let itens = [];
      try {
        if (typeof row.itens === "string") {
          itens = JSON.parse(row.itens);
        } else if (Array.isArray(row.itens)) {
          itens = row.itens;
        }
      } catch (e) {
        itens = [];
      }

      if (Array.isArray(itens)) {
        itens.forEach((item) => {
          itensSelecionados[item] = (itensSelecionados[item] || 0) + 1;
        });
      }
    });

    res.json({
      success: true,
      data: {
        total_registros: parseInt(totalRecords.rows[0].count),
        confirmados: parseInt(presentes.rows[0].count),
        ausentes: parseInt(ausentes.rows[0].count),
        itens_selecionados: itensSelecionados,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9️⃣ PUT - Atualizar estoque (quantidade manual)
app.put("/api/stock/:itemName", async (req, res) => {
  const { itemName } = req.params;
  const { quantity } = req.body;

  try {
    const result = await pool.query(
      "UPDATE item_stock SET quantity = $1, last_updated = CURRENT_TIMESTAMP WHERE item_name = $2 RETURNING *",
      [quantity, itemName]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Item não encontrado" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Banco de dados: ${process.env.DATABASE_URL}`);
});
