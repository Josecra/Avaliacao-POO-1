import { Fornecedor } from './Fornecedor.js';
import { Produto } from './Produto.js';

export class ArmazemController {
    #vetArmazem;
    #vetProdutos;

    constructor() {
        this.#vetArmazem = [];
        this.#vetProdutos = [];
    }

    // ══════════════════════════════════════════════════════════════════
    // MÉTODOS DE FORNECEDOR
    // ══════════════════════════════════════════════════════════════════

    cadastraFornecedor(razao_social, endereco, telefone, cnpj, credito) {
        let fornecedor = this.pesquisarFornecedor(cnpj);

        if (fornecedor == undefined) {
            // ─── AJUSTE: ordem dos parâmetros do construtor do Fornecedor.
            // O construtor espera (razaoSocial, cnpj, telefone, endereco, credito).
            this.#vetArmazem.push(new Fornecedor(razao_social, cnpj, telefone, endereco, credito));
            this.salvarDados();
            return true;
        }
        return false;
    }

    pesquisarFornecedor(cnpj) {
        return this.#vetArmazem.find(
            (fornecedor) => fornecedor.cnpj == cnpj);
    }

    excluirFornecedor(infoCNPJ) {
        let indFornecedor = this.#vetArmazem.findIndex((fornecedor) =>
            fornecedor.cnpj == infoCNPJ);

        if (indFornecedor == -1) {
            return false;
        } else {
            this.#vetArmazem.splice(indFornecedor, 1);
            this.salvarDados();
            return true;
        }
    }

    alterarFornecedor(razao_social, endereco, telefone, cnpj, credito) {
        let objFornecedor = this.#vetArmazem.find(
            (fornecedor) => fornecedor.cnpj == cnpj);

        if (objFornecedor != undefined) {
            // ─── AJUSTE: os setters do Fornecedor são razaoSocial, telefone,
            // endereco e credito (camelCase), não razao_social.
            objFornecedor.razaoSocial = razao_social;
            objFornecedor.telefone = telefone;
            objFornecedor.endereco = endereco;
            objFornecedor.credito = credito;
            this.salvarDados();
            return true;
        }
        return false;
    }

    /**
     * ─── AJUSTE: método novo. A View chama consultarFornecedor(cnpj),
     * mas ele não existia. Retorna um DTO (objeto literal).
     */
    consultarFornecedor(cnpj) {
        let objFornecedor = this.pesquisarFornecedor(cnpj);

        if (objFornecedor == undefined) {
            return undefined;
        }

        return {
            razaoSocial: objFornecedor.razaoSocial,
            cnpj: objFornecedor.cnpj,
            telefone: objFornecedor.telefone,
            endereco: objFornecedor.endereco,
            credito: objFornecedor.credito
        };
    }

    listarFornecedores() {
        var vetObjFornecedores = [];
        this.#vetArmazem.forEach((fornecedor) => {
            vetObjFornecedores.push({
                razaoSocial: fornecedor.razaoSocial,
                cnpj: fornecedor.cnpj,
                endereco: fornecedor.endereco,
                telefone: fornecedor.telefone,
                credito: fornecedor.credito
            })
        })
        return vetObjFornecedores;
    }

    filtrarFornecedoresPorCredito(creditoFiltrado) {
        // ─── AJUSTE: a tarefa pede "a partir de", então usamos >= e não ==.
        var vetCreditosFiltrados = this.#vetArmazem.filter((fornecedor) =>
            fornecedor.credito >= creditoFiltrado);

        var vetObjFornecedores = [];
        vetCreditosFiltrados.forEach((fornecedor) => {
            vetObjFornecedores.push({
                razaoSocial: fornecedor.razaoSocial,
                cnpj: fornecedor.cnpj,
                endereco: fornecedor.endereco,
                telefone: fornecedor.telefone,
                credito: fornecedor.credito
            })
        })
        return vetObjFornecedores;
    }

    // ══════════════════════════════════════════════════════════════════
    // MÉTODOS DE PRODUTO
    // ══════════════════════════════════════════════════════════════════

    /**
     * Cadastra um novo produto.
     * Não permite descrição duplicada.
     */
    cadastrarProduto(descricao, precoCompra, precoVenda, qtdEstoque) {
        // ─── AJUSTE: o método se chamava "cadastrarProdutos" (plural) e
        // tinha uma linha "this.pesquisarFornecedor(cnpj)" com uma
        // variável "cnpj" que não existia. Removi essa linha porque um
        // produto pode ser cadastrado sem fornecedor.
        let objProduto = this.#vetProdutos.find((produto) =>
            produto.descricao == descricao.toUpperCase());

        if (objProduto == undefined) {
            this.#vetProdutos.push(new Produto(descricao, precoCompra, precoVenda, qtdEstoque));
            this.salvarDados();
            return true;
        }
        return false;
    }

    /**
     * Exclui um produto pela descrição.
     */
    excluirProduto(infoDesc) {
        // ─── AJUSTE: era "produto._descricao" (com underscore). O getter
        // é "descricao". Também adicionei toUpperCase() para busca
        // case-insensitive.
        let indProduto = this.#vetProdutos.findIndex((produto) =>
            produto.descricao == infoDesc.toUpperCase());

        if (indProduto == -1) {
            return false;
        } else {
            this.#vetProdutos.splice(indProduto, 1);
            this.salvarDados();
            return true;
        }
    }

    /**
     * Altera dados de um produto. Apenas os campos informados (> 0) são
     * alterados. Se o CNPJ do fornecedor for informado, verifica se
     * existe antes de vincular.
     *
     * Retorna: "SUCESSO" | "PRODUTO_NAO_ENCONTRADO"
     *        | "FORNECEDOR_NAO_ENCONTRADO"
     */
    alterarProduto(descricao, precoCompra, precoVenda, qtdEstoque, cnpjForn) {
        let objProduto = this.#vetProdutos.find((produto) =>
            produto.descricao == descricao.toUpperCase());

        if (objProduto == undefined) {
            return "PRODUTO_NAO_ENCONTRADO";
        }

        if (precoCompra > 0) {
            objProduto.precoCompra = precoCompra;
        }
        if (precoVenda > 0) {
            objProduto.precoVenda = precoVenda;
        }
        if (qtdEstoque > 0) {
            objProduto.qtdEstoque = qtdEstoque;
        }

        // Só altera o fornecedor se o usuário informou um CNPJ não vazio
        if (cnpjForn != "") {
            let objFornecedor = this.pesquisarFornecedor(cnpjForn);
            if (objFornecedor == undefined) {
                return "FORNECEDOR_NAO_ENCONTRADO";
            }
            objProduto.fornecedor = objFornecedor;
        }

        this.salvarDados();
        return "SUCESSO";
    }

    /**
     * Altera a quantidade vendida de um produto em um mês específico.
     * Retorna: "SUCESSO" | "PRODUTO_NAO_ENCONTRADO" | "MES_INVALIDO"
     */
    alterarVendaMes(descricao, mes, qtdVendida) {
        if (mes < 1 || mes > 12) {
            return "MES_INVALIDO";
        }

        let objProduto = this.#vetProdutos.find((produto) =>
            produto.descricao == descricao.toUpperCase());

        if (objProduto == undefined) {
            return "PRODUTO_NAO_ENCONTRADO";
        }

        let vetVendas = objProduto.vendasMensais;
        vetVendas[mes - 1] = qtdVendida;
        objProduto.vendasMensais = vetVendas;

        this.salvarDados();
        return "SUCESSO";
    }

    /**
 * Consulta um produto pela descrição.
 * Retorna um DTO (objeto literal) com os dados do produto — incluindo
 * os dados do fornecedor, se houver um vinculado — ou undefined caso
 * o produto não seja encontrado.
 */
