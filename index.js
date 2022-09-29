let selecao_jogo = $('#form_jogo');
let date = new Date();
let registo_jogo = {
    jogo: "",
    jogador1 : "",
    jogador2 : "",
    data: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON(),
    contador_segundos: 0,
    vencedor: ""
}

/**
 * Esta função não recebe parametros de entrada.
 * Ao selecionar o jogo na página do index, o mesmo é salvo
 * dentro da variável pagina_HTML.
 * Nesta função carregamos a página escolhida.
 */
function selecionar_jogo(){

    let pagina_HTML = $("#menu-jogos").val();
  
    $("#img-banner").css("display", "none");
  
    $("#form_jogo").removeClass("fora-do-jogo");
  
    $('#pagina_HTML').load(`${pagina_HTML + ".html"}`); 

    
    //console.log(pagina_HTML);
  }

/**
 * Esta função salva no localStorage as informações obtidas do jogo,
 * ela é uma função comum a todos os jogos.
 */
function salvar_jogo() {
    console.log("teste salvar");
    let historico_jogo = localStorage.getItem("historico_jogo");
    if (!historico_jogo) {
        historico_jogo = [];
    }    
    else {
        //busca a strig objeto JSON e converte em objeto javascript
        historico_jogo = JSON.parse(historico_jogo);
    }
    //usei o unshift para colocar o ultimo array de histório no inicio da tabela de resultados
    historico_jogo.unshift(registo_jogo);
    localStorage.setItem('historico_jogo', JSON.stringify(historico_jogo));
};










