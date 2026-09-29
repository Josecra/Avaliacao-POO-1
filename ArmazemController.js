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

    }

    salvarDados() {

    }
}

