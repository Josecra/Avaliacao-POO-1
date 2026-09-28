import { ArmazemController } from "./ArmazemController.js";

const controller = new ArmazemController();
controller.carregarDados();

// ── Elementos do DOM ─────────────────────────────────────────────────────────
const rbProduto      = document.getElementById("rbProduto");
const rbFornecedor   = document.getElementById("rbFornecedor");
const divProduto     = document.getElementById("divProduto");
const divFornecedor  = document.getElementById("divFornecedor");

const sltProduto    = document.getElementById("sltProduto");
const sltFornecedor = document.getElementById("sltFornecedor");

// Campos Produto
const inProduto    = document.getElementById("inProduto");
const inPrecoCompra      = document.getElementById("inPrecoCompra");
const inPrecoVenda = document.getElementById("inPrecoVenda");
const inQtd        = document.getElementById("inQtd");
const inMes        = document.getElementById("inMes");
const inFornecedor = document.getElementById("inFornecedor");

// Campos Fornecedor
const inRazaoSoc    = document.getElementById("inRazaoSoc");
const inCnpj        = document.getElementById("inCnpj");
const inTelefone    = document.getElementById("inTelefone");
const inEndereco    = document.getElementById("inEndereco");
const inCreditoDisp = document.getElementById("inCreditoDisp");

const btOk          = document.getElementById("btOk");
const outResultado  = document.getElementById("outResultado");
const sectionResult = document.querySelector(".sectionResultado");

// ── Radio buttons — alterna entre divs ───────────────────────────────────────
rbProduto.addEventListener("change", () => {
    divProduto.style.display    = "block";
    divFornecedor.style.display = "none";
    limparTela();
});

rbFornecedor.addEventListener("change", () => {
    divProduto.style.display    = "none";
    divFornecedor.style.display = "block";
    limparTela();
});

// ── Select Produto — habilita campos conforme funcionalidade ─────────────────
sltProduto.addEventListener("change", () => {
    desabilitarCamposProduto();
    limparTela();
    const opcao = sltProduto.value;

    switch (opcao) {
        case "Cadastrar":
            habilitarInput(inProduto, "Digite o nome do produto");
            habilitarInput(inPrecoCompra,   "Preço de Compra");
            habilitarInput(inPrecoVenda,    "Preço de Venda");
            habilitarInput(inQtd,     "Quantidade em estoque");
            break;
        case "Excluir":
        case "Consultar":
        case "ConsultarQtd":
            habilitarInput(inProduto, "Digite o nome do produto");
            break;
        case "Alterar":
            habilitarInput(inProduto,    "Digite o nome do produto");
            habilitarInput(inPrecoCompra,      "Novo Preço de Compra (opcional)");
            habilitarInput(inPrecoVenda,       "Novo Preço de Venda (opcional)");
            habilitarInput(inQtd,        "Nova Quantidade em Estoque (opcional)");
            habilitarInput(inFornecedor, "CNPJ do Fornecedor (opcional)");
            break;
        case "AlterarVenda":
            habilitarInput(inProduto, "Digite o nome do produto");
            habilitarInput(inMes,     "Mês [1-12]");
            habilitarInput(inQtd,     "Quantidade vendida no mês");
            break;
        case "Comprar":
            habilitarInput(inProduto,    "Digite o nome do produto");
            habilitarInput(inQtd,        "Quantidade comprada");
            habilitarInput(inPrecoCompra,      "Novo Preço de Compra (opcional)");
            habilitarInput(inPrecoVenda,       "Novo Preço de Venda (opcional)");
            habilitarInput(inFornecedor, "CNPJ do Fornecedor (opcional)");
            break;
        case "Vender":
            habilitarInput(inProduto, "Digite o nome do produto");
            habilitarInput(inQtd,     "Quantidade vendida");
            break;
        case "ConsultarProd":
        case "Faturamento":
            habilitarInput(inMes, "Mês [1-12]");
            break;
        case "FiltrarQtdEst":
            habilitarInput(inQtd, "Quantidade máxima em estoque");
            break;
        case "ListarProdFornecedor":
            habilitarInput(inFornecedor, "CNPJ do Fornecedor");
            break;
        case "ListarVendas":
        case "ListarProdutos":
            break; // sem campos necessários
    }
    btOk.disabled = false;
});

// ── Select Fornecedor — habilita campos conforme funcionalidade ──────────────
sltFornecedor.addEventListener("change", () => {
    desabilitarCamposFornecedor();
    limparTela();
    const opcao = sltFornecedor.value;

    switch (opcao) {
        case "Cadastrar":
            habilitarInput(inRazaoSoc,    "Razão Social");
            habilitarInput(inCnpj,        "XX.XXX.XXX/XXXX-XX");
            habilitarInput(inTelefone,    "(XX)XXXXX-XXXX");
            habilitarInput(inEndereco,    "Endereço");
            habilitarInput(inCreditoDisp, "Crédito Disponibilizado");
            break;
        case "Excluir":
        case "Consultar":
            habilitarInput(inCnpj, "XX.XXX.XXX/XXXX-XX");
            break;
        case "Alterar":
            habilitarInput(inCnpj,        "XX.XXX.XXX/XXXX-XX");
            habilitarInput(inRazaoSoc,    "Nova Razão Social (opcional)");
            habilitarInput(inTelefone,    "Novo Telefone (opcional)");
            habilitarInput(inEndereco,    "Novo Endereço (opcional)");
            habilitarInput(inCreditoDisp, "Novo Crédito (opcional)");
            break;
        case "FiltrarLimCred":
            habilitarInput(inCreditoDisp, "Crédito mínimo");
            break;
        case "Listar":
            break;
    }
    btOk.disabled = false;
});

// ── Botão Ok ─────────────────────────────────────────────────────────────────
btOk.addEventListener("click", () => {
    limparTela();

    if (rbProduto.checked) {
        executarOpcaoProduto();
    } else if (rbFornecedor.checked) {
        executarOpcaoFornecedor();
    }
});

function executarOpcaoProduto() {
    
}

function executarOpcaoFornecedor() {
    
}

// ── Funções auxiliares da View ────────────────────────────────────────────────

function habilitarInput(campo, placeholder) {
    campo.disabled    = false;
    campo.placeholder = placeholder;
}

function desabilitarCamposProduto() {
    [inProduto, inPrecoCompra, inPrecoVenda, inQtd, inMes, inFornecedor].forEach(inAux => {
        inAux.disabled = true; inAux.value = ""; inAux.placeholder = "";
    });
    btOk.disabled = true;
}

function desabilitarCamposFornecedor() {
    [inRazaoSoc, inCnpj, inTelefone, inEndereco, inCreditoDisp].forEach(inAux => {
        inAux.disabled = true; inAux.value = ""; inAux.placeholder = "";
    });
    btOk.disabled = true;
}

function limparTela() {
    outResultado.textContent  = "";
    sectionResult.innerHTML   = "";
}