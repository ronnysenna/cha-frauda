// ===== CONFIGURAÇÃO DA API =====
// Detecta URL automaticamente baseado no ambiente
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : `${window.location.protocol}//${window.location.host}/api`;

console.log("🔗 API URL:", API_URL);

// ===== SISTEMA DE ESTOQUE DINÂMICO =====

async function loadStock() {
  try {
    const response = await fetch(`${API_URL}/stock`);
    const result = await response.json();

    if (result.success && result.data && result.data.length > 0) {
      updateStockDisplay(result.data);
    } else {
      console.log("📊 Estoque vazio, inicializando...");
      await initializeStock();
    }
  } catch (err) {
    console.error("❌ Erro ao carregar estoque:", err);
    showAlert("⚠️ Usando dados do navegador (offline)");
  }
}

async function initializeStock() {
  try {
    const response = await fetch(`${API_URL}/stock/initialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();

    if (result.success) {
      console.log("✅ Estoque inicializado");
      await loadStock();
    }
  } catch (err) {
    console.error("❌ Erro ao inicializar:", err);
  }
}

function updateStockDisplay(stockData) {
  const stockMap = {};
  stockData.forEach((item) => {
    stockMap[item.item_name] = item.quantity;
  });

  document.querySelectorAll(".item-quantity").forEach((el) => {
    const itemName = el.getAttribute("data-item");
    const quantity = stockMap[itemName] || 0;
    el.textContent = quantity;

    if (quantity === 0) {
      el.style.backgroundColor = "#ff6b6b";
      el.style.color = "white";
    } else if (quantity <= 2) {
      el.style.backgroundColor = "#ffa500";
      el.style.color = "white";
    } else {
      el.style.backgroundColor = "#1e90ff";
      el.style.color = "white";
    }
  });
}

async function reduceStock(itemName) {
  try {
    const response = await fetch(`${API_URL}/stock/reduce`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_name: itemName, quantidade: 1 }),
    });

    if (response.ok) {
      console.log(`✅ ${itemName} reduzido`);
      await loadStock();
    }
  } catch (err) {
    console.error("❌ Erro ao reduzir:", err);
  }
}

async function increaseStock(itemName) {
  try {
    const response = await fetch(`${API_URL}/stock/increase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_name: itemName, quantidade: 1 }),
    });

    if (response.ok) {
      console.log(`✅ ${itemName} aumentado`);
      await loadStock();
    }
  } catch (err) {
    console.error("❌ Erro ao aumentar:", err);
  }
}

// ===== EVENT LISTENERS PARA CHECKBOXES =====
function setupCheckboxListeners() {
  document
    .querySelectorAll('input[type="checkbox"][data-item]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", async function () {
        const itemName = this.getAttribute("data-item");

        if (this.checked) {
          await reduceStock(itemName);
        } else {
          await increaseStock(itemName);
        }
      });
    });
}

