import { Fornecedor } from './Fornecedor.js';
import { Produto } from './Produto.js';

export class ArmazemController {
    #vetArmazem;
    #vetProdutos;
    constructor() {
        this.#vetArmazem = [];
        this.#vetProdutos = [];
    }

    cadastraFornecedor(razao_social, endereco, telefone, cnpj, credito) {

        let fornecedor = this.pesquisarFornecedor(cnpj);

        if (fornecedor == undefined) {
            this.#vetArmazem.push(new Fornecedor(razao_social, endereco, telefone, cnpj, credito));
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
            return true;
        }
    }

    alterarFornecedor(razao_social, endereco, telefone, cnpj, credito) {
        let objFornecedor = this.#vetArmazem.find(
            (fornecedor) => fornecedor.cnpj == cnpj);

        if (objFornecedor != undefined) {
            objFornecedor.cnpj = cnpj;
            objFornecedor.razao_social = razao_social;
            objFornecedor.endereco = endereco;
            objFornecedor.telefone = telefone;
            objFornecedor.credito = credito;
            return true;
        }
        return false;
    }

    listarFornecedores() {
        var vetObjFornecedores = [];
        this.#vetArmazem.forEach((fornecedor) => {
            vetObjFornecedores.push({
                razao_social: fornecedor.razao_social,
                cnpj: fornecedor.cnpj,
                endereco: fornecedor.endereco,
                telefone: fornecedor.telefone,
                credito: fornecedor.credito
            })
        })
        return vetObjFornecedores;
    }

    filtrarFornecedoresPorCredito(creditoFiltrado) {
        var vetCreditosFiltrados = this.#vetArmazem.filter((fornecedor => fornecedor.credito == creditoFiltrado))
        var vetObjFornecedores = []
        vetCreditosFiltrados.forEach((fornecedor) => {
            vetObjFornecedores.push({
                razao_social: fornecedor.razao_social,
                cnpj: fornecedor.cnpj,
                endereco: fornecedor.endereco,
                telefone: fornecedor.telefone,
                credito: fornecedor.credito
            })
        })
        return vetObjFornecedores;
    }

    //Seção de Produtos

    cadastrarProdutos(_descricao, _precoCompra, _precoVenda, _qtdEstoque,
        _vendasMensais, _fornecedor) {

        let fornecedor = this.pesquisarFornecedor(cnpj);

        if (fornecedor == undefined) {
            this.#vetProdutos.push(new Produto(_descricao, _precoCompra, _precoVenda, _qtdEstoque,
                _vendasMensais, _fornecedor));
            return true;
        }
        return false;
    }

    excluirProduto(infoDesc) {
        let indProduto = this.#vetProdutos.findIndex((produto) =>
            produto._descricao == infoDesc);

        if (indProduto == -1) {
            return false;

        } else {
            this.#vetProdutos.splice(indProduto, 1);
            return true;
        }
    }
    /**
         * Altera dados de um produto. Apenas os campos informados são alterados.
         * Se o CNPJ do fornecedor for informado, verifica se existe antes de vincular.
         *
         * Retorna código simbólico:
         *   "SUCESSO" | "PRODUTO_NAO_ENCONTRADO" | "FORNECEDOR_NAO_ENCONTRADO"
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
     * Retorna código simbólico:
     *   "SUCESSO" | "PRODUTO_NAO_ENCONTRADO" | "MES_INVALIDO"
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
     * Registra a compra de um produto (aumenta o estoque).
     * Retorna código simbólico:
     *   "SUCESSO" | "PRODUTO_NAO_ENCONTRADO"
     *   | "FORNECEDOR_NAO_ENCONTRADO" | "CREDITO_INSUFICIENTE"
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
     * Registra a venda de um produto (abate do estoque e atualiza
     * a venda do mês atual).
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
     * Retorna DTO { descricao, totalVendas } ou undefined.
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
     * Retorna DTO { descricao, qtdVendida } ou undefined.
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
     * Retorna DTO { mes, faturamento }.
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
     * (Necessário porque a View chama este método.)
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

    //Persistência

    /**
     * Carrega fornecedores e produtos do localStorage.
     * Ordem obrigatória: fornecedores PRIMEIRO, produtos DEPOIS
     * (para religar a referência Produto → Fornecedor pelo CNPJ).
     */
    carregarDados() {
        // Limpa os vetores atuais antes de carregar
        this.#vetProdutos = [];
        this.#vetProdutos = [];

        var vetFornecedoresSalvos = [];
        var vetProdutosSalvos = [];

        // Carrega e reconstrói os fornecedores
        const fornecedoresSalvos = localStorage.getItem("fornecedoresSalvos");
        if (fornecedoresSalvos) {
            vetFornecedoresSalvos = JSON.parse(fornecedoresSalvos);

        }

        if (vetFornecedoresSalvos.length > 0) {
            vetFornecedoresSalvos.forEach((objLitFornecedor) => {
                this.#vetArmazem.push(new Fornecedor(
                        objLitFornecedor.razao_social, 
                        objLitFornecedor.endereco,    
                        objLitFornecedor.telefone,     
                        objLitFornecedor.cnpj,        
                        objLitFornecedor.credito
                    ))
            });

        }

        // Carrega e reconstrói os produtos
        const produtosSalvos = localStorage.getItem("produtosSalvos");
        if (produtosSalvos) {
            vetProdutosSalvos = JSON.parse(produtosSalvos);

        }

        if (vetProdutosSalvos.length > 0) {
            vetProdutosSalvos.forEach((objLitProdutos) => {
                this.#vetProdutos.push(new Produto(
                    objLitProdutos._descricao,
                    objLitProdutos._precoCompra,
                    objLitProdutos._precoVenda,
                    objLitProdutos._qtdEstoque, 
                    objLitProdutos._vendasMensais, 
                    objLitProdutos._fornecedor     
                ))
            })
        }
    }

    /**
     * Salva fornecedores e produtos no localStorage.
     * Usa o stringify() de cada objeto para serializar
     * (Produto grava apenas o CNPJ do fornecedor).
     */
    salvarDados() {
        if (this.#vetArmazem.length > 0) {
            var strJSONvetArmazem = "[" + this.#vetArmazem[0].stringify();
            for (let i = 1; i < this.#vetArmazem.length; i++) {
                strJSONvetArmazem += "," + this.#vetArmazem[i].stringify();
            }
            strJSONvetArmazem += "\n]"

            localStorage.setItem("fornecedoresSalvos", strJSONvetArmazem)
        }

        if (this.#vetProdutos.length > 0) {
            var strJSONvetProdutos = "[" + this.#vetProdutos[0].stringify();
            for (let i = 1; i < this.#vetProdutos.length; i++) {
                strJSONvetProdutos += "," + this.#vetProdutos[i].stringify();
            }
            strJSONvetProdutos += "\n]"

            localStorage.setItem("produtosSalvos", strJSONvetProdutos)
        }
    }
}