//const Produto = require('../models/produto')
const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')
var parseString = require('xml2js').parseString

exports.ValidarXML = (req, res) => {
    ValidarXML(req.body.xml, (err, ret) => {
        if (err) res.status(500).send({ mensagem: 'Ocorreu um problema enquanto realizavamos a validação, por gentileza tente novamente :)', erro: err })

        res.status(200).send(ret)
    })
}

var ValidarXML = (xml, callback) => {
    let options = {
        method: 'POST',
        uri: 'https://www.sefaz.rs.gov.br/NFE/NFE-VAL.aspx',
        formData: {
            txtxml: xml
        }
    }

    rp(options)
        .then((htmlstring) => {
            Validar(htmlstring, (err, validacao) => {
                if (err) callback(err)

                callback(null, validacao)
            })
        })
        .catch((err) => {
            callback(err)
        })
}

var Validar = (xml, callback) => {
    const $ = cheerio.load(xml)
    let resposta = []

    MontarJsonNFe((err, NFe) => {
        if (err) callback(err, null)

        for (let i = 0; i < $('.erroSchema2').length; i++) {
            let mensagem = $('.erroSchema2').eq(i).text().trim()
            let tag = mensagem.substring(mensagem.indexOf('/nfe:') + 5, mensagem.indexOf('\' element is invalid'))
            let valor_informado = mensagem.substring(mensagem.indexOf('The value \'') + 11, mensagem.indexOf('\' is invalid'))

            resposta.push({
                mensagem: mensagem,
                campo: {
                    tag: tag,
                    valor_incorreto: valor_informado,
                    descricao: NFe[tag].display,
                    tamanho: NFe[tag].tamanho
                },
                dica: NFe[tag].dica
            })
        }

        callback(null, resposta)
    })
}


var Carregarxml = (callback) => {
    fs.readFile('./xml/campos.xml', 'utf8', (err, data) => {
        if (err) return callback(err)
        callback(null, data)
    })
}

var MontarJsonNFe = (callback) => {
    Carregarxml((err, conteudo) => {
        parseString(conteudo, function (err, result) {
            if (err) callback(err)

            let partes = ['A', 'B', 'NREF', 'C', 'D', 'E', 'F', 'G', 'AUTXML', 'H', 'I', 'I80', 'NVE', 'DI', 'ADI', 'DETEXPORT', 'EXPORTIND', 'J', 'K', 'L', 'L1', 'L2', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'NA', 'V', 'UB', 'W', 'X', 'REBOQUE', 'VOL', 'LACRE', 'Y', 'YA', 'DUP', 'Z', 'OBSCONT', 'OBSFISCO', 'PROCREF', 'CANA', 'FORDIA', 'DEDUC', 'MANAGER']
            const NFe = {}

            for (let i = 0; i < 50; i++) {
                let parte = partes[i]
                for (let j = 0; j < result.PARTES[parte][0].campos[0].campo.length; j++) {
                    let nome = ''
                    if (result.PARTES[parte][0].campos[0].campo[j].$.nome.indexOf('_') > -1) {
                        nome = result.PARTES[parte][0].campos[0].campo[j].$.nome.substring(0, result.PARTES[parte][0].campos[0].campo[j].$.nome.indexOf('_'))
                    } else {
                        nome = result.PARTES[parte][0].campos[0].campo[j].$.nome
                    }

                    result.PARTES[parte][0].campos[0].campo[j].$.nome = nome

                    NFe[nome] = result.PARTES[parte][0].campos[0].campo[j].$
                }
            }

            callback(null, NFe)
        })
    })
}