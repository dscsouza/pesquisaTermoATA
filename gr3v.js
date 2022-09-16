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
    mensal: async function () {
      			
      			//await relatorios.resetaLocalStorage();
      			
            await fetch("https://pje.trt11.jus.br/pje-comum-api/api/pautasaudiencias/classificacoes/dia?idSalaAudiencia=17&data=" + dataInicial).then(function(response) {
                return response.json();
            }).then(function(data) {
                //console.log(data)
                var atas_dia = data;
                localStorage.setItem("audiencias_dia",JSON.stringify(data));
              	//console.log("dados recuperados do localstorage....")
              
              	//console.log(JSON.parse(localStorage.getItem("audiencias_dia")));
                            

                /*
                a ideia é usar essa requisição para pegar o idProcesso e idDocumento (id da ata)
                */

            }).catch(function() {
                console.log('Booo');
            });

    },
    filtraIdProcesso_IdAta: async function (idprocesso, idata) {

      await fetch("https://pje.trt11.jus.br/pje-comum-api/api/processos/id/" + idprocesso + "/documentos/id/" + idata + "?incluirAssinatura=false&incluirAnexos=false").then(function (response) {
        return response.json();
      }).then(function (data) {
        //console.log(data);

        localStorage.setItem("info_ata", JSON.stringify(data));
        //console.log("dados de cada ata...");

        //console.log(JSON.parse(localStorage.getItem("info_ata")));


        /*
        a ideia é usar essa requisição para pegar o criador da ata e a juíza que assinou
        */
      }).catch(function () {
        console.log('Booo');
      });


    },
  	
  	montaObjInfo: () => {
      //recuperando informações das audiências do dia
      data_aud = JSON.parse(localStorage.getItem("audiencias_dia"));

      
      /*varre  o objeto que contem as audiências do dia
      e mostra o idProcesso e idDocumento = id da Ata
  
      */
      viewObj = []; //objeto onde armazenaremos o resultado do filtro
      
      data_aud.pautasDoDia.forEach(async function (data, i) {
        //somente apresenta os horários em que houve audiência
        if (data.idProcesso) {
          //console.log(data.pautaAudienciaHorario.horaInicial);
          //console.log(data.idProcesso);
          //console.log(data.idDocumento);

          // pega a informação da ata
          // aqui queremos o criador da ata e a juíza
          //ele salva as informações no local storage
          //salva também em uma variável global (info_ata_por_id) para
          //facilitar a consulta e melhorar a performance
          await relatorios.filtraIdProcesso_IdAta(data.idProcesso, data.idDocumento);
          //console.log("montando viwobj...")
          //console.log(JSON.parse(localStorage.getItem("info_ata")))
          
          info_ata_por_id = await JSON.parse(localStorage.getItem("info_ata"));
          
          

          //recuperando informações sobre a ata
          //salvas na variável info_ata_por_id
          await viewObj.push({
            idProcesso: data.idProcesso,
            idAta: data.idDocumento,
            criador: info_ata_por_id.criador,
            juiza: info_ata_por_id.signatario,
            adiada: ""
          });
          await localStorage.setItem("viewObj", JSON.stringify(viewObj));
          
        }
      });
      
			

    },
    renderizaTabela: async function () {
      
      
      //verifica filtro juízas
      filtro = document.getElementById("filtro").value
      nomeJuiza = ''
      switch (filtro) {
        case 't':
          nomeJuiza = 'Todas';
          break;
        case 'st':
          nomeJuiza = 'STELLA LITAIFF ISPER ABRAHIM';
          break;
        
        case 'ss':
          nomeJuiza = 'SANDRA DI MAULO';
          break;
      
        default:
          nomeJuiza = 'Todas';
          break;
      }
      
      // rotina de renderização da tabela
      relatFinal = await JSON.parse(localStorage.getItem("viewObj"))

      var header = `
      <table class="t-class">
      <tr>
        <th id="idProcesso" class="th-class centralizado ng-star-inserted">idProcesso</th>
        <th id="idAta" class="th-class centralizado ng-star-inserted">idAta</th>
        <th id="criador" class="th-class centralizado ng-star-inserted">criador</th>
        <th id="juiza" class="th-class centralizado ng-star-inserted">juiza</th>
				<th id="juiza" class="th-class centralizado ng-star-inserted">Adiada</th>
      </tr>`;
      var corpo = '';

      await relatFinal.forEach(function (data) {
        //console.log("dados no forEach")
        //console.log(data)
        if (data.juiza == nomeJuiza){
          corpo = corpo + `<tr>
          <td class="centralizado td-class ng-star-inserted">${data.idProcesso}</td>
          <td class="centralizado td-class ng-star-inserted"><a href="https://pje.trt11.jus.br/pje-comum-api/api/processos/id/${data.idProcesso}/documentos/id/${data.idAta}/conteudo?incluirCapa=false&incluirAssinatura=true">${data.idAta}</a></td>
          <td class="centralizado td-class ng-star-inserted">${data.criador}</td>
          <td class="centralizado td-class ng-star-inserted">${data.juiza}</td>
          <td class="centralizado td-class ng-star-inserted">${data.adiada}</td>
          </tr>`
        }

        if (nomeJuiza == 'Todas'){
          corpo = corpo + `<tr>
          <td class="centralizado td-class ng-star-inserted">${data.idProcesso}</td>
          <td class="centralizado td-class ng-star-inserted"><a href="https://pje.trt11.jus.br/pje-comum-api/api/processos/id/${data.idProcesso}/documentos/id/${data.idAta}/conteudo?incluirCapa=false&incluirAssinatura=true">${data.idAta}</a></td>
          <td class="centralizado td-class ng-star-inserted">${data.criador}</td>
          <td class="centralizado td-class ng-star-inserted">${data.juiza}</td>
          <td class="centralizado td-class ng-star-inserted">${data.adiada}</td>
          </tr>`
        }


      });

      var tabela = `${header} ${corpo} </table>`
      
      await localStorage.setItem("tabela", tabela);


    },
  	
  	resetaLocalStorage: () => {
  					
  					// resetando o localstorage
      			localStorage.setItem("audiencias_dia","");
  					localStorage.setItem("info_ata", "");
  					localStorage.setItem("viewObj", "");			
		
		
		},
  
  	adiada: async function () {

          objPrincipal = JSON.parse(localStorage.getItem("viewObj"))
          console.log(objPrincipal.length)
          //até aqui OK
          
          for (let index = 0; index < objPrincipal.length; index++) {
            

            link = `https://pje.trt11.jus.br/pje-comum-api/api/processos/id/${objPrincipal[index].idProcesso}/audiencias?canceladas=true`
            console.log(link)
            await fetch(link)
                .then(function (response) {return response.json()})
                .then(function (data, i) { 
                      //rotina ao pegar os dados
                      todas = []
                      data.forEach(aud => {

                        //retorna o id de cada ata das audiências marcadas
                        todas.push(aud.idDocumento)
                        
                      });

                      console.log(todas)
                      //até aqui está correto
                      final = todas.length - 1;

                      
                      try {
                        console.log(todas[final])
                        console.log(objPrincipal[index].idAta)
                        if (todas[final] != objPrincipal[index].idAta){
                          
                          objPrincipal[index].adiada = "adiada"
                        } 
                      } catch (error) {
                        // bloco de tratamento do erro
                        console.log(error);
                      } 

                      





                  
                }).catch((err)=>{
                    console.log(err)

                })
    
          }
          await localStorage.setItem("viewObj", JSON.stringify(objPrincipal));

          
    },
  	renderizaFiltro: async function () {
      
      relatFinal = await JSON.parse(localStorage.getItem("viewObj"))

      var header = `
      <table class="t-class">
      <tr>
        <th id="idProcesso" class="th-class centralizado ng-star-inserted">idProcesso</th>
        <th id="idAta" class="th-class centralizado ng-star-inserted">idAta</th>
        <th id="criador" class="th-class centralizado ng-star-inserted">criador</th>
        <th id="juiza" class="th-class centralizado ng-star-inserted">juiza</th>
				<th id="juiza" class="th-class centralizado ng-star-inserted">Adiada</th>
      </tr>`;
      var corpo = '';

      await relatFinal.forEach(function (data) {
        //console.log("dados no forEach")
        //console.log(data)
        corpo = corpo + `<tr>
        <td class="centralizado td-class ng-star-inserted">${data.idProcesso}</td>
        <td class="centralizado td-class ng-star-inserted"><a href="https://pje.trt11.jus.br/pje-comum-api/api/processos/id/${data.idProcesso}/documentos/id/${data.idAta}/conteudo?incluirCapa=false&incluirAssinatura=true" target="_blank">${data.idAta}</a></td>
        <td class="centralizado td-class ng-star-inserted">${data.criador}</td>
        <td class="centralizado td-class ng-star-inserted">${data.juiza}</td>
				<td class="centralizado td-class ng-star-inserted">${data.adiada}</td>
        </tr>`
      });

      var tabela = `${header} ${corpo} </table>`
      
      await localStorage.setItem("tabela", tabela);


    }
}





