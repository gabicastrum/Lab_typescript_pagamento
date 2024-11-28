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
    pagar(): Promise<void>;
    getDetalhes(): any;
    //exibirValor?(): void; //metodo opcional
}

//classe abstrata direcionada para pagamento com validação e status
abstract class PagamentoBase implements Pagamento {
    status: StatusPagamento = StatusPagamento.Pendente;

    constructor(public valor: number) {
        if (valor <= 0) { //validando o valor do pagamento
            throw new Error('Valor do pagamento deve ser maior que zero');
        }
    }

    //metodo abstrato para pagamento - vou implementar nas subclasses (classes filhas)
    abstract pagar(): Promise<void>;

    getDetalhes(): any { //metodo para ser sobrescrito
        return {}
    }

    //exibirValor(): void { console.log(`Valor a ser pago: R$ ${this.valor.toFixed(2)}`); }
}

//subclasse para pagamento com cartão
class PagamentoCartao extends PagamentoBase {
    constructor(valor: number, public bandeira: BandeiraCartao) {
        super(valor);
    }
    async pagar(): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.status = StatusPagamento.Aprovado;
        console.log(`Pagamento de R$ ${this.valor.toFixed(2)} realizado com cartão ${BandeiraCartao[this.bandeira]}`);
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
        if (codigoBarras.length < 10) {
            throw new Error('Código de barras inválido');
        }
    }
    //sobrescrita do metodo abstrato pagar
    async pagar(): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.status = StatusPagamento.Aprovado;
        console.log(`Pagamento de R$ ${this.valor.toFixed(2)} realizado com boleto. Código de barras: ${this.codigoBarras}`);
    }
    getDetalhes(): any {
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
    const boletoErro = new PagamentoBoleto(50, "1234567896"); // Código de barras com menos de 10 dígitos
    const boletoErro2 = new PagamentoBoleto(0, "1234567890"); // Valor do boleto menor ou igual a zero
    const boletoErro3 = new PagamentoBoleto(100, "123456789012345"); // Código de barras com mais de 10 dígitos

    try {
        await boletoErro.pagar()
    } catch (error: any) {
        console.error("Erro de boleto", error.message)
    }

}

main();

//Exemplo com objetos literais
//const pagamentosRapidos: Pagamento[] = [{ valor: 150.0, pagar: () => console.log('Pagamento rápido de 150 reais realizado') }
//   , { valor: 200.0, pagar: () => console.log('Pagamento rápido de 200 reais realizado') }];