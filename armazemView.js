/**
 * armazemView.js (View)
 * -----------------------------------------------------------------------
 * Responsável por:
 *  - Ler dados dos inputs;
 *  - Chamar métodos do ArmazemController;
 *  - Exibir mensagens e tabelas para o usuário.
 *
 * NÃO contém regra de negócio: nenhuma decisão de "pode/não pode" fica
 * aqui — apenas o encaminhamento para o Controller.
 */

import { ArmazemController } from "./ArmazemController.js";

// ── Instancia o Controller e carrega dados persistidos ─────────────────────
const armazemControl = new ArmazemController();
armazemControl.carregarDados();

// ── Elementos do DOM — seleção de cadastro ─────────────────────────────────
const rbProduto = document.getElementById("rbProduto");
const rbFornecedor = document.getElementById("rbFornecedor");

// ── Elementos do DOM — blocos de cadastro ──────────────────────────────────
const divProduto = document.getElementById("divProduto");
const divFornecedor = document.getElementById("divFornecedor");

// ── Elementos do DOM — selects de opção ────────────────────────────────────
const selectProduto = document.getElementById("sltProduto");
const selectFornecedor = document.getElementById("sltFornecedor");

// ── Elementos do DOM — campos de Produto ───────────────────────────────────
const inProduto = document.getElementById("inProduto");
const inPrecoCompra = document.getElementById("inPrecoCompra");
const inPrecoVenda = document.getElementById("inPrecoVenda");
const inQtd = document.getElementById("inQtd");
const inMes = document.getElementById("inMes");
const inFornecedor = document.getElementById("inFornecedor");

// ── Elementos do DOM — campos de Fornecedor ────────────────────────────────
const inRazaoSoc = document.getElementById("inRazaoSoc");
const inCnpj = document.getElementById("inCnpj");
const inTelefone = document.getElementById("inTelefone");
const inEndereco = document.getElementById("inEndereco");
const inCreditoDisp = document.getElementById("inCreditoDisp");

// ── Elementos do DOM — saída e botão de execução ───────────────────────────
const btOk = document.getElementById("btOk");
const outResultado = document.getElementById("outResultado");
const sectionResult = document.querySelector(".sectionResultado");

// ══════════════════════════════════════════════════════════════════════════
// EVENTOS DE ALTERNÂNCIA (Produto x Fornecedor)
// ══════════════════════════════════════════════════════════════════════════

rbProduto.addEventListener("change", function () {
    divProduto.style.display = "block";
    divFornecedor.style.display = "none";
    limparTela();
});

rbFornecedor.addEventListener("change", function () {
    divProduto.style.display = "none";
    divFornecedor.style.display = "block";
    limparTela();
});

// ══════════════════════════════════════════════════════════════════════════
// EVENTOS DE TROCA DE OPÇÃO NOS SELECTS
// ══════════════════════════════════════════════════════════════════════════

selectProduto.addEventListener("change", function () {
    desabilitarCamposProduto();
    limparTela();
    let opcao = selectProduto.value;
    configurarCamposProduto(opcao);
    btOk.disabled = false;
});

selectFornecedor.addEventListener("change", function () {
    desabilitarCamposFornecedor();
    limparTela();
    let opcao = selectFornecedor.value;
    configurarCamposFornecedor(opcao);
    btOk.disabled = false;
});

// ══════════════════════════════════════════════════════════════════════════
// EVENTO DO BOTÃO OK
// ══════════════════════════════════════════════════════════════════════════

btOk.addEventListener("click", function () {
    limparTela();

    if (rbProduto.checked) {
        executarOpcaoProduto();
    } else if (rbFornecedor.checked) {
        executarOpcaoFornecedor();
    }
});

// ══════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO DOS CAMPOS DE ACORDO COM A OPÇÃO ESCOLHIDA
// ══════════════════════════════════════════════════════════════════════════

/**
 * Habilita os campos de Produto necessários para a opção escolhida.
 */
