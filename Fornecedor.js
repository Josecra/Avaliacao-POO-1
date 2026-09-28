export class Fornecedor {
    #razao_social;
    #cnpj;
    #telefone;
    #endereco;
    #credito;

    constructor(razao_social, cnpj, telefone, endereco, credito) {
        this.#razao_social = razao_social;
        this.#cnpj = cnpj;
        this.#telefone = telefone;
        this.#endereco = endereco;
        this.#credito = credito;
    }

    get razao_social() {
        return this.#razao_social;

    }
    set razao_social(razao_social) {
        this.#razao_social = razao_social;

    }

    get cnpj() {
        return this.#cnpj;

    }

    get telefone() {
        return this.#telefone;

    }

    set telefone(telefone) {
        if (telefone > 14) {
            this.#telefone = telefone;
        }
    }

    get endereco() {
        return this.#endereco

    }

    set endereco(endereco) {
        this.#endereco = endereco;

    }

    get credito() {
        return this.#credito;

    }

    set credito(credito) {
        if (credito > 0) {
            this.#credito = credito;
        }
    }

    toString() {
        return `Razão Social: ${this.#razao_social} \n` +
            `CNPJ: ${this.#cnpj}\n` +
            `Telefone: ${this.#telefone}\n` +
            `Endereço: ${this.#endereco}\n` +
            `Crédito: ${this.#credito}\n`
    }

}