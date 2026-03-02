// ===== CONFIGURAÇÃO DA API =====
const API_URL = "http://localhost:3000/api"; // Mude para seu domínio em produção

// ===== SISTEMA DE ESTOQUE DINÂMICO (BANCO DE DADOS) =====

// Carregar estoque do servidor
async function loadStock() {
  try {
    const response = await fetch(`${API_URL}/stock`);
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      updateStockDisplay(result.data);
    } else {
      console.log("Estoque vazio, inicializando...");
      await initializeStock();
    }
  } catch (err) {
    console.error("Erro ao carregar estoque:", err);
    showAlert("⚠️ Erro ao carregar estoque. Usando dados locais.");
  }
}

// Inicializar estoque na primeira vez
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
    console.error("Erro ao inicializar estoque:", err);
  }
}

// Atualizar displays de quantidade
function updateStockDisplay(stockData) {
  const stockMap = {};

  // Converter array em objeto para fácil acesso
  stockData.forEach((item) => {
    stockMap[item.item_name] = item.quantity;
  });

  document.querySelectorAll(".item-quantity").forEach((el) => {
    const itemName = el.getAttribute("data-item");
    const quantity = stockMap[itemName] || 0;
    el.textContent = quantity;

    // Mudar cor se quantidade está baixa
    if (quantity === 0) {
      el.style.backgroundColor = "#ff6b6b"; // Vermelho
    } else if (quantity <= 2) {
      el.style.backgroundColor = "#ffa500"; // Laranja
    } else {
      el.style.backgroundColor = "#1e90ff"; // Azul
    }
  });
}

// Reduzir quantidade quando item é marcado
async function reduceStock(itemName) {
  try {
    const response = await fetch(`${API_URL}/stock/reduce`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_name: itemName }),
    });

    if (response.ok) {
      await loadStock(); // Recarregar estoque
    }
  } catch (err) {
    console.error("Erro ao reduzir estoque:", err);
  }
}

// Aumentar quantidade quando item é desmarcado
async function increaseStock(itemName) {
  try {
    const response = await fetch(`${API_URL}/stock/increase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_name: itemName }),
    });

    if (response.ok) {
      await loadStock(); // Recarregar estoque
    }
  } catch (err) {
    console.error("Erro ao aumentar estoque:", err);
  }
}

// Adicionar event listeners para checkboxes
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener("change", async function () {
    const itemName = this.getAttribute("data-item");

    if (this.checked) {
      await reduceStock(itemName);
    } else {
      await increaseStock(itemName);
    }
  });
});

// Carregar estoque quando página carrega
window.addEventListener("load", function () {
  loadStock();
});

// ===== VALIDAÇÃO E ENVIO DO FORMULÁRIO =====
document
  .getElementById("attendanceForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("name").value.trim();
    const presenca = document.querySelector(
      'input[name="presenca"]:checked'
    ).value;

    // Validar itens selecionados
    const itensCheckboxes = document.querySelectorAll(
      'input[name="itens"]:checked'
    );

    if (itensCheckboxes.length === 0) {
      showAlert("❌ Selecione pelo menos um item!");
      return;
    }

    const itens = Array.from(itensCheckboxes)
      .map((cb) => cb.getAttribute("data-item"))
      .join(", ");

    const observacoes =
      document.getElementById("observations").value.trim() || "Nenhuma";

    // Preparar dados
    const data = {
      nome,
      presenca,
      itens: presenca === "Sim" ? itens : "Não selecionou",
      observacoes,
    };

    try {
      // Enviar para API
      const response = await fetch(`${API_URL}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Backup no localStorage
        saveToLocalStorage(data);

        // Mostrar sucesso
        showSuccessMessage({
          ...data,
          data_registro: new Date().toLocaleString("pt-BR"),
        });

        // Resetar formulário
        setTimeout(resetForm, 2000);
      } else {
        showAlert("❌ Erro ao salvar registro: " + result.error);
      }
    } catch (err) {
      console.error(err);
      showAlert("❌ Erro de conexão: " + err.message);
      // Fallback: salvar localmente
      saveToLocalStorage(data);
    }
  });

// ===== SALVAR BACKUP NO LOCALSTORAGE =====
function saveToLocalStorage(data) {
  let registros = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
  registros.push({
    ...data,
    data_registro: new Date().toLocaleString("pt-BR"),
  });
  localStorage.setItem("attendanceRecords", JSON.stringify(registros));
}