function configurarCamposProduto(opcao) {
    switch (opcao) {
        case "Cadastrar":
            habilitar(inProduto, "Digite o nome do produto");
            habilitar(inPrecoCompra, "Preço de Compra");
            habilitar(inPrecoVenda, "Preço de Venda");
            habilitar(inQtd, "Quantidade em estoque");
            break;

        case "Excluir":
        case "Consultar":
        case "ConsultarQtd":
            habilitar(inProduto, "Digite o nome do produto");
            break;

        case "Alterar":
            habilitar(inProduto, "Digite o nome do produto");
            habilitar(inPrecoCompra, "Novo Preço de Compra (opcional)");
            habilitar(inPrecoVenda, "Novo Preço de Venda (opcional)");
            habilitar(inQtd, "Nova Quantidade em Estoque (opcional)");
            habilitar(inFornecedor, "CNPJ do Fornecedor (opcional)");
            break;

        case "AlterarVenda":
            habilitar(inProduto, "Digite o nome do produto");
            habilitar(inMes, "Mês [1-12]");
            habilitar(inQtd, "Quantidade vendida no mês");
            break;

        case "Comprar":
            habilitar(inProduto, "Digite o nome do produto");
            habilitar(inQtd, "Quantidade comprada");
            habilitar(inPrecoCompra, "Novo Preço de Compra (opcional)");
            habilitar(inPrecoVenda, "Novo Preço de Venda (opcional)");
            habilitar(inFornecedor, "CNPJ do Fornecedor (opcional)");
            break;

        case "Vender":
            habilitar(inProduto, "Digite o nome do produto");
            habilitar(inQtd, "Quantidade vendida");
            break;

        case "ConsultarProd":
        case "Faturamento":
            habilitar(inMes, "Mês [1-12]");
            break;

        case "FiltrarQtdEst":
            habilitar(inQtd, "Quantidade máxima em estoque");
            break;

        case "ListarProdFornecedor":
            habilitar(inFornecedor, "CNPJ do Fornecedor");
            break;

        case "ListarVendas":
        case "ListarProdutos":
            // nenhum campo necessário
            break;
    }
}

/**
 * Habilita os campos de Fornecedor necessários para a opção escolhida.
 */
function configurarCamposFornecedor(opcao) {
    switch (opcao) {
        case "Cadastrar":
            habilitar(inRazaoSoc, "Razão Social");
            habilitar(inCnpj, "XX.XXX.XXX/XXXX-XX");
            habilitar(inTelefone, "(XX)XXXXX-XXXX");
            habilitar(inEndereco, "Endereço");
            habilitar(inCreditoDisp, "Crédito Disponibilizado");
            break;

        case "Excluir":
        case "Consultar":
            habilitar(inCnpj, "XX.XXX.XXX/XXXX-XX");
            break;

        case "Alterar":
            habilitar(inCnpj, "XX.XXX.XXX/XXXX-XX");
            habilitar(inRazaoSoc, "Nova Razão Social (opcional)");
            habilitar(inTelefone, "Novo Telefone (opcional)");
            habilitar(inEndereco, "Novo Endereço (opcional)");
            habilitar(inCreditoDisp, "Novo Crédito (opcional)");
            break;

        case "FiltrarLimCred":
            habilitar(inCreditoDisp, "Crédito mínimo");
            break;

        case "Listar":
            // nenhum campo necessário
            break;
    }
}

// ══════════════════════════════════════════════════════════════════════════
// EXECUÇÃO DAS OPÇÕES DE PRODUTO
// ══════════════════════════════════════════════════════════════════════════

