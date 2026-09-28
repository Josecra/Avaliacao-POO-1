import { Fornecedor } from './Fornecedor.js';

export class ArmazemController {
    #vetArmazem;

    constructor() {
        this.#vetArmazem = [];

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

    filtrarFornecedoresPorCredito(creditoFiltrado){
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
}