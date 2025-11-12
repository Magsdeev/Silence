// ===== CONFIGURAÇÃO DE PRODUTOS =====
const produtos = [
  { nome: "FIVE", precoNormal: 35000, precoParceria: 30000 },
  { nome: "EVO-9", precoNormal: 70000, precoParceria: 65000 },
  { nome: "M-TAR", precoNormal: 70000, precoParceria: 65000 },
  { nome: "GLOCK RAJADA", precoNormal: 70000, precoParceria: 65000 },
  { nome: "UZI", precoNormal: 70000, precoParceria: 65000 },
  { nome: "ECSTASY", precoNormal: 260,  precoParceria: 220 },
];

const lista = document.getElementById("lista-produtos");
const total = document.getElementById("total");
const radiosParceria = document.getElementsByName("parceria");
const btnResetar = document.getElementById("resetar-btn");
let parceriaAtiva = false;
let timerPiscar;

// ===== FORMATADOR =====
const formatar = valor =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(valor);

// ===== CRIA AS LINHAS =====
produtos.forEach((p, i) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${p.nome}</td>
    <td><input type="number" id="qtd-${i}" class="input-qtd" min="0" value="0"></td>
    <td id="subtotal-${i}">${formatar(0)}</td>
  `;
  lista.appendChild(tr);
});

// ===== CÁLCULO =====
function atualizarTotais() {
  let totalGeral = 0;
  produtos.forEach((p, i) => {
    const input = document.getElementById(`qtd-${i}`);
    const subtotal = document.getElementById(`subtotal-${i}`);
    if (input.value === "" || parseInt(input.value) < 0) input.value = 0;
    const qtd = parseInt(input.value) || 0;
    const preco = parceriaAtiva ? p.precoParceria : p.precoNormal;
    const sub = qtd * preco;
    subtotal.textContent = formatar(sub);
    totalGeral += sub;
  });

  total.textContent = formatar(totalGeral);
  total.classList.remove("piscar");
  void total.offsetWidth;
  total.classList.add("piscar");
  total.classList.remove("verde");

  clearTimeout(timerPiscar);
  timerPiscar = setTimeout(() => {
    total.classList.remove("piscar");
    if (totalGeral > 0) {
      total.classList.add("verde");
    } else {
      total.classList.remove("verde");
    }
  }, 400);
}

// ===== EVENTOS =====
radiosParceria.forEach(r => {
  r.addEventListener("change", () => {
    parceriaAtiva = (r.value === "com");
    atualizarTotais();
  });
});

document.querySelectorAll(".input-qtd").forEach(input => {
  input.addEventListener("focus", () => {
    if (input.value === "0") input.value = "";
  });

  input.addEventListener("blur", () => {
    if (input.value === "" || parseInt(input.value) < 0) {
      input.value = 0;
      atualizarTotais();
    }
  });

  input.addEventListener("input", atualizarTotais);
});

btnResetar.addEventListener("click", () => {
  document.querySelectorAll(".input-qtd").forEach(input => input.value = 0);
  atualizarTotais();
});

document.getElementById("modo-btn").addEventListener("click", () => {
  document.body.classList.toggle("claro");
  const icone = document.body.classList.contains("claro") ? "☀️" : "🌙";
  document.getElementById("modo-btn").textContent = icone;
});

atualizarTotais();
