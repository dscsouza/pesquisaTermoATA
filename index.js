
mostra a ata

                                        IDProces         ID.ATA
https://pje.trt11.jus.br/pjekz/processo/524465/documento/24542072/conteudo





pautadodia.4.idProcesso
pautadodia.4.idDocumento



const relatorios = {
    mensal: ()=> {

            fetch("https://pje.trt11.jus.br/pje-comum-api/api/pautasaudiencias/classificacoes/dia?idSalaAudiencia=17&data=2022-08-01").then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log(data);
            }).catch(function() {
                console.log('Booo');
            });

    }

    
}




setTimeout(function () {
    console.log("testando script");
    botaoExecutar = document.getElementById("cdk-drop-list-0");
    console.log(botaoExecutar);
    filho = document.createElement("tr");
    filho.innerHTML = "<button onclick='geraRelatorio()'>Executar</button>";
    botaoExecutar.appendChild(filho);







}, 4000);




principal = document.body;
func = document.createElement("script");
func.innerHTML = `		
  const relatorios = {
mensal: ()=> {

      fetch("https://pje.trt11.jus.br/pje-comum-api/api/pautasaudiencias/classificacoes/dia?idSalaAudiencia=17&data=2022-08-01").then(function(response) {
          return response.json();
      }).then(function(data) {
          console.log(data);
      }).catch(function() {
          console.log('Booo');
      });

              }

  }

  }`;
principal.appendChild(func);

`tetetete${teste}tetetete`



dataRelat = document.getElementById("dataRelatorio")
dataRelat.addEventListener("change", ()=>{
    dataInicial = dataRelat.value;
});