// ===== ENVIO DO FORMULÁRIO =====
async function submitForm(event) {
  event.preventDefault();

  const nome = document.getElementById("name").value.trim();
  if (!nome) {
    showAlert("❌ Digite seu nome!");
    return;
  }

  const presenca = document.querySelector(
    'input[name="presenca"]:checked'
  )?.value;
  if (!presenca) {
    showAlert("❌ Selecione se vai comparecer!");
    return;
  }

  const itensCheckboxes = document.querySelectorAll(
    'input[name="itens"]:checked'
  );
  if (itensCheckboxes.length === 0 && presenca === "Sim") {
    showAlert("❌ Selecione pelo menos um item para levar!");
    return;
  }

  const itens = Array.from(itensCheckboxes)
    .map((cb) => cb.getAttribute("data-item"))
    .join(", ");

  const observacoes =
    document.getElementById("observations")?.value.trim() || "Nenhuma";

  const data = {
    nome,
    presenca,
    itens: presenca === "Sim" ? itens : "Nenhum",
    observacoes,
  };

  try {
    const response = await fetch(`${API_URL}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      saveToLocalStorage(data);
      showSuccessMessage({
        ...data,
        data_registro: new Date().toLocaleString("pt-BR"),
      });

      setTimeout(() => {
        resetForm();
      }, 2500);
    } else {
      showAlert("❌ Erro: " + (result.error || "Desconhecido"));
    }
  } catch (err) {
    console.error("Erro ao enviar:", err);
    showAlert("❌ Erro: " + err.message);
  }
}

// ===== UTILITÁRIOS =====
function saveToLocalStorage(data) {
  const registros = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
  registros.push({
    ...data,
    data_registro: new Date().toLocaleString("pt-BR"),
  });
  localStorage.setItem("attendanceRecords", JSON.stringify(registros));
}

function showSuccessMessage(data) {
  const successDiv = document.getElementById("successMessage");
  const detailsDiv = document.getElementById("successDetails");

  let detailsHTML = `<strong>${data.nome}</strong><br>Presença: ${data.presenca}<br>`;
  if (data.presenca === "Sim") {
    detailsHTML += `Itens: ${data.itens}<br>`;
  }
  if (data.observacoes !== "Nenhuma") {
    detailsHTML += `Observações: ${data.observacoes}<br>`;
  }

  detailsDiv.innerHTML = detailsHTML;
  successDiv?.classList.remove("hidden");

  createConfetti();

  setTimeout(() => {
    successDiv?.classList.add("hidden");
  }, 5000);
}

function createConfetti() {
  const confettiDiv = document.querySelector(".confetti");
  if (!confettiDiv) return;

  for (let i = 0; i < 30; i++) {
    const confetto = document.createElement("div");
    confetto.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background-color: ${
        ["#ff69b4", "#87ceeb", "#ffd700", "#ff1493"][
          Math.floor(Math.random() * 4)
        ]
      };
      border-radius: 50%;
      animation: confettiFall ${1.5 + Math.random()}s ease-in forwards;
    `;
    confettiDiv.appendChild(confetto);

    setTimeout(() => confetto.remove(), 2500);
  }
}

function resetForm() {
  document.getElementById("attendanceForm")?.reset();
  document.getElementById("successMessage")?.classList.add("hidden");
  document.getElementById("name")?.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showAlert(message) {
  const alertDiv = document.createElement("div");
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ff6b6b;
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
    z-index: 1000;
    max-width: 90%;
    animation: slideDown 0.3s ease-out;
    font-weight: 500;
  `;
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}

// ===== FUNÇÕES DE ADMIN =====
async function visualizarRegistros() {
  try {
    const response = await fetch(`${API_URL}/records`);
    const result = await response.json();
    console.table(result.data);
    return result.data;
  } catch (err) {
    console.error("Erro:", err);
  }
}

async function exportarCSV() {
  try {
    const response = await fetch(`${API_URL}/records`);
    const result = await response.json();
    const registros = result.data || [];

    if (registros.length === 0) {
      showAlert("Nenhum registro para exportar!");
      return;
    }

    let csv = "Nome,Presença,Itens,Observações,Data\n";
    registros.forEach((r) => {
      csv += `"${r.nome}","${r.presenca}","${r.itens}","${r.observacoes}","${r.data_registro}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `registros_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`✅ ${registros.length} registros exportados!`);
  } catch (err) {
    console.error("Erro:", err);
  }
}

async function visualizarStats() {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const result = await response.json();
    console.log("📊 Estatísticas:", result.data);
    return result.data;
  } catch (err) {
    console.error("Erro:", err);
  }
}

// ===== ABAS =====
function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const tabName = this.getAttribute("data-tab");

      document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.remove("active"));

      this.classList.add("active");
      document.getElementById(tabName)?.classList.add("active");
    });
  });
}

// ===== CARREGAR ESTOQUE NO CARREGAMENTO =====
window.addEventListener("load", () => {
  console.log("✅ Scripts carregados!");
  loadStock();
  setupCheckboxListeners();
  setupTabs();

  // Configurar formulário
  const form = document.getElementById("attendanceForm");
  if (form) {
    form.addEventListener("submit", submitForm);
  }
});

// Auto-refresh do estoque a cada 30 segundos
setInterval(() => {
  loadStock();
}, 30000);

console.log("💡 Comandos disponíveis:");
console.log("   - visualizarRegistros()");
console.log("   - exportarCSV()");
console.log("   - visualizarStats()");
