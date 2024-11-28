enum StatusPagamento {
    Pendente,
    Aprovado,
    Recusado
}

enum BandeiraCartao {
    Visa,
    Mastercard,
    Elo,
    AmericanExpress,
    Hipercard
}

//definição de interface para a estrutura do nosso pagamento
interface Pagamento {
    valor: number;
    status: StatusPagamento;
    pagar(): Promise<string>;
    getDetalhes(): any;
    //exibirValor?(): void; //metodo opcional
}

//classe abstrata direcionada para pagamento com validação e status
abstract class PagamentoBase implements Pagamento {
    status: StatusPagamento = StatusPagamento.Pendente;
    constructor(public valor: number) {
        this.validarValorPagamento(valor);
    }

    //metodo abstrato para pagamento - vou implementar nas subclasses (classes filhas)
    abstract pagar(): Promise<string>;

    abstract getDetalhes(): any; //metodo para ser sobrescrito

    validarValorPagamento(valor: number) {
        if (valor <= 0) { //validando o valor do pagamento
            throw new Error('Valor do pagamento deve ser maior que zero');
        }
    }
    //exibirValor(): void { console.log(`Valor a ser pago: R$ ${this.valor.toFixed(2)}`); }
}

//subclasse para pagamento com cartão
class PagamentoCartao extends PagamentoBase {
    constructor(valor: number, public bandeira: BandeiraCartao) {
        super(valor);
    }
    async pagar(): Promise<string> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.status = StatusPagamento.Aprovado;
        const mensagem = `Pagamento de R$ ${this.valor.toFixed(2)} realizado com cartão ${BandeiraCartao[this.bandeira]}`;
        return mensagem;
    }
    getDetalhes(): any {
        return {
            tipo: "Cartão",
            bandeira: BandeiraCartao[this.bandeira]
        };
    }
}
//subclasse para pagamento com boleto
class PagamentoBoleto extends PagamentoBase {
    constructor(valor: number, private codigoBarras: string) {
        super(valor);
        this.validarCodigoBarras(codigoBarras);
    }
    //sobrescrita do metodo abstrato pagar
    async pagar(): Promise<string> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.status = StatusPagamento.Aprovado;
        const mensagem = `Pagamento de R$ ${this.valor.toFixed(2)} realizado com boleto. Código de barras: ${this.codigoBarras}`;
        return mensagem;
    }
    getDetalhes(): any {
        return {
            tipo: "Boleto",
            codigoBarras: this.codigoBarras
        };
    }
    validarCodigoBarras(codigoBarras: string) {
        if (codigoBarras.length > 10) {
            throw new Error('Código de barras inválido');
        }
    }
}


// exemplo de uso 
async function main() {

    const cartao = new PagamentoCartao(150, BandeiraCartao.Visa);
    const boleto = new PagamentoBoleto(200, "1234567890"); // Código de barras com mais de 10 dígitos
    const pagamentos: Pagamento[] = [cartao, boleto];

    for (const pagamento of pagamentos) {
        try {
            const mensagem = await pagamento.pagar();
            console.log(mensagem);
            console.log("Detalhes:", pagamento.getDetalhes());
        } catch (error: any) { // Captura erros e exibe a mensagem
            console.error("Erro no pagamento:", error.message);
        }
    }

    //teste de erro para boleto
    const boletoErro = new PagamentoBoleto(0, "1234567896");
    const boletoErro2 = new PagamentoBoleto(200, "1234567890128");

    try {
        await boletoErro.pagar() //ele vai quebrar aqui
        await boletoErro2.pagar()
    } catch (error: any) {
        console.error("Erro de boleto", error.message)
    }

}

main();