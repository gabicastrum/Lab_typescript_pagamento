"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatusPagamento;
(function (StatusPagamento) {
    StatusPagamento[StatusPagamento["Pendente"] = 0] = "Pendente";
    StatusPagamento[StatusPagamento["Aprovado"] = 1] = "Aprovado";
    StatusPagamento[StatusPagamento["Recusado"] = 2] = "Recusado";
})(StatusPagamento || (StatusPagamento = {}));
var BandeiraCartao;
(function (BandeiraCartao) {
    BandeiraCartao[BandeiraCartao["Visa"] = 0] = "Visa";
    BandeiraCartao[BandeiraCartao["Mastercard"] = 1] = "Mastercard";
    BandeiraCartao[BandeiraCartao["Elo"] = 2] = "Elo";
    BandeiraCartao[BandeiraCartao["AmericanExpress"] = 3] = "AmericanExpress";
    BandeiraCartao[BandeiraCartao["Hipercard"] = 4] = "Hipercard";
})(BandeiraCartao || (BandeiraCartao = {}));
//classe abstrata direcionada para pagamento com validação e status
class PagamentoBase {
    valor;
    status = StatusPagamento.Pendente;
    constructor(valor) {
        this.valor = valor;
        if (valor <= 0) { //validando o valor do pagamento
            throw new Error('Valor do pagamento deve ser maior que zero');
        }
    }
    getDetalhes() {
        return {};
    }
}
//subclasse para pagamento com cartão
class PagamentoCartao extends PagamentoBase {
    bandeira;
    constructor(valor, bandeira) {
        super(valor);
        this.bandeira = bandeira;
    }
    async pagar() {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.status = StatusPagamento.Aprovado;
        console.log(`Pagamento de R$ ${this.valor.toFixed(2)} realizado com cartão ${BandeiraCartao[this.bandeira]}`);
    }
    getDetalhes() {
        return {
            tipo: "Cartão",
            bandeira: BandeiraCartao[this.bandeira]
        };
    }
}
//subclasse para pagamento com boleto
class PagamentoBoleto extends PagamentoBase {
    codigoBarras;
    constructor(valor, codigoBarras) {
        super(valor);
        this.codigoBarras = codigoBarras;
        if (codigoBarras.length < 10) {
            throw new Error('Código de barras inválido');
        }
    }
    //sobrescrita do metodo abstrato pagar
    async pagar() {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.status = StatusPagamento.Aprovado;
        console.log(`Pagamento de R$ ${this.valor.toFixed(2)} realizado com boleto. Código de barras: ${this.codigoBarras}`);
    }
    getDetalhes() {
        return {
            tipo: "Boleto",
            codigoBarras: this.codigoBarras
        };
    }
}
// Exemplos de Uso e Testes 
async function main() {
    const cartao = new PagamentoCartao(150, BandeiraCartao.Visa);
    const boleto = new PagamentoBoleto(200, "1234567890128"); // Código de barras com mais de 10 dígitos
    const pagamentos = [cartao, boleto];
    for (const pagamento of pagamentos) {
        try {
            const mensagem = await pagamento.pagar();
            console.log(mensagem);
            console.log("Detalhes:", pagamento.getDetalhes());
        }
        catch (error) { // Captura erros e exibe a mensagem
            console.error("Erro no pagamento:", error.message);
        }
    }
    //teste de erro para boleto
    const boletoErro = new PagamentoBoleto(50, "123456789"); // Código de barras com menos de 10 dígitos
    try {
        await boletoErro.pagar();
    }
    catch (error) {
        console.error("Erro de boleto", error.message);
    }
}
main();
//Exemplo com objetos literais
//const pagamentosRapidos: Pagamento[] = [{ valor: 150.0, pagar: () => console.log('Pagamento rápido de 150 reais realizado') }
//   , { valor: 200.0, pagar: () => console.log('Pagamento rápido de 200 reais realizado') }];
//# sourceMappingURL=index.js.map