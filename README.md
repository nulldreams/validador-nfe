# validador-nfe
Um pequeno validador de NF-e, utilizando o validador da Sefaz e mais alguns recursos para montar uma resposta mais simples de um usuário entender onde está o problema na sua nota fiscal.

# Testando
É bem simples, basta utilizar o comando *npm i* ou *npm install* para instalar os pacotes necessários.

Depois inicie o aplicativo com *node server.js*, ele vai iniciar na porta 5000.

## POST - localhost:5000/api/v1/validar
### Body
   - xml (Conteúdo do xml que será validado, utilize o *NFe.xml* que deixei de exemplo aqui no git

O retorno será nesse formato:

```json
[
    {
        "mensagem": "The 'http://www.portalfiscal.inf.br/nfe:NCM' element is invalid - The value '30043929a' is invalid according to its datatype 'String' - The Pattern constraint failed.Caminho: nfeProc/NFe[1]/infNFe/det[1]/prod/NCM",
        "campo": {
            "tag": "NCM",
            "valor_incorreto": "30043929a",
            "descricao": "Codigo NCM",
            "tamanho": "10"
        }
    },
    {
        "mensagem": "The 'http://www.portalfiscal.inf.br/nfe:indTot' element is invalid - The value '10' is invalid according to its datatype 'String' - The Enumeration constraint failed.Caminho: nfeProc/NFe[1]/infNFe/det[1]/prod/indTot",
        "campo": {
            "tag": "indTot",
            "valor_incorreto": "10",
            "descricao": "Indica se valor do Item vProd entra no valor total da NF-e vProd",
            "tamanho": "1"
        },
        "dica": "Utilize: [0] - O valor do Item compõe o valor total da nota / [1] - O valor do Item NÃO compõe o valor total da nota"
    },
    {
        "mensagem": "The 'http://www.portalfiscal.inf.br/nfe:modFrete' element is invalid - The value 'aa0' is invalid according to its datatype 'String' - The Enumeration constraint failed.Caminho: nfeProc/NFe[1]/infNFe/transp/modFrete/",
        "campo": {
            "tag": "modFrete",
            "valor_incorreto": "aa0",
            "descricao": "Modalidade do frete",
            "tamanho": "1"
        },
        "dica": "Utilize: 0 Por conta do emitente, 1 Por conta do destinatario, 2 Por conta de terceiros, 9 Sem frete"
    }
]
```
