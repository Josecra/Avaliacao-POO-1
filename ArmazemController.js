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

    alterarProduto() {

    }

    alterarVendaMes() {

    }

    comprarProduto() {

    }

    venderProduto() {

    }

    consultarTotalVendasAno() {

    }

    consultarMaisVendidoMes() {

    }

    consultarFaturamentoMes() {

    }

    listarProdutos() {

    }

    listarTabelaVendasAnual() {

    }

    listarProdutosFornecedor() {

    }

    //Persistência

    carregarDados() {
        // Limpa os vetores atuais antes de carregar
        var vetFornecedoresSalvos = [];
        var vetProdutosSalvos = [];

        // Carrega e reconstrói os fornecedores
        const fornecedoresSalvos = localStorage.getItem("fornecedoresSalvos");
        if (fornecedoresSalvos) {
            vetFornecedoresSalvos = JSON.parse(fornecedoresSalvos);

        }

        if (vetFornecedoresSalvos.length > 0) {
            vetFornecedoresSalvos.forEach((objLitFornecedor) => {this.#vetArmazem.push(new Fornecedor(objLitFornecedor.razaoSocial,
            objLitFornecedor.cnpj, objLitFornecedor.telefone, objLitFornecedor.endereco, objLitFornecedor.credito))});

        }

        // Carrega e reconstrói os produtos
        const produtosSalvos = localStorage.getItem("produtosSalvos");
        if (produtosSalvos) {
            vetProdutosSalvos = JSON.parse(produtosSalvos);

        }

        if (vetProdutosSalvos.length > 0){
            vetProdutosSalvos.forEach((objLitProdutos) => {this.#vetProdutos.push(new Produto(objLitProdutos._descricao, objLitProdutos._precoCompra,
            objLitProdutos._precoVenda, objLitProdutos._fornecedor, objLitProdutos._qtdEstoque, objLitProdutos._vendasMensais))})
        }
    }

    salvarDados() {
        if (this.#vetArmazem.length > 0) {
            var strJSONvetArmazem = "[" + this.#vetArmazem[0].stringify();
            for (let i = 1; i < this.#vetArmazem.length; i++) {
                strJSONvetArmazem += "," + this.#vetArmazem[i].stringify();
            }
            strJSONvetArmazem += "\n]"

            localStorage.setItem("fornecedoresSalvos", strJSONVetArmazem)
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

