// ==UserScript==
// @name     Script sem nome 343339
// @version  1
// @grant    none
// ==/UserScript==

/*
variáveis importantes

atas_dia >>> RETORNA UM OBJETO CONTENDO AS ATAS DE UM REFERIDO DIA
Exemplo:
atas_dia.pautasDoDia.forEach((data,i) => {
            //somente apresenta os horários em que houve audiência
            if (data.idProcesso) {
                console.log(i);

                console.log(data.pautaAudienciaHorario.horaInicial)
                console.log(data.idProcesso);
                console.log(data.idDocumento);
            }
            
        });




info_ata_por_id >>> retorna informações sobre uma ata específica, tendo sido passados como parâmetros idProcesso e idDocumento, id da Ata, obtidos no atas_dia



*/



console.log("Script de relatórios ativado. Executando em alguns segundos...")


var relatorios = {
    mensal: ()=> {

            fetch("https://pje.trt11.jus.br/pje-comum-api/api/pautasaudiencias/classificacoes/dia?idSalaAudiencia=17&data=" + dataInicial).then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log(data)
                var atas_dia = data;
                console.log(atas_dia)
                localStorage.setItem("audiencias_dia", atas_dia)

                // acho que aqui temos que usar o stringfy

                /*
                a ideia é usar essa requisição para pegar o idProcesso e idDocumento (id da ata)

                */

            }).catch(function() {
                console.log('Booo');
            });

    },
    filtraIdProcesso_IdAta: (idprocesso, idata)=>{

        fetch("https://pje.trt11.jus.br/pje-comum-api/api/processos/id/" + idprocesso + "/documentos/id/" + idata + "?incluirAssinatura=false&incluirAnexos=false").then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log(data)
                
                var info_ata_por_id = data;

                /*
                a ideia é usar essa requisição para pegar o criador da ata e a juíza que assinou

                */


            }).catch(function() {
                console.log('Booo');
            });


    }
    

}





setTimeout(function () {
    
  	// renderiza o botão de execução do script
  	console.log("testando script");
    botaoExecutar = document.getElementById("cdk-drop-list-0");
    console.log(botaoExecutar);
    filho = document.createElement("tr");
    filho.innerHTML = "<br><input type='date' id='dataRelatorio'><br><button id='btRelatorio'>Gerar Relatório</button>";
    botaoExecutar.appendChild(filho);
  
  	
  	//evento executado ao clicar no botão gerar relatório
    button = document.getElementById("btRelatorio");
    button.addEventListener('click', ()=>{
    	relatorios.mensal();
    })
  
  	//evento executado ao alterar a dataInicial
    dataRelat = document.getElementById("dataRelatorio")
  	dataRelat.addEventListener("change", ()=>{
      dataInicial = dataRelat.value;
  	});
  
  
  
  

}, 4000);