setTimeout(function () {
    
  	// renderiza o botão de execução do script
  	console.log("testando script");
    botaoExecutar = document.getElementById("cdk-drop-list-0");
    console.log(botaoExecutar);
    filho = document.createElement("tr");
    filho.innerHTML = "<h4 style='textalign:center'>Relatório de Audiências Adiadas</h4>Juíza<select id='filtro'><option value='t'>Todas</option><option value='st' selected>STELLA LITAIFF ISPER ABRAHIM</option><option value='ss'>SANDRA DI MAULO</option></select><br>Data: <input type='date' id='dataRelatorio'><br><button id='btRelatorio' class='bt-primary'>Gerar Relatório</button>";
    botaoExecutar.appendChild(filho);
  
  	
  	//evento executado ao clicar no botão gerar relatório
    button = document.getElementById("btRelatorio");
    button.addEventListener('click', async ()=>{
      //await relatorios.resetaLocalStorage();
    	await relatorios.mensal();
      await relatorios.montaObjInfo();
      await relatorios.adiada();
      
      await relatorios.renderizaTabela();

      
      
      // gambiarra, encontrar solução mais elegante
      setTimeout(async function () {
      
      	console.log("******************* HTML ******************")
      	       
        
        tabela = await localStorage.getItem("tabela")
        framePje = document.getElementById("cdk-drop-list-0");
     		filhoTabela = document.createElement("table");
    		filhoTabela.innerHTML = tabela;
    		framePje.appendChild(filhoTabela);
        localStorage.clear();
        
        
        
      },500);
      
      
      
      
    })
  
  	//evento executado ao alterar a dataInicial
    dataRelat = document.getElementById("dataRelatorio")
  	dataRelat.addEventListener("change", ()=>{
      dataInicial = dataRelat.value;
  	});
  
  
  
  

}, 3000);
