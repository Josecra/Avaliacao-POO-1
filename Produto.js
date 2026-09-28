/**
 * Classe Produto (Model)
 * Representa um produto do armazém, associado opcionalmente a um Fornecedor.
 */

class Produto {
    #descricao;
    #precoCompra;
    #precoVenda;
    #qtdEstoque;
    #vendasMensais; // array com 12 posições (índices 0..11 = Jan..Dez)
    #fornecedor; // referência a um objeto Fornecedor (ou undefined)

    constructor(_descricao, _precoCompra, _precoVenda, _qtdEstoque,
        _vendasMensais = new Array(12).fill(0), _fornecedor = undefined) { /*cria um vetor com 12 posições de janeiro a dez,
            todos definidos como zero. De zero vendas no mês.*/

        this.#descricao = _descricao;
        this.#precoCompra = _precoCompra;
        this.#precoVenda = _precoVenda;
        this.#qtdEstoque = _qtdEstoque;
        this.#vendasMensais = _vendasMensais;
        this.#fornecedor = _fornecedor;
    }

    get descricao() {
        return this.#descricao;
    }

    set descricao(novaDescricao) {
        if (novaDescricao != "") {
            this.#descricao = novaDescricao.toUpperCase();
        }
    }

    get precoCompra() {
        return this.#precoCompra;
    }

    set precoCompra(novoPreco) {
        if (novoPreco > 0) this.#precoCompra = novoPreco;
    }

    get precoVenda() {
        return this.#precoVenda;
    }

    set precoVenda(novoPreco) {
        if (novoPreco > 0) this.#precoVenda = novoPreco;
    }



    get qtdEstoque() {
        return this.#qtdEstoque;
    }

    set qtdEstoque(novoQtdEstoque) {
        if (novoQtdEstoque >= 0) {
            this.#qtdEstoque = novoQtdEstoque;
        }
    }

    // Retorna cópia do array para preservar encapsulamento

    get vendasMensais() {
        return [...this.#vendasMensais];
    }

    set vendasMensais(novasVendas) {
        if (Array.isArray(novasVendas) && novasVendas === 12) {
            for (let i = 0; i < novasVendas.length; i++) {
                if (novasVendas[i] < 0) {
                    novasVendas[i] = 0;
                }
            }
            this.#vendasMensais = [...novasVendas];
        }
    }

    get fornecedor() {
        return this.#fornecedor;
    }

    set fornecedor(novoFornecedor) {
        this.#fornecedor = novoFornecedor;
    }

    /**
     * Retorna o total vendido no ano (soma das vendas mensais).
     */

    get totalAno() {
        let soma = 0;
        for (let i = 0; i < this.#vendasMensais.length; i++) {
            soma += this.#vendasMensais[i];
        }
        return soma;
    }

    toString() {
        let fornecedor;
        if (this.#fornecedor) {                    // ← só entra aqui se NÃO for undefined
            fornecedor = this.#fornecedor.cnpj + " - " + this.#fornecedor.razaoSocial;
        } else {                                   // ← produto sem fornecedor
            fornecedor = "Não vinculado";
        }

         return "Descrição: " + this.#descricao + "\n" +
        "Preço de Compra: R$ " + this.#precoCompra.toFixed(2) + "\n" +
        "Preço de Venda: R$ " + this.#precoVenda.toFixed(2) + "\n" +
        "Quantidade em Estoque: " + this.#qtdEstoque + "\n" +
        "Vendas Mensais: [" + this.#vendasMensais.join(", ") + "]\n" +
        "Fornecedor: " + fornecedor;
    }

    /**
     * Gera uma string JSON com os atributos do produto.
     * O fornecedor é gravado apenas pelo CNPJ (evita duplicação de dados
     * e ciclos de referência no JSON).
     */
    stringify() {
        return JSON.stringify({
            descricao: this.#descricao,
            precoCompra: this.#precoCompra,
            precoVenda: this.#precoVenda,
            qtdEstoque: this.#qtdEstoque,
            vendasMensais: this.#vendasMensais,
            cnpjForn: this.#fornecedor ? this.#fornecedor.cnpj : null
        });
    }
}