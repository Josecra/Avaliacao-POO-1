export class Fornecedor {
    #razaoSocial;
    #cnpj;
    #telefone;
    #endereco;
    #creditoDisp;

    constructor(razaoSocial, cnpj, telefone, endereco, creditoDisp) {
        this.#razaoSocial = razaoSocial;
        this.#cnpj = cnpj;
        this.#telefone = telefone;
        this.#endereco = endereco;
        this.#creditoDisp = creditoDisp;
    }

    get razaoSocial() {
        return this.#razaoSocial;

    }
    set razaoSocial(razaoSocial) {
        this.#razaoSocial = razaoSocial;

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
        return this.#creditoDisp;

    }

    set credito(credito) {
        if (credito > 0) {
            this.#creditoDisp = credito;
        }
    }

    toString() {
        return `Razão Social: ${this.#razaoSocial} \n` +
            `CNPJ: ${this.#cnpj}\n` +
            `Telefone: ${this.#telefone}\n` +
            `Endereço: ${this.#endereco}\n` +
            `Crédito: ${this.#creditoDisp}\n`
    }
    
    stringify() {
        return JSON.stringify({
            razao_social: this.#razaoSocial,
            cnpj: this.#cnpj,
            telefone: this.#telefone,
            endereco: this.#endereco,
            credito: this.#creditoDisp
        });
    }
}