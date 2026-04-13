/*
COFRE CORE
Lapidar-Cofre

Núcleo de ingestão estrutural do ecossistema Lapidar

Responsável por:

– receber obra enviada
– armazenar texto-base
– registrar metadados detectados
– registrar classificação estrutural inicial
– registrar pré-textuais detectados
– preparar saída para Sistema Desbaste
– expor memória ao Lapidar Pensante
*/


const CofreCore = {

estado:{
obraCarregada:false,
estruturaClassificada:false,
metadadosDetectados:false,
preTextuaisSeparados:false
},



memoria:{

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

status:"cofre_inicializado"

},



carregarObra(pacote){

if(!pacote || !pacote.textoBase){
return "Nenhuma obra recebida pelo Cofre"
}

this.memoria.titulo =
pacote.titulo || "titulo_nao_detectado"

this.memoria.subtitulo =
pacote.subtitulo || null

this.memoria.autor =
pacote.autor || "autor_nao_detectado"

this.memoria.organizador =
pacote.organizador || null

this.memoria.textoOriginal =
pacote.textoBase

this.memoria.status =
"obra_recebida_no_cofre"

this.estado.obraCarregada = true


if(typeof CofreRegistro !== "undefined"){

CofreRegistro.registrarExecucao(
"obra_recebida",
"Obra recebida pelo CofreCore"
)

}

return "Obra carregada no Lapidar-Cofre com sucesso"

},



registrarEstrutura(tipo){

if(!tipo){
return "Estrutura não identificada"
}

this.memoria.estruturaDetectada = tipo

this.estado.estruturaClassificada = true

this.memoria.status =
"estrutura_classificada"


if(typeof CofreRegistro !== "undefined"){

CofreRegistro.registrarExecucao(
"estrutura_detectada",
"Estrutura detectada: " + tipo
)

}

return "Estrutura registrada: " + tipo

},



registrarMetadados(metadados){

if(!metadados){
return "Metadados inválidos"
}

this.memoria.titulo =
metadados.titulo || this.memoria.titulo

this.memoria.subtitulo =
metadados.subtitulo || this.memoria.subtitulo

this.memoria.autor =
metadados.autor || this.memoria.autor

this.memoria.organizador =
metadados.organizador || this.memoria.organizador

this.memoria.generoDetectado =
metadados.generoDetectado || null


this.estado.metadadosDetectados = true

this.memoria.status =
"metadados_detectados"


if(typeof CofreRegistro !== "undefined"){

CofreRegistro.registrarExecucao(
"metadados_detectados",
"Metadados estruturais identificados"
)

}

return "Metadados registrados com sucesso"

},



registrarPreTextuais(bloco){

if(!bloco){
return "Nenhum pré-textual detectado"
}

this.memoria.prefacio =
bloco.prefacio || null

this.memoria.dedicatoria =
bloco.dedicatoria || null

this.memoria.biografia =
bloco.biografia || null

this.memoria.fichaDados =
bloco.fichaDados || null


this.estado.preTextuaisSeparados = true

this.memoria.status =
"pre_textuais_separados"


if(typeof CofreRegistro !== "undefined"){

CofreRegistro.registrarExecucao(
"pre_textuais_separados",
"Pré-textuais organizados"
)

}

return "Pré-textuais registrados"

},



registrarTextoLimpo(texto){

if(!texto){
return "Texto limpo inválido"
}

this.memoria.textoLimpo = texto

this.memoria.status =
"texto_limpo_disponivel"


if(typeof CofreRegistro !== "undefined"){

CofreRegistro.registrarExecucao(
"texto_limpo_registrado",
"Texto limpo preparado para Desbaste"
)

}

return "Texto limpo registrado com sucesso"

},



obterTextoOriginal(){

return this.memoria.textoOriginal || ""

},



obterTextoLimpo(){

return this.memoria.textoLimpo || ""

},



status(){

return {

estado:this.estado,
memoria:this.memoria

}

},



resetar(){

this.estado = {

obraCarregada:false,
estruturaClassificada:false,
metadadosDetectados:false,
preTextuaisSeparados:false

}


this.memoria = {

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

status:"cofre_resetado"

}


if(typeof CofreRegistro !== "undefined"){

CofreRegistro.registrarExecucao(
"cofre_resetado",
"Núcleo do Cofre reiniciado"
)

}

return "CofreCore resetado com sucesso"

}

}


console.log("COFRE CORE ATIVO")
