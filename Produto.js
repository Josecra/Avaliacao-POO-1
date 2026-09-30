/**
 * Classe Produto (Model)
 * -----------------------------------------------------------------------
 * Representa um produto do armazém. Um produto pode ou não estar
 * associado a um Fornecedor (referência guardada em #fornecedor).
 *
 * Guarda também as vendas mensais em um vetor de 12 posições, onde o
 * índice 0 corresponde a Janeiro e o índice 11 a Dezembro.
 */

export class Produto {
    #descricao;
    #precoCompra;
    #precoVenda;
    #qtdEstoque;
    #vendasMensais;
    #fornecedor;

    /**
     * Cria um novo Produto.
     * - _vendasMensais é opcional: se não vier, inicia com 12 zeros.
     * - _fornecedor é opcional: se não vier, inicia como undefined.
     */
    constructor(_descricao, _precoCompra, _precoVenda, _qtdEstoque,
        _vendasMensais = new Array(12).fill(0),
        _fornecedor = undefined) {
        this.#descricao = _descricao.toUpperCase();
        this.#precoCompra = _precoCompra;
        this.#precoVenda = _precoVenda;
        this.#qtdEstoque = _qtdEstoque;
        this.#vendasMensais = _vendasMensais;
        this.#fornecedor = _fornecedor;
    }

    // ── Getters e Setters ────────────────────────────────────────────────

    get descricao() {
        return this.#descricao;
    }

    /**
     * Só aceita descrição não vazia. Armazena sempre em maiúsculas.
     */
    set descricao(novaDescricao) {
        if (novaDescricao != "") {
            this.#descricao = novaDescricao.toUpperCase();
        }
    }

    get precoCompra() {
        return this.#precoCompra;
    }

    /**
     * Só aceita preço de compra maior que zero.
     */
    set precoCompra(novoPreco) {
        if (novoPreco > 0) {
            this.#precoCompra = novoPreco;
        }
    }

    get precoVenda() {
        return this.#precoVenda;
    }

    /**
     * Só aceita preço de venda maior que zero.
     */
    set precoVenda(novoPreco) {
        if (novoPreco > 0) {
            this.#precoVenda = novoPreco;
        }
    }

    get qtdEstoque() {
        return this.#qtdEstoque;
    }

    /**
     * Só aceita quantidade maior ou igual a zero.
     */
    set qtdEstoque(novaQtdEstoque) {
        if (novaQtdEstoque >= 0) {
            this.#qtdEstoque = novaQtdEstoque;
        }
    }

    /**
     * Devolve uma CÓPIA do vetor de vendas mensais, para preservar o
     * encapsulamento. Quem alterar precisa devolver pelo setter.
     */
    get vendasMensais() {
        return [...this.#vendasMensais];
    }

    /**
     * Só aceita um vetor de exatamente 12 posições.
     * Valores negativos são corrigidos para 0.
     */
    set vendasMensais(novasVendas) {
        if (Array.isArray(novasVendas) && novasVendas.length === 12) {
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

    /**
     * Aceita undefined (desvincular) ou um objeto Fornecedor.
     */
    set fornecedor(novoFornecedor) {
        this.#fornecedor = novoFornecedor;
    }

    // ── Atributos calculados ─────────────────────────────────────────────

    /**
     * Total vendido no ano: soma das 12 posições de #vendasMensais.
     * É calculado a cada acesso, para nunca ficar desatualizado.
     */
    get totalAno() {
        let soma = 0;
        for (let i = 0; i < this.#vendasMensais.length; i++) {
            soma += this.#vendasMensais[i];
        }
        return soma;
    }

    // ── Representação textual e serialização ─────────────────────────────

    /**
     * Representação textual do produto. Mostra o fornecedor pelo CNPJ
     * e razão social quando houver um vinculado; caso contrário, indica
     * que o produto não possui fornecedor.
     */
    toString() {
        let strFornecedor;
        if (this.#fornecedor) {
            strFornecedor = this.#fornecedor.cnpj + " - " + this.#fornecedor.razaoSocial;
        } else {
            strFornecedor = "Não vinculado";
        }

        return "Descrição: " + this.#descricao + "\n" +
            "Preço de Compra: R$ " + this.#precoCompra.toFixed(2) + "\n" +
            "Preço de Venda: R$ " + this.#precoVenda.toFixed(2) + "\n" +
            "Quantidade em Estoque: " + this.#qtdEstoque + "\n" +
            "Vendas Mensais: [" + this.#vendasMensais.join(", ") + "]\n" +
            "Fornecedor: " + strFornecedor;
    }

    /**
     * Gera a string JSON do produto.
     *
     * O fornecedor é gravado apenas pelo CNPJ (nunca o objeto inteiro),
     * porque:
     *   1) Evita duplicação — o Fornecedor já é persistido à parte.
     *   2) Evita referência circular no JSON.
     *   3) O CNPJ funciona como chave estrangeira, permitindo religar
     *      Produto → Fornecedor no carregamento.
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