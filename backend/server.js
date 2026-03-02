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
        quantity INTEGER NOT NULL,
        initial_quantity INTEGER NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabelas criadas com sucesso!");
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
  const initialStock = {
    "Fraldas P": 5,
    "Fraldas M": 13,
    "Fraldas G": 17,
    "Fraldas GG": 25,
    "Pacote Fralda de Pano": 3,
    "Cobertor de Berço": 2,
    "Manta Micro Fibra": 2,
    "Jogo de Lençol de Berço": 2,
    "Móbile Safári": 1,
    "Travesseiro Respirável": 2,
    "Ninho Redutor": 1,
    "Kit Abajur": 1,
    "Manta de Passeio": 2,
    Babador: 3,
    "Bodies Manga Curta P": 4,
    "Bodies Manga Longa P": 4,
    "Bodies Manga Curta M": 4,
    "Bodies Manga Longa M": 4,
    Cueiro: 3,
    "Kit Mijões c/3 RN": 2,
    "Kit Mijões c/3 P": 2,
    "Macacões RN": 4,
    "Macacões P": 4,
    "Kit c/3 Pares de Luva": 1,
    "Kit c/3 Pares de Meia": 2,
    "Saída da Maternidade": 1,
    "Toalha com Capuz": 2,
    "Toalha de Fralda": 2,
    "Aspirador Nasal": 1,
    "Kit de Mamadeira": 1,
    "Kit Plástico s/Banheira": 1,
    "Kit Manicure p/Bebê": 1,
    "Kit Escova e Pente": 1,
    "Lenço Umedecido": 3,
    "Sabonete Líquido": 5,
    "Pomada Bepantol Baby": 5,
    Talco: 2,
  };

  try {
    for (const [itemName, quantity] of Object.entries(initialStock)) {
      await pool.query(
        "INSERT INTO item_stock (item_name, quantity, initial_quantity) VALUES ($1, $2, $3) ON CONFLICT (item_name) DO UPDATE SET quantity = $2, initial_quantity = $3",
        [itemName, quantity, quantity]
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

    res.json({
      success: true,
      data: {
        total_registros: parseInt(totalRecords.rows[0].count),
        total_presentes: parseInt(presentes.rows[0].count),
        total_ausentes: parseInt(ausentes.rows[0].count),
      },
    });
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