// ===== MOSTRAR MENSAGEM DE SUCESSO =====
function showSuccessMessage(data) {
  const successDiv = document.getElementById("successMessage");
  const detailsDiv = document.getElementById("successDetails");

  let detailsHTML = `
        <strong>${data.nome}</strong><br>
        Presença: ${data.presenca}<br>
    `;

  if (data.presenca === "Sim") {
    detailsHTML += `Itens: ${data.itens}<br>`;
  }

  detailsHTML += `${
    data.observacoes !== "Nenhuma"
      ? "Observações: " + data.observacoes + "<br>"
      : ""
  }`;

  detailsDiv.innerHTML = detailsHTML;

  // Mostrar modal
  successDiv.classList.remove("hidden");

  // Criar confetes
  createConfetti();

  // Esconder após 5 segundos
  setTimeout(() => {
    successDiv.classList.add("hidden");
  }, 5000);
}

// ===== CRIAR CONFETES =====
function createConfetti() {
  const confettiDiv = document.querySelector(".confetti");

  for (let i = 0; i < 30; i++) {
    const confetto = document.createElement("div");
    confetto.style.left = Math.random() * 100 + "%";
    confetto.style.width = Math.random() * 10 + 5 + "px";
    confetto.style.height = confetto.style.width;
    confetto.style.backgroundColor = [
      "#ff69b4",
      "#87ceeb",
      "#ffd700",
      "#ff1493",
    ][Math.floor(Math.random() * 4)];
    confetto.style.borderRadius = "50%";
    confetto.style.position = "absolute";
    confetto.style.animation = `confettiFall ${
      1.5 + Math.random() * 1
    }s ease-in forwards`;
    confettiDiv.appendChild(confetto);

    // Remover elemento após animação
    setTimeout(() => confetto.remove(), 2500);
  }
}

// ===== RESETAR FORMULÁRIO =====
function resetForm() {
  document.getElementById("attendanceForm").reset();
  document.getElementById("successMessage").classList.add("hidden");

  // Scroll para o topo
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Focar no campo de nome
  document.getElementById("name").focus();
}

// ===== MOSTRAR ALERT =====
function showAlert(message) {
  // Criar elemento de alerta customizado
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

  // Remover após 3 segundos
  setTimeout(() => {
    alertDiv.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}

// ===== ADICIONAR ESTILOS PARA ANIMAÇÕES =====
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    @keyframes confettiFall {
        to {
            transform: translateY(400px) rotateZ(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// ===== SISTEMA DE ABAS =====
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    const tabName = this.getAttribute("data-tab");

    // Remove active de todos os botões e conteúdos
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));

    // Adiciona active ao botão e conteúdo clicados
    this.classList.add("active");
    document.getElementById(tabName).classList.add("active");
  });
});

// ===== CONTROLES DE DESENVOLVIMENTO =====
// Função para visualizar registros (abrir console e digitar: visualizarRegistros())
async function visualizarRegistros() {
  try {
    const response = await fetch(`${API_URL}/records`);
    const result = await response.json();
    console.table(result.data);
    return result.data;
  } catch (err) {
    console.error(err);
  }
}

// Função para exportar dados como CSV
async function exportarCSV() {
  try {
    const response = await fetch(`${API_URL}/records`);
    const result = await response.json();
    const registros = result.data;

    if (registros.length === 0) {
      alert("Nenhum registro para exportar!");
      return;
    }

    let csv = "Nome,Presença,Itens,Observações,Data do Registro\n";

    registros.forEach((registro) => {
      csv += `"${registro.nome}","${registro.presenca}","${registro.itens}","${registro.observacoes}","${registro.data_registro}"\n`;
    });

    // Criar blob e download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `presencas_cha_fraldas_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`✅ ${registros.length} registros exportados com sucesso!`);
  } catch (err) {
    console.error(err);
  }
}

// Função para visualizar stats
async function visualizarStats() {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const result = await response.json();
    console.log(result.data);
    return result.data;
  } catch (err) {
    console.error(err);
  }
}

console.log("✅ Script carregado com sucesso!");
console.log("💡 Use: visualizarRegistros(), exportarCSV(), visualizarStats()");
