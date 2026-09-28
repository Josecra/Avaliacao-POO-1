import { ArmazemController } from "./ArmazemController.js";

const controller = new ArmazemController();
controller.carregarDados();

// ── Elementos do DOM ─────────────────────────────────────────────────────────
const rbProduto      = document.getElementById("rbProduto");
const rbFornecedor   = document.getElementById("rbFornecedor");
const divProduto     = document.getElementById("cadastroProduto");
const divFornecedor  = document.getElementById("cadastroFornecedor");

const selectProduto    = document.getElementById("selectOpcaoProduto");
const selectFornecedor = document.getElementById("selectOpcaoFornecedor");

// Campos Produto
const inProduto     = document.getElementById("inProduto");
const inPrecoCompra = document.getElementById("inPrecoCompra");
const inPrecoVenda  = document.getElementById("inPrecoVenda");
const inQtd         = document.getElementById("inQtd");
const inMes         = document.getElementById("inMes");
const inFornecedor  = document.getElementById("inFornecedor");

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
selectProduto.addEventListener("change", () => {
    desabilitarCamposProduto();
    limparTela();
    const opcao = selectProduto.value;

    switch (opcao) {
        case "Cadastrar":
            habilitar(inProduto,     "Digite o nome do produto");
            habilitar(inPrecoCompra, "Preço de Compra");
            habilitar(inPrecoVenda,  "Preço de Venda");
            habilitar(inQtd,         "Quantidade em estoque");
            break;
        case "Excluir":
        case "Consultar":
        case "ConsultarQtd":
            habilitar(inProduto, "Digite o nome do produto");
            break;
        case "Alterar":
            habilitar(inProduto,     "Digite o nome do produto");
            habilitar(inPrecoCompra, "Novo Preço de Compra (opcional)");
            habilitar(inPrecoVenda,  "Novo Preço de Venda (opcional)");
            habilitar(inQtd,         "Nova Quantidade em Estoque (opcional)");
            habilitar(inFornecedor,  "CNPJ do Fornecedor (opcional)");
            break;
        case "AlterarVenda":
            habilitar(inProduto, "Digite o nome do produto");
            habilitar(inMes,     "Mês [1-12]");
            habilitar(inQtd,     "Quantidade vendida no mês");
            break;
        case "Comprar":
            habilitar(inProduto,     "Digite o nome do produto");
            habilitar(inQtd,         "Quantidade comprada");
            habilitar(inPrecoCompra, "Novo Preço de Compra (opcional)");
            habilitar(inPrecoVenda,  "Novo Preço de Venda (opcional)");
            habilitar(inFornecedor,  "CNPJ do Fornecedor (opcional)");
            break;
        case "Vender":
            habilitar(inProduto, "Digite o nome do produto");
            habilitar(inQtd,     "Quantidade vendida");
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
            break; // sem campos necessários
    }
    btOk.disabled = false;
});