function executarOpcaoProduto() {
    let opcao = selectProduto.value;
    let descricao = inProduto.value.trim();
    let precoCompra = Number(inPrecoCompra.value);
    let precoVenda = Number(inPrecoVenda.value);
    let qtd = Number(inQtd.value);
    let mes = Number(inMes.value);
    let cnpjForn = inFornecedor.value.trim();

    switch (opcao) {

        // ── CADASTRAR ───────────────────────────────────────────────────
        case "Cadastrar":
            if (descricao == "") {
                exibirMensagem("O campo Produto é obrigatório!", "red");
                inProduto.focus();
            } else if (precoCompra <= 0) {
                exibirMensagem("O campo Preço de Compra é obrigatório!", "red");
                inPrecoCompra.focus();
            } else if (precoVenda <= 0) {
                exibirMensagem("O campo Preço de Venda é obrigatório!", "red");
                inPrecoVenda.focus();
            } else {
                if (armazemControl.cadastrarProduto(descricao, precoCompra, precoVenda, qtd)) {
                    exibirMensagem("Produto \"" + descricao + "\" cadastrado com sucesso!", "blue");
                } else {
                    exibirMensagem("Erro! Já existe um produto com a descrição \"" + descricao + "\"!", "red");
                }
            }
            break;

        // ── EXCLUIR ─────────────────────────────────────────────────────
        case "Excluir":
            if (descricao == "") {
                exibirMensagem("O campo Produto é obrigatório!", "red");
                inProduto.focus();
            } else if (armazemControl.excluirProduto(descricao)) {
                exibirMensagem("Produto \"" + descricao + "\" excluído com sucesso!", "blue");
            } else {
                exibirMensagem("Erro! Produto \"" + descricao + "\" não encontrado!", "red");
            }
            break;

        // ── ALTERAR ─────────────────────────────────────────────────────
        case "Alterar": {
            if (descricao == "") {
                exibirMensagem("O campo Produto é obrigatório!", "red");
                inProduto.focus();
            } else {
                let resultado = armazemControl.alterarProduto(
                    descricao, precoCompra, precoVenda, qtd, cnpjForn
                );

                let mensagens = {
                    "SUCESSO": { cor: "blue", texto: "Produto alterado com sucesso!" },
                    "PRODUTO_NAO_ENCONTRADO": { cor: "red", texto: "Erro! Produto \"" + descricao + "\" não encontrado!" },
                    "FORNECEDOR_NAO_ENCONTRADO": { cor: "red", texto: "Erro! Fornecedor com CNPJ \"" + cnpjForn + "\" não encontrado!" }
                };

                exibirMensagem(mensagens[resultado].texto, mensagens[resultado].cor);
            }
            break;
        }

        // ── ALTERAR VENDA MENSAL ────────────────────────────────────────
        case "AlterarVenda": {
            if (descricao == "") {
                exibirMensagem("O campo Produto é obrigatório!", "red");
                inProduto.focus();
            } else if (mes == 0) {
                exibirMensagem("O campo Mês é obrigatório!", "red");
                inMes.focus();
            } else if (qtd == 0) {
                exibirMensagem("O campo Quantidade é obrigatório!", "red");
                inQtd.focus();
            } else {
                let resultado = armazemControl.alterarVendaMes(descricao, mes, qtd);

                let mensagens = {
                    "SUCESSO": { cor: "blue", texto: "Venda mensal atualizada com sucesso!" },
                    "PRODUTO_NAO_ENCONTRADO": { cor: "red", texto: "Produto \"" + descricao + "\" não encontrado!" },
                    "MES_INVALIDO": { cor: "red", texto: "Mês inválido! Informe um valor entre 1 e 12." }
                };

                exibirMensagem(mensagens[resultado].texto, mensagens[resultado].cor);
            }
            break;
        }

        // ── CONSULTAR ───────────────────────────────────────────────────
        case "Consultar": {
            if (descricao == "") {
                exibirMensagem("O campo Produto é obrigatório!", "red");
                inProduto.focus();
            } else {
                let objLiteralProduto = armazemControl.consultarProduto(descricao);

                if (objLiteralProduto != undefined) {
                    let strFornecedor = "Não vinculado";
                    if (objLiteralProduto.cnpjForn != null) {
                        strFornecedor = objLiteralProduto.cnpjForn + " - " + objLiteralProduto.nomeForn;
                    }

                    exibirMensagem(
                        "Descrição: " + objLiteralProduto.descricao + "\n" +
                        "Preço de Compra: R$ " + objLiteralProduto.precoCompra.toFixed(2) + "\n" +
                        "Preço de Venda: R$ " + objLiteralProduto.precoVenda.toFixed(2) + "\n" +
                        "Quantidade em Estoque: " + objLiteralProduto.qtdEstoque + "\n" +
                        "Fornecedor: " + strFornecedor,
                        "blue"
                    );
                } else {
                    exibirMensagem("Produto \"" + descricao + "\" não encontrado!", "red");
                }
            }
            break;
        }

        // ── COMPRAR ─────────────────────────────────────────────────────
        case "Comprar": {
            if (descricao == "") {
                exibirMensagem("O campo Produto é obrigatório!", "red");
                inProduto.focus();
            } else if (qtd == 0) {
                exibirMensagem("O campo Quantidade é obrigatório!", "red");
                inQtd.focus();
            } else {
                let resultado = armazemControl.comprarProduto(
                    descricao, qtd, precoCompra, precoVenda, cnpjForn
                );

                let mensagens = {
                    "SUCESSO": { cor: "blue", texto: "Compra de \"" + descricao + "\" registrada com sucesso!" },
                    "PRODUTO_NAO_ENCONTRADO": { cor: "red", texto: "Erro! Produto \"" + descricao + "\" não encontrado!" },
                    "FORNECEDOR_NAO_ENCONTRADO": { cor: "red", texto: "Erro! Fornecedor com CNPJ \"" + cnpjForn + "\" não encontrado!" },
                    "CREDITO_INSUFICIENTE": { cor: "red", texto: "Erro! O valor total da compra excede o crédito disponibilizado pelo Fornecedor!" }
                };

                exibirMensagem(mensagens[resultado].texto, mensagens[resultado].cor);
            }
            break;
        }

        // ── VENDER ──────────────────────────────────────────────────────
        case "Vender": {
            if (descricao == "") {
                exibirMensagem("O campo Produto é obrigatório!", "red");
                inProduto.focus();
            } else if (qtd == 0) {
                exibirMensagem("O campo Quantidade é obrigatório!", "red");
                inQtd.focus();
            } else {
                let objResultado = armazemControl.venderProduto(descricao, qtd);

                if (objResultado.codigo == "SUCESSO") {
                    exibirMensagem(
                        "Venda registrada! Total: R$ " + objResultado.totalVenda.toFixed(2),
                        "blue"
                    );
                } else if (objResultado.codigo == "PRODUTO_NAO_ENCONTRADO") {
                    exibirMensagem("Erro! Produto \"" + descricao + "\" não encontrado!", "red");
                } else {
                    exibirMensagem(
                        "Erro! Estoque insuficiente. Estoque atual: " + objResultado.estoqueAtual + " unidades.",
                        "red"
                    );
                }
            }
            break;
        }

        // ── CONSULTAR QUANTIDADE VENDIDA NO ANO ─────────────────────────
        case "ConsultarQtd": {
            if (descricao == "") {
                exibirMensagem("O campo Produto é obrigatório!", "red");
                inProduto.focus();
            } else {
                let objLiteralProduto = armazemControl.consultarTotalVendasAno(descricao);

                if (objLiteralProduto != undefined) {
                    exibirMensagem(
                        "Produto: " + objLiteralProduto.descricao + "\n" +
                        "Total vendido no ano: " + objLiteralProduto.totalVendas + " unidades",
                        "blue"
                    );
                } else {
                    exibirMensagem("Produto \"" + descricao + "\" não encontrado!", "red");
                }
            }
            break;
        }

        // ── CONSULTAR PRODUTO MAIS VENDIDO NO MÊS ───────────────────────
        case "ConsultarProd": {
            if (mes == 0) {
                exibirMensagem("O campo Mês é obrigatório!", "red");
                inMes.focus();
            } else {
                let objLiteralProduto = armazemControl.consultarMaisVendidoMes(mes);

                if (objLiteralProduto != undefined) {
                    exibirMensagem(
                        "Produto mais vendido no mês " + mes + ":\n" +
                        objLiteralProduto.descricao + " — " + objLiteralProduto.qtdVendida + " unidades",
                        "blue"
                    );
                } else {
                    exibirMensagem("Nenhum produto cadastrado!", "red");
                }
            }
            break;
        }

        // ── FATURAMENTO DO MÊS ──────────────────────────────────────────
        case "Faturamento": {
            if (mes == 0) {
                exibirMensagem("O campo Mês é obrigatório!", "red");
                inMes.focus();
            } else {
                let objLiteralFaturamento = armazemControl.consultarFaturamentoMes(mes);
                exibirMensagem(
                    "Faturamento do mês " + objLiteralFaturamento.mes + ": R$ " +
                    objLiteralFaturamento.faturamento.toFixed(2),
                    "blue"
                );
            }
            break;
        }

        // ── FILTRAR PRODUTOS POR ESTOQUE ────────────────────────────────
        case "FiltrarQtdEst": {
            if (qtd == 0) {
                exibirMensagem("O campo Quantidade é obrigatório!", "red");
                inQtd.focus();
            } else {
                let vetObjetosLiteraisProduto = armazemControl.filtrarProdutosPorEstoque(qtd);

                if (vetObjetosLiteraisProduto.length > 0) {
                    sectionResult.appendChild(gerarTabelaHtmlProdutos(vetObjetosLiteraisProduto));
                } else {
                    exibirMensagem("Nenhum produto encontrado com essa quantidade.", "red");
                }
            }
            break;
        }

        // ── LISTAR PRODUTOS ─────────────────────────────────────────────
        case "ListarProdutos": {
            let vetObjetosLiteraisProduto = armazemControl.listarProdutos();

            if (vetObjetosLiteraisProduto.length > 0) {
                sectionResult.appendChild(gerarTabelaHtmlProdutos(vetObjetosLiteraisProduto));
            } else {
                exibirMensagem("Nenhum produto cadastrado!", "red");
            }
            break;
        }

        // ── LISTAR TABELA DE VENDAS ANUAL ───────────────────────────────
        case "ListarVendas": {
            let vetObjetosLiteraisVenda = armazemControl.listarTabelaVendasAnual();

            if (vetObjetosLiteraisVenda.length > 0) {
                sectionResult.appendChild(gerarTabelaHtmlVendas(vetObjetosLiteraisVenda));
            } else {
                exibirMensagem("Nenhum produto cadastrado!", "red");
            }
            break;
        }

        // ── LISTAR PRODUTOS DE UM FORNECEDOR ────────────────────────────
        case "ListarProdFornecedor": {
            if (cnpjForn == "") {
                exibirMensagem("O campo CNPJ do Fornecedor é obrigatório!", "red");
                inFornecedor.focus();
            } else {
                let vetObjetosLiteraisProduto = armazemControl.listarProdutosFornecedor(cnpjForn);

                if (vetObjetosLiteraisProduto == undefined) {
                    exibirMensagem("Fornecedor com CNPJ \"" + cnpjForn + "\" não encontrado!", "red");
                } else if (vetObjetosLiteraisProduto.length == 0) {
                    exibirMensagem("Nenhum produto vinculado a este fornecedor.", "red");
                } else {
                    sectionResult.appendChild(gerarTabelaHtmlProdutos(vetObjetosLiteraisProduto));
                }
            }
            break;
        }
    }
}

