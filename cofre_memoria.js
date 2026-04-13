/*
COFRE MEMÓRIA
Lapidar-Cofre

Responsável por:

– salvar estado atual do módulo
– guardar última obra ingerida
– preservar metadados detectados
– preservar pré-textuais separados
– preservar texto limpo inicial
– restaurar continuidade interna da ferramenta
*/


const CofreMemoria = {

chaveMemoria:"lapidar_cofre_memoria",


estruturaBase(){
return {
titulo:null,
subtitulo:null,
autor:null,
organizador:null,
generoDetectado:null,
estruturaDetectada:null,
textoOriginal:null,
textoLimpo:null,
prefacio:null,
dedicatoria:null,
biografia:null,
fichaDados:null,
status:"nao_iniciado",
ultimaAtualizacao:null
}
},



lerMemoria(){

let bruto = localStorage.getItem(this.chaveMemoria)

if(!bruto){
return this.estruturaBase()
}

try{
return JSON.parse(bruto)
}catch(e){
return this.estruturaBase()
}

},



salvar(){

if(typeof CofreCore === "undefined"){
return "CofreCore não disponível"
}

let memoria = {
titulo:CofreCore.memoria.titulo,
subtitulo:CofreCore.memoria.subtitulo,
autor:CofreCore.memoria.autor,
organizador:CofreCore.memoria.organizador,
generoDetectado:CofreCore.memoria.generoDetectado,
estruturaDetectada:CofreCore.memoria.estruturaDetectada,
textoOriginal:CofreCore.memoria.textoOriginal,
textoLimpo:CofreCore.memoria.textoLimpo,
prefacio:CofreCore.memoria.prefacio,
dedicatoria:CofreCore.memoria.dedicatoria,
biografia:CofreCore.memoria.biografia,
fichaDados:CofreCore.memoria.fichaDados,
status:CofreCore.memoria.status,
ultimaAtualizacao:new Date().toISOString()
}

localStorage.setItem(
this.chaveMemoria,
JSON.stringify(memoria)
)

if(typeof CofreRegistro !== "undefined"){
CofreRegistro.registrarExecucao(
"memoria_salva",
"Memória do Lapidar-Cofre salva"
)
}

return "Memória do Lapidar-Cofre salva com sucesso"

},



carregar(){

if(typeof CofreCore === "undefined"){
return "CofreCore não disponível"
}

let memoria = this.lerMemoria()

CofreCore.memoria.titulo = memoria.titulo
CofreCore.memoria.subtitulo = memoria.subtitulo
CofreCore.memoria.autor = memoria.autor
CofreCore.memoria.organizador = memoria.organizador
CofreCore.memoria.generoDetectado = memoria.generoDetectado
CofreCore.memoria.estruturaDetectada = memoria.estruturaDetectada
CofreCore.memoria.textoOriginal = memoria.textoOriginal
CofreCore.memoria.textoLimpo = memoria.textoLimpo
CofreCore.memoria.prefacio = memoria.prefacio
CofreCore.memoria.dedicatoria = memoria.dedicatoria
CofreCore.memoria.biografia = memoria.biografia
CofreCore.memoria.fichaDados = memoria.fichaDados
CofreCore.memoria.status = memoria.status || "memoria_carregada"

CofreCore.estado.obraCarregada = !!memoria.textoOriginal
CofreCore.estado.estruturaClassificada = !!memoria.estruturaDetectada
CofreCore.estado.metadadosDetectados =
!!(memoria.titulo || memoria.autor || memoria.generoDetectado)
CofreCore.estado.preTextuaisSeparados =
!!(memoria.prefacio || memoria.dedicatoria || memoria.biografia || memoria.fichaDados)

if(typeof CofreRegistro !== "undefined"){
CofreRegistro.registrarExecucao(
"memoria_carregada",
"Memória do Lapidar-Cofre carregada"
)
}

return "Memória do Lapidar-Cofre carregada com sucesso"

},



ver(){

return JSON.stringify(
this.lerMemoria(),
null,
2
)

},



limpar(){

localStorage.removeItem(this.chaveMemoria)

if(typeof CofreRegistro !== "undefined"){
CofreRegistro.registrarExecucao(
"memoria_limpa",
"Memória do Lapidar-Cofre removida"
)
}

return "Memória do Lapidar-Cofre removida com sucesso"

},



status(){

const memoria = this.lerMemoria()

return {
possuiTitulo:!!memoria.titulo,
possuiSubtitulo:!!memoria.subtitulo,
possuiAutor:!!memoria.autor,
possuiOrganizador:!!memoria.organizador,
possuiGeneroDetectado:!!memoria.generoDetectado,
possuiEstruturaDetectada:!!memoria.estruturaDetectada,
possuiTextoOriginal:!!memoria.textoOriginal,
possuiTextoLimpo:!!memoria.textoLimpo,
possuiPrefacio:!!memoria.prefacio,
possuiDedicatoria:!!memoria.dedicatoria,
possuiBiografia:!!memoria.biografia,
possuiFichaDados:!!memoria.fichaDados,
ultimaAtualizacao:memoria.ultimaAtualizacao || null
}

}

}


console.log("COFRE MEMÓRIA ATIVA")