// ── Select Fornecedor — habilita campos conforme funcionalidade ──────────────
selectFornecedor.addEventListener("change", () => {
    desabilitarCamposFornecedor();
    limparTela();
    const opcao = selectFornecedor.value;

    switch (opcao) {
        case "Cadastrar":
            habilitar(inRazaoSoc,    "Razão Social");
            habilitar(inCnpj,        "XX.XXX.XXX/XXXX-XX");
            habilitar(inTelefone,    "(XX)XXXXX-XXXX");
            habilitar(inEndereco,    "Endereço");
            habilitar(inCreditoDisp, "Crédito Disponibilizado");
            break;
        case "Excluir":
        case "Consultar":
            habilitar(inCnpj, "XX.XXX.XXX/XXXX-XX");
            break;
        case "Alterar":
            habilitar(inCnpj,        "XX.XXX.XXX/XXXX-XX");
            habilitar(inRazaoSoc,    "Nova Razão Social (opcional)");
            habilitar(inTelefone,    "Novo Telefone (opcional)");
            habilitar(inEndereco,    "Novo Endereço (opcional)");
            habilitar(inCreditoDisp, "Novo Crédito (opcional)");
            break;
        case "FiltrarLimCred":
            habilitar(inCreditoDisp, "Crédito mínimo");
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
    const opcao       = selectProduto.value;
    const descricao   = inProduto.value.trim();
    const precoCompra = Number(inPrecoCompra.value);
    const precoVenda  = Number(inPrecoVenda.value);
    const qtd         = Number(inQtd.value);
    const mes         = Number(inMes.value);
    const cnpjForn    = inFornecedor.value.trim();

    switch (opcao) {
        case "Cadastrar":
            if (descricao == "" || precoCompra == 0) {
                exibirMensagem("Os campos Produto e Preço de Compra são obrigatórios!", "red");
            } else if (controller.cadastrarProduto(descricao, precoCompra, qtd)) {
                exibirMensagem(`Produto "${descricao}" cadastrado com sucesso!`, "blue");
            } else {
                exibirMensagem(`Erro! Já existe um produto com a descrição "${descricao}"!`, "red");
            }
            break;

        case "Excluir":
            if (descricao == "") {
                exibirMensagem("O campo Produto é obrigatório!", "red");
            } else if (controller.excluirProduto(descricao)) {
                exibirMensagem(`Produto "${descricao}" excluído com sucesso!`, "blue");
            } else {
                exibirMensagem(`Erro! Produto "${descricao}" não encontrado!`, "red");
            }
            break;

        case "Alterar": {
            if (descricao == "") {
                exibirMensagem("O campo Produto é obrigatório!", "red");
            } else {
                const resultado = controller.alterarProduto(descricao, precoCompra, precoVenda, qtd, cnpjForn);
                const msgs = {
                    "SUCESSO":                   { cor: "blue", texto: "Produto alterado com sucesso!" },
                    "PRODUTO_NAO_ENCONTRADO":    { cor: "red",  texto: `Erro! Produto "${descricao}" não encontrado!` },
                    "FORNECEDOR_NAO_ENCONTRADO": { cor: "red",  texto: `Erro! Fornecedor com CNPJ "${cnpjForn}" não encontrado!` }
                };
                exibirMensagem(msgs[resultado].texto, msgs[resultado].cor);
            }
            break;
        }

        case "AlterarVenda": {
            if (descricao == "" || mes == 0 || qtd == 0) {
                exibirMensagem("Os campos Produto, Mês e Quantidade são obrigatórios!", "red");
            } else {
                const resultado = controller.alterarVendaMes(descricao, mes, qtd);
                const msgs = {
                    "SUCESSO":                { cor: "blue", texto: "Venda mensal atualizada com sucesso!" },
                    "PRODUTO_NAO_ENCONTRADO": { cor: "red",  texto: `Produto "${descricao}" não encontrado!` },
                    "MES_INVALIDO":           { cor: "red",  texto: "Mês inválido! Informe um valor entre 1 e 12." }
                };
                exibirMensagem(msgs[resultado].texto, msgs[resultado].cor);
            }
            break;
        }

        case "Consultar": {
            if (descricao == "") {
                exibirMensagem("O campo Produto é obrigatório!", "red");
            } else {
                const dados = controller.consultarProduto(descricao);
                if (dados != undefined) {
                    exibirMensagem(
                        `Descrição: ${dados.descricao}\n` +
                        `Preço de Compra: R$ ${dados.precoCompra.toFixed(2)}\n` +
                        `Preço de Venda: R$ ${dados.precoVenda.toFixed(2)}\n` +
                        `Quantidade em Estoque: ${dados.qtdEstoque}\n` +
                        `Fornecedor: ${dados.cnpjForn ? dados.cnpjForn + " - " + dados.nomeForn : "Não vinculado"}`,
                        "blue"
                    );
                } else {
                    exibirMensagem(`Produto "${descricao}" não encontrado!`, "red");
                }
            }
            break;
        }

        case "Comprar": {
            if (descricao == "" || qtd == 0) {
                exibirMensagem("Os campos Produto e Quantidade são obrigatórios!", "red");
            } else {
                const resultado = controller.comprarProduto(descricao, qtd, precoCompra, precoVenda, cnpjForn);
                const msgs = {
                    "SUCESSO":                   { cor: "blue", texto: `Compra de "${descricao}" registrada com sucesso!` },
                    "PRODUTO_NAO_ENCONTRADO":    { cor: "red",  texto: `Erro! Produto "${descricao}" não encontrado!` },
                    "FORNECEDOR_NAO_ENCONTRADO": { cor: "red",  texto: `Erro! Fornecedor com CNPJ "${cnpjForn}" não encontrado!` },
                    "CREDITO_INSUFICIENTE":      { cor: "red",  texto: "Erro! O valor total da compra excede o crédito disponibilizado pelo Fornecedor!" }
                };
                exibirMensagem(msgs[resultado].texto, msgs[resultado].cor);
            }
            break;
        }

        case "Vender": {
            if (descricao == "" || qtd == 0) {
                exibirMensagem("Os campos Produto e Quantidade são obrigatórios!", "red");
            } else {
                const resultado = controller.venderProduto(descricao, qtd);
                if (resultado.codigo === "SUCESSO") {
                    exibirMensagem(
                        `Venda registrada! Total: R$ ${resultado.totalVenda.toFixed(2)}`,
                        "blue"
                    );
                } else if (resultado.codigo === "PRODUTO_NAO_ENCONTRADO") {
                    exibirMensagem(`Erro! Produto "${descricao}" não encontrado!`, "red");
                } else {
                    exibirMensagem(
                        `Erro! Estoque insuficiente. Estoque atual: ${resultado.estoqueAtual} unidades.`,
                        "red"
                    );
                }
            }
            break;
        }

        case "ConsultarQtd": {
            if (descricao == "") {
                exibirMensagem("O campo Produto é obrigatório!", "red");
            } else {
                const dados = controller.consultarTotalVendasAno(descricao);
                if (dados != undefined) {
                    exibirMensagem(
                        `Produto: ${dados.descricao}\nTotal vendido no ano: ${dados.totalVendas} unidades`,
                        "blue"
                    );
                } else {
                    exibirMensagem(`Produto "${descricao}" não encontrado!`, "red");
                }
            }
            break;
        }

        case "ConsultarProd": {
            if (mes == 0) {
                exibirMensagem("O campo Mês é obrigatório!", "red");
            } else {
                const dados = controller.consultarMaisVendidoMes(mes);
                if (dados != undefined) {
                    exibirMensagem(
                        `Produto mais vendido no mês ${mes}:\n` +
                        `${dados.descricao} — ${dados.qtdVendida} unidades`,
                        "blue"
                    );
                } else {
                    exibirMensagem("Nenhum produto cadastrado!", "red");
                }
            }
            break;
        }

        case "Faturamento": {
            if (mes == 0) {
                exibirMensagem("O campo Mês é obrigatório!", "red");
            } else {
                const dados = controller.consultarFaturamentoMes(mes);
                exibirMensagem(
                    `Faturamento do mês ${dados.mes}: R$ ${dados.faturamento.toFixed(2)}`,
                    "blue"
                );
            }
            break;
        }

        case "FiltrarQtdEst": {
            if (qtd == 0) {
                exibirMensagem("O campo Quantidade é obrigatório!", "red");
            } else {
                const lista = controller.listarProdutos()
                    .filter(p => p.qtdEstoque <= qtd);
                if (lista.length > 0) {
                    sectionResult.appendChild(criarTabelaProdutos(lista));
                } else {
                    exibirMensagem("Nenhum produto encontrado com essa quantidade.", "red");
                }
            }
            break;
        }

        case "ListarProdutos":
            const listaProd = controller.listarProdutos();
            if (listaProd.length > 0) {
                sectionResult.appendChild(criarTabelaProdutos(listaProd));
            } else {
                exibirMensagem("Nenhum produto cadastrado!", "red");
            }
            break;

        case "ListarVendas":
            const listaVendas = controller.listarTabelaVendasAnual();
            if (listaVendas.length > 0) {
                sectionResult.appendChild(criarTabelaVendas(listaVendas));
            } else {
                exibirMensagem("Nenhum produto cadastrado!", "red");
            }
            break;

        case "ListarProdFornecedor": {
            if (cnpjForn == "") {
                exibirMensagem("O campo CNPJ do Fornecedor é obrigatório!", "red");
            } else {
                const lista = controller.listarProdutosFornecedor(cnpjForn);
                if (lista == undefined) {
                    exibirMensagem(`Fornecedor com CNPJ "${cnpjForn}" não encontrado!`, "red");
                } else if (lista.length === 0) {
                    exibirMensagem("Nenhum produto vinculado a este fornecedor.", "red");
                } else {
                    sectionResult.appendChild(criarTabelaProdutos(lista));
                }
            }
            break;
        }
    }
}

function executarOpcaoFornecedor() {
    const opcao      = selectFornecedor.value;
    const razaoSoc   = inRazaoSoc.value.trim();
    const cnpj       = inCnpj.value.trim();
    const telefone   = inTelefone.value.trim();
    const endereco   = inEndereco.value.trim();
    const credito    = Number(inCreditoDisp.value);

    switch (opcao) {
        case "Cadastrar":
            if (razaoSoc == "" || cnpj == "") {
                exibirMensagem("Razão Social e CNPJ são obrigatórios!", "red");
            } else if (controller.cadastrarFornecedor(razaoSoc, cnpj, telefone, endereco, credito)) {
                exibirMensagem(`Fornecedor "${razaoSoc}" cadastrado com sucesso!`, "blue");
            } else {
                exibirMensagem(`Erro! Já existe um fornecedor com o CNPJ "${cnpj}"!`, "red");
            }
            break;

        case "Excluir": {
            if (cnpj == "") {
                exibirMensagem("O campo CNPJ é obrigatório!", "red");
            } else {
                const resultado = controller.excluirFornecedor(cnpj);
                const msgs = {
                    "SUCESSO":                   { cor: "blue", texto: "Fornecedor excluído com sucesso!" },
                    "FORNECEDOR_NAO_ENCONTRADO": { cor: "red",  texto: `Erro! Fornecedor com CNPJ "${cnpj}" não encontrado!` },
                    "FORNECEDOR_COM_PRODUTOS":   { cor: "red",  texto: "Erro! Não é possível excluir: fornecedor possui produtos vinculados!" }
                };
                exibirMensagem(msgs[resultado].texto, msgs[resultado].cor);
            }
            break;
        }

        case "Alterar":
            if (cnpj == "") {
                exibirMensagem("O campo CNPJ é obrigatório!", "red");
            } else if (controller.alterarFornecedor(cnpj, razaoSoc, telefone, endereco, credito)) {
                exibirMensagem("Fornecedor alterado com sucesso!", "blue");
            } else {
                exibirMensagem(`Erro! Fornecedor com CNPJ "${cnpj}" não encontrado!`, "red");
            }
            break;

        case "Consultar": {
            if (cnpj == "") {
                exibirMensagem("O campo CNPJ é obrigatório!", "red");
            } else {
                const dados = controller.consultarFornecedor(cnpj);
                if (dados != undefined) {
                    exibirMensagem(
                        `Razão Social: ${dados.razaoSocial}\n` +
                        `CNPJ: ${dados.cnpj}\n` +
                        `Telefone: ${dados.telefone}\n` +
                        `Endereço: ${dados.endereco}\n` +
                        `Crédito Disponibilizado: R$ ${dados.creditoDisp.toFixed(2)}`,
                        "blue"
                    );
                } else {
                    exibirMensagem(`Fornecedor com CNPJ "${cnpj}" não encontrado!`, "red");
                }
            }
            break;
        }

        case "Listar":
            const listaForn = controller.listarFornecedores();
            if (listaForn.length > 0) {
                sectionResult.appendChild(criarTabelaFornecedores(listaForn));
            } else {
                exibirMensagem("Nenhum fornecedor cadastrado!", "red");
            }
            break;

        case "FiltrarLimCred": {
            if (credito == 0) {
                exibirMensagem("O campo Crédito Disponibilizado é obrigatório!", "red");
            } else {
                const lista = controller.filtrarFornecedoresPorCredito(credito);
                if (lista.length > 0) {
                    sectionResult.appendChild(criarTabelaFornecedores(lista));
                } else {
                    exibirMensagem("Nenhum fornecedor encontrado com esse limite de crédito.", "red");
                }
            }
            break;
        }
    }
}

// ── Funções auxiliares da View ────────────────────────────────────────────────

function habilitar(campo, placeholder) {
    campo.disabled    = false;
    campo.placeholder = placeholder;
}

function desabilitarCamposProduto() {
    [inProduto, inPrecoCompra, inPrecoVenda, inQtd, inMes, inFornecedor].forEach(c => {
        c.disabled = true; c.value = ""; c.placeholder = "";
    });
    btOk.disabled = true;
}

function desabilitarCamposFornecedor() {
    [inRazaoSoc, inCnpj, inTelefone, inEndereco, inCreditoDisp].forEach(c => {
        c.disabled = true; c.value = ""; c.placeholder = "";
    });
    btOk.disabled = true;
}

function limparTela() {
    outResultado.textContent = "";
    sectionResult.innerHTML  = "";
}

function exibirMensagem(texto, cor) {
    outResultado.style.color = cor;
    outResultado.textContent = texto;
}

function criarTabelaProdutos(lista) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const trHead = document.createElement("tr");
    ["Descrição", "Preço Compra", "Preço Venda", "Estoque", "Total Vendas", "Fornecedor"].forEach(txt => {
        const th = document.createElement("th");
        th.textContent = txt;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    lista.forEach(p => {
        const tr = document.createElement("tr");
        [
            p.descricao,
            `R$ ${p.precoCompra.toFixed(2)}`,
            `R$ ${p.precoVenda.toFixed(2)}`,
            p.qtdEstoque,
            p.totalAno,
            p.cnpjForn ? `${p.cnpjForn} - ${p.nomeForn}` : "—"
        ].forEach(val => {
            const td = document.createElement("td");
            td.textContent = val;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;
}

function criarTabelaVendas(lista) {
    const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const trHead = document.createElement("tr");
    ["Produto", ...meses, "Total Ano"].forEach(txt => {
        const th = document.createElement("th");
        th.textContent = txt;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    lista.forEach(p => {
        const tr = document.createElement("tr");
        [p.descricao, ...p.vendasMensais, p.totalAno].forEach(val => {
            const td = document.createElement("td");
            td.textContent = val;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;
}

function criarTabelaFornecedores(lista) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const trHead = document.createElement("tr");
    ["Razão Social", "CNPJ", "Telefone", "Endereço", "Crédito Disp."].forEach(txt => {
        const th = document.createElement("th");
        th.textContent = txt;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    lista.forEach(f => {
        const tr = document.createElement("tr");
        [f.razaoSocial, f.cnpj, f.telefone, f.endereco, `R$ ${f.creditoDisp.toFixed(2)}`].forEach(val => {
            const td = document.createElement("td");
            td.textContent = val;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;
}