// ══════════════════════════════════════════════════════════════════════════
// EXECUÇÃO DAS OPÇÕES DE FORNECEDOR
// ══════════════════════════════════════════════════════════════════════════

function executarOpcaoFornecedor() {
    let opcao = selectFornecedor.value;
    let razaoSoc = inRazaoSoc.value.trim();
    let cnpj = inCnpj.value.trim();
    let telefone = inTelefone.value.trim();
    let endereco = inEndereco.value.trim();
    let credito = Number(inCreditoDisp.value);

    switch (opcao) {

        case "Cadastrar":
            if (razaoSoc == "") {
                exibirMensagem("O campo Razão Social é obrigatório!", "red");
                inRazaoSoc.focus();
            } else if (cnpj == "") {
                exibirMensagem("O campo CNPJ é obrigatório!", "red");
                inCnpj.focus();
            } else {
                if (armazemControl.cadastrarFornecedor(razaoSoc, cnpj, telefone, endereco, credito)) {
                    exibirMensagem("Fornecedor \"" + razaoSoc + "\" cadastrado com sucesso!", "blue");
                } else {
                    exibirMensagem("Erro! Já existe um fornecedor com o CNPJ \"" + cnpj + "\"!", "red");
                }
            }
            break;

        case "Excluir": {
            if (cnpj == "") {
                exibirMensagem("O campo CNPJ é obrigatório!", "red");
                inCnpj.focus();
            } else {
                let resultado = armazemControl.excluirFornecedor(cnpj);

                let mensagens = {
                    "SUCESSO": { cor: "blue", texto: "Fornecedor excluído com sucesso!" },
                    "FORNECEDOR_NAO_ENCONTRADO": { cor: "red", texto: "Erro! Fornecedor com CNPJ \"" + cnpj + "\" não encontrado!" },
                    "FORNECEDOR_COM_PRODUTOS": { cor: "red", texto: "Erro! Não é possível excluir: fornecedor possui produtos vinculados!" }
                };

                exibirMensagem(mensagens[resultado].texto, mensagens[resultado].cor);
            }
            break;
        }

        case "Alterar":
            if (cnpj == "") {
                exibirMensagem("O campo CNPJ é obrigatório!", "red");
                inCnpj.focus();
            } else if (armazemControl.alterarFornecedor(cnpj, razaoSoc, telefone, endereco, credito)) {
                exibirMensagem("Fornecedor alterado com sucesso!", "blue");
            } else {
                exibirMensagem("Erro! Fornecedor com CNPJ \"" + cnpj + "\" não encontrado!", "red");
            }
            break;

        case "Consultar": {
            if (cnpj == "") {
                exibirMensagem("O campo CNPJ é obrigatório!", "red");
                inCnpj.focus();
            } else {
                let objLiteralFornecedor = armazemControl.consultarFornecedor(cnpj);

                if (objLiteralFornecedor != undefined) {
                    exibirMensagem(
                        "Razão Social: " + objLiteralFornecedor.razaoSocial + "\n" +
                        "CNPJ: " + objLiteralFornecedor.cnpj + "\n" +
                        "Telefone: " + objLiteralFornecedor.telefone + "\n" +
                        "Endereço: " + objLiteralFornecedor.endereco + "\n" +
                        "Crédito Disponibilizado: R$ " + objLiteralFornecedor.credito.toFixed(2),
                        "blue"
                    );
                } else {
                    exibirMensagem("Fornecedor com CNPJ \"" + cnpj + "\" não encontrado!", "red");
                }
            }
            break;
        }

        case "Listar": {
            let vetObjetosLiteraisFornecedor = armazemControl.listarFornecedores();

            if (vetObjetosLiteraisFornecedor.length > 0) {
                sectionResult.appendChild(gerarTabelaHtmlFornecedores(vetObjetosLiteraisFornecedor));
            } else {
                exibirMensagem("Nenhum fornecedor cadastrado!", "red");
            }
            break;
        }

        case "FiltrarLimCred": {
            if (credito == 0) {
                exibirMensagem("O campo Crédito Disponibilizado é obrigatório!", "red");
                inCreditoDisp.focus();
            } else {
                let vetObjetosLiteraisFornecedor = armazemControl.filtrarFornecedoresPorCredito(credito);

                if (vetObjetosLiteraisFornecedor.length > 0) {
                    sectionResult.appendChild(gerarTabelaHtmlFornecedores(vetObjetosLiteraisFornecedor));
                } else {
                    exibirMensagem("Nenhum fornecedor encontrado com esse limite de crédito.", "red");
                }
            }
            break;
        }
    }
}

