/*
COFRE REGISTRO
Lapidar-Cofre

Responsável por:

– registrar execuções do módulo
– manter trilha de auditoria
– registrar eventos de ingestão
– registrar eventos de classificação e limpeza
– preservar histórico sem violar a espinha dorsal
*/


const CofreRegistro = {

chaveRegistro:"lapidar_cofre_registro",


estruturaBase(){
return {
execucoes:[],
ultimaAtualizacao:null
}
},



lerRegistro(){

let bruto = localStorage.getItem(this.chaveRegistro)

if(!bruto){
return this.estruturaBase()
}

try{
return JSON.parse(bruto)
}catch(e){
return this.estruturaBase()
}

},



salvarRegistro(registro){

registro.ultimaAtualizacao = new Date().toISOString()

localStorage.setItem(
this.chaveRegistro,
JSON.stringify(registro)
)

return "Registro do Lapidar-Cofre atualizado com sucesso"

},



registrarExecucao(etapa, detalhe){

let registro = this.lerRegistro()

registro.execucoes.push({
etapa:etapa || "etapa_nao_informada",
detalhe:detalhe || "sem_detalhe",
tituloObra:
(typeof CofreCore !== "undefined" && CofreCore.memoria.titulo)
? CofreCore.memoria.titulo
: "sem_titulo",
autor:
(typeof CofreCore !== "undefined" && CofreCore.memoria.autor)
? CofreCore.memoria.autor
: "sem_autor",
data:new Date().toISOString()
})

return this.salvarRegistro(registro)

},



ver(){

return JSON.stringify(
this.lerRegistro(),
null,
2
)

},



listarExecucoes(){

const registro = this.lerRegistro()
return registro.execucoes || []

},



ultimaExecucao(){

const registro = this.lerRegistro()

if(!registro.execucoes || registro.execucoes.length === 0){
return "Nenhuma execução registrada"
}

return registro.execucoes[registro.execucoes.length - 1]

},



limpar(){

localStorage.removeItem(this.chaveRegistro)

return "Registro do Lapidar-Cofre removido com sucesso"

},



exportar(){

const conteudo = this.ver()

const blob = new Blob(
[conteudo],
{ type:"application/json" }
)

const url = URL.createObjectURL(blob)
const a = document.createElement("a")
a.href = url
a.download = "cofre_registro.json"
a.click()

setTimeout(() => {
URL.revokeObjectURL(url)
}, 1000)

return "Registro do Lapidar-Cofre exportado com sucesso"

},



status(){

const registro = this.lerRegistro()

return {
quantidadeExecucoes: registro.execucoes ? registro.execucoes.length : 0,
ultimaAtualizacao: registro.ultimaAtualizacao || null
}

}

}


console.log("COFRE REGISTRO ATIVO")
