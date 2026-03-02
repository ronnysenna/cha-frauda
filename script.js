// ===== FORM SUBMISSION =====
document
  .getElementById("attendanceForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Obter dados do formulário
    const formData = new FormData(this);
    const name = formData.get("name");
    const attendance = formData.get("attendance");
    const observations = formData.get("observacoes");

    // Obter marcas selecionadas
    const selectedItems = [];
    document
      .querySelectorAll('input[name="items"]:checked')
      .forEach((checkbox) => {
        selectedItems.push(checkbox.value);
      });

    // Validações
    if (!name.trim()) {
      showAlert("Por favor, digite seu nome!");
      return;
    }

    if (!attendance) {
      showAlert("Por favor, confirme sua presença!");
      return;
    }

    if (attendance === "sim" && selectedItems.length === 0) {
      showAlert("Por favor, selecione pelo menos um item!");
      return;
    }

    // Preparar dados
    const registroData = {
      nome: name,
      presenca: attendance === "sim" ? "Sim" : "Não",
      itens:
        selectedItems.length > 0 ? selectedItems.join(", ") : "Não informado",
      observacoes: observations || "Nenhuma",
      data_registro: new Date().toLocaleString("pt-BR"),
    };

    // Salvar no localStorage
    saveToStorage(registroData);

    // Mostrar mensagem de sucesso
    showSuccessMessage(registroData);
  });

// ===== FUNÇÕES DE ARMAZENAMENTO =====
function saveToStorage(data) {
  let registros = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
  registros.push(data);
  localStorage.setItem("attendanceRecords", JSON.stringify(registros));

  // Log para debug
  console.log("Registro salvo:", data);
  console.log("Total de registros:", registros.length);
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
function visualizarRegistros() {
  const registros = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
  console.table(registros);
  return registros;
}

// Função para exportar dados como CSV
function exportarCSV() {
  const registros = JSON.parse(localStorage.getItem("attendanceRecords")) || [];

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
}

// Função para limpar todos os registros (cuidado!)
function limparRegistros() {
  if (confirm("⚠️ Tem certeza? Esta ação não pode ser desfeita!")) {
    localStorage.removeItem("attendanceRecords");
    console.log("✅ Todos os registros foram deletados!");
  }
}

// Mensagem no console
console.log(
  "%c🍼 Bem-vindo ao Chá de Fraldas! 🍼",
  "font-size: 20px; color: #ff69b4; font-weight: bold;"
);
console.log(
  "%cComandos disponíveis:",
  "font-size: 14px; color: #ff69b4; font-weight: bold;"
);
console.log(
  "%cvissualizarRegistros() - Ver todos os registros",
  "color: #666;"
);
console.log("%cexportarCSV() - Exportar dados como CSV", "color: #666;");
console.log(
  "%climparRegistros() - Deletar todos os registros (⚠️)",
  "color: #ff6b6b;"
);