// ══════════════════════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES DA VIEW
// ══════════════════════════════════════════════════════════════════════════

/**
 * Habilita um campo de formulário e define seu placeholder.
 */
function habilitar(campo, placeholder) {
    campo.disabled = false;
    campo.placeholder = placeholder;
}

/**
 * Desabilita e limpa todos os campos de Produto.
 * Também desabilita o botão OK.
 */
function desabilitarCamposProduto() {
    inProduto.disabled = true; inProduto.value = ""; inProduto.placeholder = "";
    inPrecoCompra.disabled = true; inPrecoCompra.value = ""; inPrecoCompra.placeholder = "";
    inPrecoVenda.disabled = true; inPrecoVenda.value = ""; inPrecoVenda.placeholder = "";
    inQtd.disabled = true; inQtd.value = ""; inQtd.placeholder = "";
    inMes.disabled = true; inMes.value = ""; inMes.placeholder = "";
    inFornecedor.disabled = true; inFornecedor.value = ""; inFornecedor.placeholder = "";

    btOk.disabled = true;
}

/**
 * Desabilita e limpa todos os campos de Fornecedor.
 * Também desabilita o botão OK.
 */
function desabilitarCamposFornecedor() {
    inRazaoSoc.disabled = true; inRazaoSoc.value = ""; inRazaoSoc.placeholder = "";
    inCnpj.disabled = true; inCnpj.value = ""; inCnpj.placeholder = "";
    inTelefone.disabled = true; inTelefone.value = ""; inTelefone.placeholder = "";
    inEndereco.disabled = true; inEndereco.value = ""; inEndereco.placeholder = "";
    inCreditoDisp.disabled = true; inCreditoDisp.value = ""; inCreditoDisp.placeholder = "";

    btOk.disabled = true;
}

