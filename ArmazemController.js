/**
 * Classe ArmazemController (Controller)
 * -----------------------------------------------------------------------
 * Faz a mediação entre a View e os Models (Produto / Fornecedor).
 *
 * Regras gerais:
 *  - Todos os métodos que devolvem dados retornam DTOs (objetos
 *    literais), nunca instâncias de Produto ou Fornecedor.
 *  - Métodos com múltiplos resultados possíveis retornam códigos
 *    simbólicos em MAIÚSCULAS_COM_UNDERLINE (ex.: "SUCESSO",
 *    "PRODUTO_NAO_ENCONTRADO").
 *  - Persistência é feita via localStorage, carregando primeiro os
 *    fornecedores e depois os produtos (para religar a referência
 *    Produto → Fornecedor pelo CNPJ).
 */

import { Produto }    from "./Produto.js";
import { Fornecedor } from "./Fornecedor.js";

export class ArmazemController {
    #vetProdutos;
    #vetFornecedores;

    constructor() {
        this.#vetProdutos     = [];
        this.#vetFornecedores = [];
    }

    // ══════════════════════════════════════════════════════════════════════
    // MÉTODOS AUXILIARES PRIVADOS
    // ══════════════════════════════════════════════════════════════════════

    /**
     * Localiza um produto pela descrição (comparação case-insensitive).
     * Retorna o objeto Produto ou undefined se não encontrar.
     */
    #buscarProduto(descricao) {
        let descricaoAlvo = descricao.toUpperCase();
        return this.#vetProdutos.find(
            (produto) => produto.descricao == descricaoAlvo
        );
    }

    /**
     * Localiza um fornecedor pelo CNPJ.
     * Retorna o objeto Fornecedor ou undefined se não encontrar.
     */
    #buscarFornecedor(cnpj) {
        return this.#vetFornecedores.find(
            (fornecedor) => fornecedor.cnpj == cnpj
        );
    }

    /**
     * Monta um DTO (objeto literal) de Produto para entregar à View.
     * Achata os dados do fornecedor em cnpjForn / nomeForn, para que a
     * View não precise conhecer a classe Fornecedor.
     */
    #produtoParaDTO(produto) {
        let cnpjForn = null;
        let nomeForn = null;

        if (produto.fornecedor != undefined) {
            cnpjForn = produto.fornecedor.cnpj;
            nomeForn = produto.fornecedor.razaoSocial;
        }

        return {
            descricao:     produto.descricao,
            precoCompra:   produto.precoCompra,
            precoVenda:    produto.precoVenda,
            qtdEstoque:    produto.qtdEstoque,
            vendasMensais: produto.vendasMensais,
            totalAno:      produto.totalAno,
            cnpjForn:      cnpjForn,
            nomeForn:      nomeForn
        };
    }

    // ══════════════════════════════════════════════════════════════════════
    // MÉTODOS DE PRODUTO
    // ══════════════════════════════════════════════════════════════════════

    /**
     * Cadastra um novo produto.
     * Não permite cadastro de produtos com a mesma descrição.
     * Retorna true se cadastrou, false se já existe um com a mesma descrição.
     */
    cadastrarProduto(descricao, precoCompra, precoVenda, qtdEstoque) {
        let objProduto = this.#buscarProduto(descricao);

        if (objProduto != undefined) {
            return false;
        }

        let novoProduto = new Produto(descricao, precoCompra, precoVenda, qtdEstoque);
        this.#vetProdutos.push(novoProduto);
        this.salvarDados();
        return true;
    }

    /**
     * Exclui um produto pela descrição.
     * Retorna true se excluiu, false se não encontrou.
     */
    excluirProduto(descricao) {
        let indProduto = this.#vetProdutos.findIndex(
            (produto) => produto.descricao == descricao.toUpperCase()
        );

        if (indProduto == -1) {
            return false;
        }

        this.#vetProdutos.splice(indProduto, 1);
        this.salvarDados();
        return true;
    }

    /**
     * Altera dados de um produto. Apenas os campos informados (não vazios
     * / maiores que zero) são alterados. Se o CNPJ do fornecedor for
     * informado, verifica se existe antes de vincular.
     *
     * Retorna código simbólico:
     *   "SUCESSO"
     *   "PRODUTO_NAO_ENCONTRADO"
     *   "FORNECEDOR_NAO_ENCONTRADO"
     */
    alterarProduto(descricao, precoCompra, precoVenda, qtdEstoque, cnpjForn) {
        let objProduto = this.#buscarProduto(descricao);

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
            let objFornecedor = this.#buscarFornecedor(cnpjForn);
            if (objFornecedor == undefined) {
                return "FORNECEDOR_NAO_ENCONTRADO";
            }
            objProduto.fornecedor = objFornecedor;
        }

        this.salvarDados();
        return "SUCESSO";
    }

    /**
     * Consulta um produto pela descrição.
     * Retorna um DTO ou undefined se não encontrar.
     */
    consultarProduto(descricao) {
        let objProduto = this.#buscarProduto(descricao);

        if (objProduto == undefined) {
            return undefined;
        }

        return this.#produtoParaDTO(objProduto);
    }

    /**
     * Altera a quantidade vendida de um produto em um mês específico.
     * Retorna código simbólico:
     *   "SUCESSO"
     *   "PRODUTO_NAO_ENCONTRADO"
     *   "MES_INVALIDO"
     */
    alterarVendaMes(descricao, mes, qtdVendida) {
        if (mes < 1 || mes > 12) {
            return "MES_INVALIDO";
        }

        let objProduto = this.#buscarProduto(descricao);
        if (objProduto == undefined) {
            return "PRODUTO_NAO_ENCONTRADO";
        }

        // O getter devolve cópia; altera a cópia e devolve pelo setter
        let vetVendas = objProduto.vendasMensais;
        vetVendas[mes - 1] = qtdVendida;
        objProduto.vendasMensais = vetVendas;

        this.salvarDados();
        return "SUCESSO";
    }

    /**
     * Registra a compra de um produto (aumenta o estoque).
     * Regras:
     *  1) Produto precisa existir.
     *  2) Se o CNPJ do fornecedor foi informado, ele precisa existir;
     *     nesse caso, o produto é vinculado a ele.
     *  3) O total da compra (qtd * preço de compra) não pode exceder o
     *     crédito do fornecedor vinculado.
     *  4) Preços só são alterados se o usuário informar (> 0).
     *
     * Retorna código simbólico:
     *   "SUCESSO"
     *   "PRODUTO_NAO_ENCONTRADO"
     *   "FORNECEDOR_NAO_ENCONTRADO"
     *   "CREDITO_INSUFICIENTE"
     */
    comprarProduto(descricao, qtdComprada, novoPrecoCompra, novoPrecoVenda, cnpjForn) {
        let objProduto = this.#buscarProduto(descricao);
        if (objProduto == undefined) {
            return "PRODUTO_NAO_ENCONTRADO";
        }

        // 1) Se o usuário informou um novo CNPJ, verifica se existe
        if (cnpjForn != "") {
            let objFornecedor = this.#buscarFornecedor(cnpjForn);
            if (objFornecedor == undefined) {
                return "FORNECEDOR_NAO_ENCONTRADO";
            }
            objProduto.fornecedor = objFornecedor;
        }

        // 2) Verifica crédito — usa o novo preço de compra, se informado
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
     * venda do mês atual). Retorna um objeto com o código simbólico e,
     * quando for o caso, os dados adicionais:
     *   { codigo: "SUCESSO", totalVenda }
     *   { codigo: "PRODUTO_NAO_ENCONTRADO" }
     *   { codigo: "ESTOQUE_INSUFICIENTE", estoqueAtual }
     */
    venderProduto(descricao, qtdVendida) {
        let objProduto = this.#buscarProduto(descricao);
        if (objProduto == undefined) {
            return { codigo: "PRODUTO_NAO_ENCONTRADO" };
        }

        if (objProduto.qtdEstoque < qtdVendida) {
            return {
                codigo: "ESTOQUE_INSUFICIENTE",
                estoqueAtual: objProduto.qtdEstoque
            };
        }

        // Abate do estoque
        objProduto.qtdEstoque = objProduto.qtdEstoque - qtdVendida;

        // Registra na venda do mês atual (getMonth() retorna 0..11)
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
        let objProduto = this.#buscarProduto(descricao);
        if (objProduto == undefined) {
            return undefined;
        }

        return {
            descricao:   objProduto.descricao,
            totalVendas: objProduto.totalAno
        };
    }

    /**
     * Consulta o produto mais vendido em um determinado mês (1..12).
     * Retorna DTO { descricao, qtdVendida } ou undefined se não houver
     * nenhum produto cadastrado.
     */
    consultarMaisVendidoMes(mes) {
        if (this.#vetProdutos.length == 0) {
            return undefined;
        }

        let objMaisVendido = this.#vetProdutos[0];
        let maiorQtd       = objMaisVendido.vendasMensais[mes - 1];

        for (let i = 1; i < this.#vetProdutos.length; i++) {
            let qtdAtual = this.#vetProdutos[i].vendasMensais[mes - 1];
            if (qtdAtual > maiorQtd) {
                maiorQtd       = qtdAtual;
                objMaisVendido = this.#vetProdutos[i];
            }
        }

        return {
            descricao:  objMaisVendido.descricao,
            qtdVendida: maiorQtd
        };
    }

    /**
     * Calcula o faturamento de um mês:
     * soma (qtdVendidaNoMes * precoVenda) de cada produto.
     * Retorna DTO { mes, faturamento }.
     */
    consultarFaturamentoMes(mes) {
        let faturamento = 0;

        this.#vetProdutos.forEach((produto) => {
            let qtdVendida = produto.vendasMensais[mes - 1];
            faturamento += qtdVendida * produto.precoVenda;
        });

        return { mes: mes, faturamento: faturamento };
    }

    /**
     * Lista todos os produtos como DTOs.
     * Se não houver produtos, devolve um vetor vazio.
     */
    listarProdutos() {
        let vetObjetosLiteraisProduto = [];

        this.#vetProdutos.forEach((produto) => {
            vetObjetosLiteraisProduto.push(this.#produtoParaDTO(produto));
        });

        return vetObjetosLiteraisProduto;
    }

    /**
     * Lista a tabela de vendas anual:
     * cada produto com seu vetor de 12 meses + total do ano.
     */
    listarTabelaVendasAnual() {
        let vetObjetosLiteraisVenda = [];

        this.#vetProdutos.forEach((produto) => {
            vetObjetosLiteraisVenda.push({
                descricao:     produto.descricao,
                vendasMensais: produto.vendasMensais,
                totalAno:      produto.totalAno
            });
        });

        return vetObjetosLiteraisVenda;
    }

    /**
     * Filtra produtos cujo estoque é menor ou igual ao valor informado.
     * Retorna um vetor (possivelmente vazio) de DTOs.
     */
    filtrarProdutosPorEstoque(qtdMaxima) {
        let vetFiltrados = [];

        this.#vetProdutos.forEach((produto) => {
            if (produto.qtdEstoque <= qtdMaxima) {
                vetFiltrados.push(this.#produtoParaDTO(produto));
            }
        });

        return vetFiltrados;
    }

    /**
     * Lista os produtos fornecidos por um fornecedor (pelo CNPJ).
     * Retorna undefined se o fornecedor não existe; caso contrário,
     * devolve um vetor (possivelmente vazio) de DTOs.
     */
    listarProdutosFornecedor(cnpj) {
        let objFornecedor = this.#buscarFornecedor(cnpj);
        if (objFornecedor == undefined) {
            return undefined;
        }

        let vetObjetosLiteraisProduto = [];

        this.#vetProdutos.forEach((produto) => {
            if (produto.fornecedor != undefined &&
                produto.fornecedor.cnpj == cnpj) {
                vetObjetosLiteraisProduto.push(this.#produtoParaDTO(produto));
            }
        });

        return vetObjetosLiteraisProduto;
    }

    // ══════════════════════════════════════════════════════════════════════
    // MÉTODOS DE FORNECEDOR
    // ══════════════════════════════════════════════════════════════════════
    //
    // >>> AQUI ENTRAM OS MÉTODOS DE FORNECEDOR DA DUPLA <<<
    //
    // cadastrarFornecedor(razaoSocial, cnpj, telefone, endereco, credito)
    // excluirFornecedor(cnpj)
    // alterarFornecedor(cnpj, razaoSocial, telefone, endereco, credito)
    // consultarFornecedor(cnpj)
    // listarFornecedores()
    // filtrarFornecedoresPorCredito(creditoMinimo)
    //
    // Observações para a dupla:
    //  - Podem usar #buscarFornecedor(cnpj) daqui de cima.
    //  - As consultas devem retornar DTOs (objetos literais).
    //  - excluirFornecedor deve retornar códigos simbólicos:
    //       "SUCESSO" | "FORNECEDOR_NAO_ENCONTRADO" | "FORNECEDOR_COM_PRODUTOS"
    //  - Chamar this.salvarDados() ao final de cada alteração.
    //
    // ══════════════════════════════════════════════════════════════════════

    // ══════════════════════════════════════════════════════════════════════
    // PERSISTÊNCIA
    // ══════════════════════════════════════════════════════════════════════

    /**
     * Salva fornecedores e produtos no localStorage.
     *
     * Importante: chamamos o stringify() de cada objeto (e não apenas
     * JSON.stringify do vetor), porque:
     *  - Produto precisa gravar apenas o CNPJ do fornecedor.
     *  - Fornecedor usa os nomes definidos no stringify() dele.
     */
    salvarDados() {
        let vetFornecedoresJSON = [];
        this.#vetFornecedores.forEach((fornecedor) => {
            vetFornecedoresJSON.push(JSON.parse(fornecedor.stringify()));
        });

        let vetProdutosJSON = [];
        this.#vetProdutos.forEach((produto) => {
            vetProdutosJSON.push(JSON.parse(produto.stringify()));
        });

        localStorage.setItem("armazem_fornecedores", JSON.stringify(vetFornecedoresJSON));
        localStorage.setItem("armazem_produtos",     JSON.stringify(vetProdutosJSON));
    }

    /**
     * Carrega fornecedores e produtos do localStorage.
     * Ordem obrigatória: fornecedores PRIMEIRO, produtos DEPOIS, pois a
     * referência Produto → Fornecedor precisa ser religada pelo CNPJ.
     */
    carregarDados() {
        // 1) Fornecedores
        let vetFornecedoresSalvos = [];
        if (localStorage.getItem("armazem_fornecedores") != undefined) {
            vetFornecedoresSalvos = JSON.parse(localStorage.getItem("armazem_fornecedores"));
        }

        this.#vetFornecedores = [];
        vetFornecedoresSalvos.forEach((objFornecedor) => {
            // Atenção: os nomes aqui batem com o stringify() do Fornecedor
            // (razao_social, credito) — conforme o arquivo da dupla.
            this.#vetFornecedores.push(
                new Fornecedor(
                    objFornecedor.razao_social,
                    objFornecedor.cnpj,
                    objFornecedor.telefone,
                    objFornecedor.endereco,
                    objFornecedor.credito
                )
            );
        });

        // 2) Produtos — religando ao fornecedor pelo CNPJ
        let vetProdutosSalvos = [];
        if (localStorage.getItem("armazem_produtos") != undefined) {
            vetProdutosSalvos = JSON.parse(localStorage.getItem("armazem_produtos"));
        }

        this.#vetProdutos = [];
        vetProdutosSalvos.forEach((objProduto) => {
            let objFornecedor = undefined;
            if (objProduto.cnpjForn != undefined && objProduto.cnpjForn != null) {
                objFornecedor = this.#buscarFornecedor(objProduto.cnpjForn);
            }

            this.#vetProdutos.push(
                new Produto(
                    objProduto.descricao,
                    objProduto.precoCompra,
                    objProduto.precoVenda,
                    objProduto.qtdEstoque,
                    objProduto.vendasMensais,
                    objFornecedor
                )
            );
        });
    }
}