consultarProduto(descricao) {
    let objProduto = this.#vetProdutos.find((produto) =>
        produto.descricao == descricao.toUpperCase());

    if (objProduto == undefined) {
        return undefined;
    }

    return this.#produtoParaDTO(objProduto);
}

    /**
     * Registra a compra de um produto (aumenta o estoque).
     * Retorna: "SUCESSO" | "PRODUTO_NAO_ENCONTRADO"
     *        | "FORNECEDOR_NAO_ENCONTRADO" | "CREDITO_INSUFICIENTE"
     */
    comprarProduto(descricao, qtdComprada, novoPrecoCompra, novoPrecoVenda, cnpjForn) {
        let objProduto = this.#vetProdutos.find((produto) =>
            produto.descricao == descricao.toUpperCase());

        if (objProduto == undefined) {
            return "PRODUTO_NAO_ENCONTRADO";
        }

        // 1) Se informou novo CNPJ, verifica se existe e vincula
        if (cnpjForn != "") {
            let objFornecedor = this.pesquisarFornecedor(cnpjForn);
            if (objFornecedor == undefined) {
                return "FORNECEDOR_NAO_ENCONTRADO";
            }
            objProduto.fornecedor = objFornecedor;
        }

        // 2) Verifica crédito do fornecedor vinculado
        let precoParaCalculo = objProduto.precoCompra;
        if (novoPrecoCompra > 0) {
            precoParaCalculo = novoPrecoCompra;
        }

        let totalCompra = qtdComprada * precoParaCalculo;

        if (objProduto.fornecedor != undefined &&
            totalCompra > objProduto.fornecedor.credito) {
            return "CREDITO_INSUFICIENTE";
        }

        // 3) Atualiza preços, se informados
        if (novoPrecoCompra > 0) {
            objProduto.precoCompra = novoPrecoCompra;
        }
        if (novoPrecoVenda > 0) {
            objProduto.precoVenda = novoPrecoVenda;
        }

        // 4) Atualiza o estoque
        objProduto.qtdEstoque = objProduto.qtdEstoque + qtdComprada;

        this.salvarDados();
        return "SUCESSO";
    }

    /**
     * Registra a venda de um produto (abate do estoque e atualiza a
     * venda do mês atual).
     *
     * Retorna objeto:
     *   { codigo: "SUCESSO", totalVenda }
     *   { codigo: "PRODUTO_NAO_ENCONTRADO" }
     *   { codigo: "ESTOQUE_INSUFICIENTE", estoqueAtual }
     */
    venderProduto(descricao, qtdVendida) {
        let objProduto = this.#vetProdutos.find((produto) =>
            produto.descricao == descricao.toUpperCase());

        if (objProduto == undefined) {
            return { codigo: "PRODUTO_NAO_ENCONTRADO" };
        }

        if (objProduto.qtdEstoque < qtdVendida) {
            return {
                codigo: "ESTOQUE_INSUFICIENTE",
                estoqueAtual: objProduto.qtdEstoque
            };
        }

        objProduto.qtdEstoque = objProduto.qtdEstoque - qtdVendida;

        // Registra na venda do mês atual (getMonth retorna 0..11)
        let mesAtual = new Date().getMonth() + 1;
        let vetVendas = objProduto.vendasMensais;
        vetVendas[mesAtual - 1] += qtdVendida;
        objProduto.vendasMensais = vetVendas;

        let totalVenda = qtdVendida * objProduto.precoVenda;

        this.salvarDados();
        return { codigo: "SUCESSO", totalVenda: totalVenda };
    }

    /**
     * Consulta o total vendido no ano por um produto.
     */
    consultarTotalVendasAno(descricao) {
        let objProduto = this.#vetProdutos.find((produto) =>
            produto.descricao == descricao.toUpperCase());

        if (objProduto == undefined) {
            return undefined;
        }

        return {
            descricao: objProduto.descricao,
            totalVendas: objProduto.totalAno
        };
    }

    /**
     * Consulta o produto mais vendido em um mês (1..12).
     */
    consultarMaisVendidoMes(mes) {
        if (this.#vetProdutos.length == 0) {
            return undefined;
        }

        let objMaisVendido = this.#vetProdutos[0];
        let maiorQtd = objMaisVendido.vendasMensais[mes - 1];

        for (let i = 1; i < this.#vetProdutos.length; i++) {
            let qtdAtual = this.#vetProdutos[i].vendasMensais[mes - 1];
            if (qtdAtual > maiorQtd) {
                maiorQtd = qtdAtual;
                objMaisVendido = this.#vetProdutos[i];
            }
        }

        return {
            descricao: objMaisVendido.descricao,
            qtdVendida: maiorQtd
        };
    }

    /**
     * Faturamento de um mês: soma (qtdVendida * precoVenda) de cada produto.
     */
    consultarFaturamentoMes(mes) {
        var faturamento = 0;

        this.#vetProdutos.forEach((produto) => {
            let qtdVendida = produto.vendasMensais[mes - 1];
            faturamento += qtdVendida * produto.precoVenda;
        });

        return { mes: mes, faturamento: faturamento };
    }

    /**
     * Lista todos os produtos como DTOs.
     */
    listarProdutos() {
        var vetObjProdutos = [];
        this.#vetProdutos.forEach((produto) => {
            vetObjProdutos.push(this.#produtoParaDTO(produto));
        })
        return vetObjProdutos;
    }

    /**
     * Tabela de vendas anual: descrição, 12 meses e total do ano.
     */
    listarTabelaVendasAnual() {
        var vetObjVendas = [];
        this.#vetProdutos.forEach((produto) => {
            vetObjVendas.push({
                descricao: produto.descricao,
                vendasMensais: produto.vendasMensais,
                totalAno: produto.totalAno
            });
        })
        return vetObjVendas;
    }

    /**
     * Filtra produtos com estoque menor ou igual ao valor informado.
     */
    filtrarProdutosPorEstoque(qtdMaxima) {
        var vetFiltrados = [];
        this.#vetProdutos.forEach((produto) => {
            if (produto.qtdEstoque <= qtdMaxima) {
                vetFiltrados.push(this.#produtoParaDTO(produto));
            }
        })
        return vetFiltrados;
    }

    /**
     * Lista os produtos de um fornecedor pelo CNPJ.
     * Retorna undefined se o fornecedor não existe,
     * ou array (possivelmente vazio) de DTOs.
     */
    listarProdutosFornecedor(cnpj) {
        let objFornecedor = this.pesquisarFornecedor(cnpj);

        if (objFornecedor == undefined) {
            return undefined;
        }

        var vetObjProdutos = [];
        this.#vetProdutos.forEach((produto) => {
            if (produto.fornecedor != undefined &&
                produto.fornecedor.cnpj == cnpj) {
                vetObjProdutos.push(this.#produtoParaDTO(produto));
            }
        })
        return vetObjProdutos;
    }

    /**
     * Auxiliar interno: monta um DTO (objeto literal) de Produto
     * para entregar à View. Achata os dados do fornecedor em
     * cnpjForn / nomeForn.
     */
    #produtoParaDTO(produto) {
        let cnpjForn = null;
        let nomeForn = null;

        if (produto.fornecedor != undefined) {
            cnpjForn = produto.fornecedor.cnpj;
            nomeForn = produto.fornecedor.razaoSocial;
        }

        return {
            descricao: produto.descricao,
            precoCompra: produto.precoCompra,
            precoVenda: produto.precoVenda,
            qtdEstoque: produto.qtdEstoque,
            vendasMensais: produto.vendasMensais,
            totalAno: produto.totalAno,
            cnpjForn: cnpjForn,
            nomeForn: nomeForn
        };
    }

    // ══════════════════════════════════════════════════════════════════
    // PERSISTÊNCIA
    // ══════════════════════════════════════════════════════════════════

    /**
     * Carrega fornecedores e produtos do localStorage.
     * Ordem obrigatória: fornecedores PRIMEIRO, produtos DEPOIS
     * (para religar a referência Produto → Fornecedor pelo CNPJ).
     */
    carregarDados() {
        // ─── AJUSTE: limpar os dois vetores (o código anterior limpava
        // #vetProdutos duas vezes e nunca limpava #vetArmazem).
        this.#vetArmazem = [];
        this.#vetProdutos = [];

        // 1) FORNECEDORES
        var vetFornecedoresSalvos = [];
        var strJSONFornecedores = localStorage.getItem("fornecedoresSalvos");

        if (strJSONFornecedores != null) {
            vetFornecedoresSalvos = JSON.parse(strJSONFornecedores);
        }

        if (vetFornecedoresSalvos.length > 0) {
            vetFornecedoresSalvos.forEach((objLitFornecedor) => {
                // ─── AJUSTE: ordem correta dos parâmetros do construtor
                // (razaoSocial, cnpj, telefone, endereco, credito).
                this.#vetArmazem.push(new Fornecedor(
                    objLitFornecedor.razao_social,
                    objLitFornecedor.cnpj,
                    objLitFornecedor.telefone,
                    objLitFornecedor.endereco,
                    objLitFornecedor.credito
                ));
            });
        }

        // 2) PRODUTOS — religando ao fornecedor pelo CNPJ
        var vetProdutosSalvos = [];
        var strJSONProdutos = localStorage.getItem("produtosSalvos");

        if (strJSONProdutos != null) {
            vetProdutosSalvos = JSON.parse(strJSONProdutos);
        }

        if (vetProdutosSalvos.length > 0) {
            vetProdutosSalvos.forEach((objLitProduto) => {
                // ─── AJUSTE: o JSON do Produto grava "descricao",
                // "precoCompra", "precoVenda", "qtdEstoque",
                // "vendasMensais" e "cnpjForn" (sem underscore).
                // Também religamos o fornecedor pelo CNPJ.
                var objFornecedor = undefined;
                if (objLitProduto.cnpjForn != null) {
                    objFornecedor = this.pesquisarFornecedor(objLitProduto.cnpjForn);
                }

                this.#vetProdutos.push(new Produto(
                    objLitProduto.descricao,
                    objLitProduto.precoCompra,
                    objLitProduto.precoVenda,
                    objLitProduto.qtdEstoque,
                    objLitProduto.vendasMensais,
                    objFornecedor
                ));
            });
        }
    }

    /**
     * Salva fornecedores e produtos no localStorage.
     * Usa o stringify() de cada objeto (Produto grava apenas o CNPJ
     * do fornecedor).
     */
    salvarDados() {
        if (this.#vetArmazem.length > 0) {
            var strJSONvetArmazem = "[" + this.#vetArmazem[0].stringify();
            for (let i = 1; i < this.#vetArmazem.length; i++) {
                strJSONvetArmazem += "," + this.#vetArmazem[i].stringify();
            }
            strJSONvetArmazem += "]";

            localStorage.setItem("fornecedoresSalvos", strJSONvetArmazem);
        }

        if (this.#vetProdutos.length > 0) {
            var strJSONvetProdutos = "[" + this.#vetProdutos[0].stringify();
            for (let i = 1; i < this.#vetProdutos.length; i++) {
                strJSONvetProdutos += "," + this.#vetProdutos[i].stringify();
            }
            strJSONvetProdutos += "]";

            localStorage.setItem("produtosSalvos", strJSONvetProdutos);
        }
    }
}