/**
 * Limpa a área de saída de texto e a área de tabelas.
 */
function limparTela() {
    outResultado.textContent = "";
    sectionResult.innerHTML = "";
}

/**
 * Exibe uma mensagem colorida na área de saída.
 */
function exibirMensagem(texto, cor) {
    outResultado.style.color = textContent_cor(cor);
    outResultado.textContent = texto;
}

/**
 * Pequeno auxiliar para devolver a cor recebida (mantido para clareza).
 */
function textContent_cor(cor) {
    return cor;
}

// ══════════════════════════════════════════════════════════════════════════
// GERAÇÃO DE TABELAS HTML
// ══════════════════════════════════════════════════════════════════════════

/**
 * Gera uma tabela HTML com os produtos recebidos.
 * Colunas: Descrição, Preço Compra, Preço Venda, Estoque, Total Vendas,
 *          Fornecedor.
 */
function gerarTabelaHtmlProdutos(vetObjetosLiteraisProduto) {
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    let trCabecalho = document.createElement("tr");
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "Descrição";
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "Preço Compra";
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "Preço Venda";
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "Estoque";
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "Total Vendas";
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "Fornecedor";
    thead.appendChild(trCabecalho);
    table.appendChild(thead);

    vetObjetosLiteraisProduto.forEach((objLiteralProduto) => {
        let linha = document.createElement("tr");

        let strFornecedor = "—";
        if (objLiteralProduto.cnpjForn != null) {
            strFornecedor = objLiteralProduto.cnpjForn + " - " + objLiteralProduto.nomeForn;
        }

        let tdDescricao = document.createElement("td");
        let tdPrecoCompra = document.createElement("td");
        let tdPrecoVenda = document.createElement("td");
        let tdEstoque = document.createElement("td");
        let tdTotal = document.createElement("td");
        let tdFornecedor = document.createElement("td");

        tdDescricao.innerHTML = objLiteralProduto.descricao;
        tdPrecoCompra.innerHTML = "R$ " + objLiteralProduto.precoCompra.toFixed(2);
        tdPrecoVenda.innerHTML = "R$ " + objLiteralProduto.precoVenda.toFixed(2);
        tdEstoque.innerHTML = objLiteralProduto.qtdEstoque;
        tdTotal.innerHTML = objLiteralProduto.totalAno;
        tdFornecedor.innerHTML = strFornecedor;

        linha.appendChild(tdDescricao);
        linha.appendChild(tdPrecoCompra);
        linha.appendChild(tdPrecoVenda);
        linha.appendChild(tdEstoque);
        linha.appendChild(tdTotal);
        linha.appendChild(tdFornecedor);

        tbody.appendChild(linha);
    });

    table.appendChild(tbody);
    return table;
}

