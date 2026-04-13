/*
COFRE ENGINE
Lapidar-Cofre

Motor de ingestão estrutural do ecossistema Lapidar

Responsável por:

– executar leitura diagnóstica inicial
– classificar estrutura da obra
– detectar metadados principais
– separar pré-textuais
– gerar texto limpo inicial
– preparar saída para Sistema Desbaste e Lapidar Pensante
*/


const CofreEngine = {

executarLeituraInicial(){

if(typeof CofreCore === "undefined"){
return "CofreCore não disponível"
}

const texto = CofreCore.obterTextoOriginal()

if(!texto || texto.trim() === ""){
return "Nenhum texto disponível no Cofre"
}

let resultado = []

resultado.push(this.classificarEstrutura(texto))
resultado.push(this.detectarMetadados(texto))
resultado.push(this.separarPreTextuais(texto))
resultado.push(this.gerarTextoLimpo(texto))

return resultado.join("\n")

},



classificarEstrutura(texto){

let tipo = "prosa"

const possuiVersos = this.detectarVersos(texto)
const possuiCapitulos = /cap[ií]tulo|pr[oó]logo|ep[ií]logo/i.test(texto)
const linhasCurtas = this.calcularLinhasCurtas(texto)

if(possuiVersos && !possuiCapitulos){
tipo = "poesia"
}else if(possuiVersos && possuiCapitulos){
tipo = "hibrido"
}else if(/receita|ingredientes|modo de preparo/i.test(texto)){
tipo = "receituario"
}else if(/resumo|refer[eê]ncias|metodologia|abstract/i.test(texto)){
tipo = "academico"
}else if(/personagens|cena|ato\s+\d+/i.test(texto)){
tipo = "dramatico"
}else if(linhasCurtas > 0.45){
tipo = "poesia"
}

CofreCore.registrarEstrutura(tipo)

return "Estrutura inicial classificada: " + tipo

},



detectarMetadados(texto){

const linhas = texto
.replace(/\r\n/g, "\n")
.replace(/\r/g, "\n")
.split("\n")
.map(l => l.trim())
.filter(Boolean)

let titulo = null
let subtitulo = null
let autor = null
let organizador = null
let generoDetectado = null

if(linhas.length > 0){
titulo = linhas[0]
}

if(linhas.length > 1 && linhas[1].length > 3 && linhas[1].length < 120){
if(!/^cap[ií]tulo|pr[oó]logo|ep[ií]logo/i.test(linhas[1])){
subtitulo = linhas[1]
}
}

for(let i = 0; i < Math.min(linhas.length, 12); i++){

const linha = linhas[i]

if(/autor|autora/i.test(linha)){
autor = linha.replace(/autor(a)?[:\-]?\s*/i, "").trim() || autor
}

if(/organizador|organização/i.test(linha)){
organizador = linha.replace(/organizador(a)?[:\-]?\s*/i, "").trim() || organizador
}

if(/romance|poesia|conto|fantasia|cr[oô]nica|novela|drama/i.test(linha)){
generoDetectado = linha
}
}

const metadados = {
titulo: titulo,
subtitulo: subtitulo,
autor: autor,
organizador: organizador,
generoDetectado: generoDetectado
}

CofreCore.registrarMetadados(metadados)

return "Metadados estruturais detectados"

},



separarPreTextuais(texto){

const textoNormalizado = texto.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

let prefacio = this.extrairBloco(textoNormalizado, /pref[aá]cio/i)
let dedicatoria = this.extrairBloco(textoNormalizado, /dedicat[oó]ria/i)
let biografia = this.extrairBloco(textoNormalizado, /biografia|sobre o autor/i)
let fichaDados = this.extrairBloco(textoNormalizado, /ficha catalogr[aá]fica|ficha de dados da obra/i)

CofreCore.registrarPreTextuais({
prefacio: prefacio,
dedicatoria: dedicatoria,
biografia: biografia,
fichaDados: fichaDados
})

return "Pré-textuais separados"

},



gerarTextoLimpo(texto){

let textoLimpo = texto

textoLimpo = textoLimpo.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
textoLimpo = textoLimpo.replace(/[ \t]+/g, " ")
textoLimpo = textoLimpo.replace(/\n{3,}/g, "\n\n")
textoLimpo = textoLimpo.trim()

textoLimpo = this.removerBlocoSeDetectado(textoLimpo, /pref[aá]cio/i)
textoLimpo = this.removerBlocoSeDetectado(textoLimpo, /dedicat[oó]ria/i)
textoLimpo = this.removerBlocoSeDetectado(textoLimpo, /biografia|sobre o autor/i)
textoLimpo = this.removerBlocoSeDetectado(textoLimpo, /ficha catalogr[aá]fica|ficha de dados da obra/i)

textoLimpo = textoLimpo.replace(/\n{3,}/g, "\n\n").trim()

CofreCore.registrarTextoLimpo(textoLimpo)

return "Texto limpo inicial preparado"

},



detectarVersos(texto){

const linhas = texto
.replace(/\r\n/g, "\n")
.replace(/\r/g, "\n")
.split("\n")
.map(l => l.trim())
.filter(Boolean)

if(linhas.length === 0){
return false
}

let curtas = 0

for(const linha of linhas){
if(linha.length <= 55){
curtas++
}
}

return (curtas / linhas.length) > 0.45

},



calcularLinhasCurtas(texto){

const linhas = texto
.replace(/\r\n/g, "\n")
.replace(/\r/g, "\n")
.split("\n")
.map(l => l.trim())
.filter(Boolean)

if(linhas.length === 0){
return 0
}

let curtas = 0

for(const linha of linhas){
if(linha.length <= 55){
curtas++
}
}

return curtas / linhas.length

},



extrairBloco(texto, regexTitulo){

const linhas = texto.split("\n")
let inicio = -1

for(let i = 0; i < linhas.length; i++){
if(regexTitulo.test(linhas[i])){
inicio = i
break
}
}

if(inicio === -1){
return null
}

let bloco = []
bloco.push(linhas[inicio])

for(let i = inicio + 1; i < linhas.length; i++){

const linha = linhas[i]

if(/^(cap[ií]tulo|pr[oó]logo|ep[ií]logo|sum[aá]rio|pref[aá]cio|dedicat[oó]ria|biografia|sobre o autor|ficha catalogr[aá]fica|ficha de dados da obra)$/i.test(linha.trim())){
break
}

bloco.push(linha)
}

return bloco.join("\n").trim()

},



removerBlocoSeDetectado(texto, regexTitulo){

const linhas = texto.split("\n")
let resultado = []
let ignorando = false

for(let i = 0; i < linhas.length; i++){

const linha = linhas[i]
const limpa = linha.trim()

if(regexTitulo.test(limpa)){
ignorando = true
continue
}

if(ignorando && /^(cap[ií]tulo|pr[oó]logo|ep[ií]logo|sum[aá]rio|pref[aá]cio|dedicat[oó]ria|biografia|sobre o autor|ficha catalogr[aá]fica|ficha de dados da obra)$/i.test(limpa)){
ignorando = false
}

if(!ignorando){
resultado.push(linha)
}
}

return resultado.join("\n")

},



status(){

if(typeof CofreCore === "undefined"){
return {
sucesso:false,
mensagem:"CofreCore não disponível"
}
}

return CofreCore.status()

}

}


console.log("COFRE ENGINE ATIVO")