/**
 * Gera uma tabela HTML com a venda anual de cada produto.
 * Colunas: Produto, Jan, Fev, ..., Dez, Total Ano.
 */
function gerarTabelaHtmlVendas(vetObjetosLiteraisVenda) {
    let meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    let trCabecalho = document.createElement("tr");
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "Produto";
    meses.forEach((nomeMes) => {
        trCabecalho.appendChild(document.createElement("th")).innerHTML = nomeMes;
    });
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "Total Ano";
    thead.appendChild(trCabecalho);
    table.appendChild(thead);

    vetObjetosLiteraisVenda.forEach((objLiteralVenda) => {
        let linha = document.createElement("tr");

        let tdProduto = document.createElement("td");
        tdProduto.innerHTML = objLiteralVenda.descricao;
        linha.appendChild(tdProduto);

        objLiteralVenda.vendasMensais.forEach((qtdMes) => {
            let tdMes = document.createElement("td");
            tdMes.innerHTML = qtdMes;
            linha.appendChild(tdMes);
        });

        let tdTotal = document.createElement("td");
        tdTotal.innerHTML = objLiteralVenda.totalAno;
        linha.appendChild(tdTotal);

        tbody.appendChild(linha);
    });

    table.appendChild(tbody);
    return table;
}

/**
 * Gera uma tabela HTML com os fornecedores recebidos.
 * Colunas: Razão Social, CNPJ, Telefone, Endereço, Crédito Disp.
 */
function gerarTabelaHtmlFornecedores(vetObjetosLiteraisFornecedor) {
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    let trCabecalho = document.createElement("tr");
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "Razão Social";
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "CNPJ";
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "Telefone";
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "Endereço";
    trCabecalho.appendChild(document.createElement("th")).innerHTML = "Crédito Disp.";
    thead.appendChild(trCabecalho);
    table.appendChild(thead);

    vetObjetosLiteraisFornecedor.forEach((objLiteralFornecedor) => {
        let linha = document.createElement("tr");

        let tdRazao = document.createElement("td");
        let tdCnpj = document.createElement("td");
        let tdTelefone = document.createElement("td");
        let tdEndereco = document.createElement("td");
        let tdCredito = document.createElement("td");

        tdRazao.innerHTML = objLiteralFornecedor.razaoSocial;
        tdCnpj.innerHTML = objLiteralFornecedor.cnpj;
        tdTelefone.innerHTML = objLiteralFornecedor.telefone;
        tdEndereco.innerHTML = objLiteralFornecedor.endereco;
        tdCredito.innerHTML = "R$ " + objLiteralFornecedor.credito.toFixed(2);

        linha.appendChild(tdRazao);
        linha.appendChild(tdCnpj);
        linha.appendChild(tdTelefone);
        linha.appendChild(tdEndereco);
        linha.appendChild(tdCredito);

        tbody.appendChild(linha);
    });

    table.appendChild(tbody);
    return table;
}