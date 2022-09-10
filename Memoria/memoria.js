const input_nome = $('#nome_jogador');      // referência para o input do DOM do nome do jogador
const botao_play = $('#botao_play');
const formulario_login = $('#login_form');
const grelha_jogo = $('#grelha_jogo');

let contador_segundos_memoria;  
let primeira_carta = '';
let segunda_carta = '';
let primeira_carta_id = '';
let segunda_carta_id = '';
let num_cartas ;
let jogo_pronto;
let baralho = [];
let quant_match;
let apontador_contador;


$(document).ready(function () {
    $("#jogo_memoria").css("display", "none");
})


/**
 * Esta função é chamada toda vez que o jogo é iniciado.
 */
function iniciar_jogo_memoria() {
    baralho = [];
    quant_match = 0;
    jogo_pronto = true;
    contador_segundos_memoria = 0;
    $('#contador').css('display', '');
    $('#contador').html("00:00");

    if(typeof apontador_contador != "undefined") // maneira encontrada parar corrigir erro do contador
        clearInterval(apontador_contador);      // contando de maneira errada.

    if (!validar_nome_memoria($("#nome_jogador").val()))
        return;     //o return serve para não deixar o jogador avançar sem inserior o nome.
    $("#jogo_memoria").css("display", ""); 
    $("#menu-memoria").css("display", "none");


    gerar_grelha_jogo();
    
    
    apontador_contador = window.setInterval(() => {
        contador_segundos_memoria++;

        let minutos = Math.floor(contador_segundos_memoria / 60); 
        let segundos = contador_segundos_memoria - minutos * 60; 

        let contador =
            ('00' + minutos).slice(-2) + 
            ':' +
            ('00' + segundos).slice(-2)
            ;

        $('#contador').html(contador);
    }, 1000);
};

/**
 * Esta função valida o nome, a string do nome deve ter pelo menos 3 caracteres
 * @param {string} nome_jogadorValue - Uma varável com o nome do jogador
 * @return {boolean} Retorna True se o nome tiver mais de 3 caractrees, caso contrário retorna false
 */
 function validar_nome_memoria(nome_jogadorValue) {

    if (nome_jogadorValue.length <= 2) {
        alert("Nome tem que ter mais de 2 caracters!");
        return false;
    }
    return true;
};

/** Funçao para aplicar Expressão regular - REGEX com os caracteres validos
 * 
 */
 function exclui_caracteres_especiais(entrada) {
    let validos_char = /[^a-zç' '0-9]/gi; //^ Tudo EXCETO o que segue // gi Global I inclui Lower e Uppercases
    entrada.value = entrada.value.replace(validos_char, "") //Tudo que Não pertence ao Validos sera substituido por nada

}

/**
* Esta função gera um baralho de acordo com o número de cartas escolhido na grid.
*/

function gerar_baralho() {
   
    for (let i = 0; i < num_cartas; i += 2) {

        baralho.push(i / 2)  // i -> 0, 2, 4, 6, 8, 10
        baralho.push(i / 2)  // i / 2 -> 0, 1, 2, 3, 4, 5
        
        
    }
    

    baralharCartas();
};


/**
    Esta função vai alterar o array baralho.
    Trocando o seu conteudo de uma forma aleatoria.
*/
function baralharCartas() {
    let indice_atual = num_cartas;
    let indice_aleatorio;
    while (indice_atual > 0) {
        indice_aleatorio = Math.floor(
            Math.random() * indice_atual
        );

        indice_atual--;

        // na seguinte linha vamos TROCAR 2 valores em duas posições
        [baralho[indice_atual], baralho[indice_aleatorio]] = [baralho[indice_aleatorio], baralho[indice_atual]];
       
    }
}
/**
 * Esta função gera de forma dinamica através de jQuery a grelha do jogo,
 * de acordo com o value do nível escolhido.
 */

function gerar_grelha_jogo() {
   $('#grelha_jogo').empty();

    num_cartas = parseInt($('#selecao_nivel').val(), 10);

    gerar_baralho();
    console.log('Console.log do baralho: ' + baralho);

    for (let i = 0; i < num_cartas; i++) {
        $('#grelha_jogo').append(`
        <div class="carta_img" id="${i}">
            <div class="face frente" style = "background-image: url('./img/${baralho[i]}.png')" ></div>
            <div class="face verso"></div>
        </div>
    `)
    }
    $(".carta_img").on("click", mostra_carta);
};

/**
 * Essa função verifica as cartas seleciondas, se as cartas derem match, elas
 * são ocutadas, se não der match elas voltam a ficarem de costas. Por fim verifica
 * se o jogo terminou.
 */

function verificar_carta() {
    jogo_pronto = false;

    if (baralho[primeira_carta_id] === baralho[segunda_carta_id]) {
        let nome_ganhador = $('#nome_jogador').val();
        quant_match += 2;
        //console.log("quant_match: " + quant_match);
        //console.log("num_cartas: " + num_cartas);
        if (quant_match === num_cartas) {

            setTimeout(function () {

                gerar_popup();

            }, 300);

        }
        setTimeout(ocultar_cartas_matched, 300); 
    }
    else {
        setTimeout(mostrar_verso, 600);
    }
    primeira_carta_id = '';
    segunda_carta_id = '';
}

/**
 * Esta função é chamada sempre que clicamos em uma carta que esta 
 * mostrando o seu verso.
 */


function mostrar_verso() {
    primeira_carta.classList.remove('mostra_carta')
    segunda_carta.classList.remove('mostra_carta')
    jogo_pronto = true;
}

/**
 * Esta função é chamada sempre que clicamos na carta,
 * ao clicar na carta ela atribui uma class mostra_carta
 * assim como verifica se a carta ja foi clica anteriormente.
 * Depois de virar a carta ela obtem o id da carta clicada.
 * Por ultimo ela chama a função verificar carta para as duas cartas
 * clicadas.
 */

function mostra_carta({ target }) {
    // target aponta para o div(PAI) que contem as duas imagens das cartas

    if (!jogo_pronto) {
        // o jogador está a tentar virar a terceira carta e ainda está a ocorrer a animação
         console.log("Aguarde carregar o jogo!");
        return;
    }

    if (target.parentNode.className.includes('mostra_carta')) {
        // se clicar na mesma carta não faz nada
        
        //console.log("Clique em outra carta!")
        return;
    }
    //deixar eu virar a primeira e depois a segunda carta
    if (primeira_carta_id === '') {
        target.parentNode.classList.add('mostra_carta');

        primeira_carta = target.parentNode;


        primeira_carta_id = target.parentNode.getAttribute('id');


    }
    else if (segunda_carta_id === '') {
        target.parentNode.classList.add('mostra_carta');

        segunda_carta = target.parentNode;
        segunda_carta_id = target.parentNode.getAttribute('id');
    }

    if (primeira_carta_id != '' && segunda_carta_id != '') {
        verificar_carta();

    }

};

/**
 * Esta função é chamada quando os pares de cartas dão match,
 * após dar match ela atribui uma class para ocupar as cartas pares.
 */

function ocultar_cartas_matched() {
   
    primeira_carta.classList.add('esconde_carta')
    segunda_carta.classList.add('esconde_carta')

    jogo_pronto = true;
}

/**
 * Esta fução é chamada assim que o jogo temrina,
 * Através desta função enviamos as propriedades recebidas do jogo terminado para a lista
 * registo_jogo.
 */

function jogo_terminou_memoria() {
    let date = new Date();
    registo_jogo.jogo = "memoria";
    registo_jogo.jogador1 = $("#nome_jogador").val();
    registo_jogo.contador_segundos = contador_segundos_memoria;
    registo_jogo.data = date.getTime();    // obtem a hora mundial sem o fuso horário local.
    registo_jogo.jogador2 = "";
    registo_jogo.vencedor = "";
    salvar_jogo();
    //console.log("Teste jogo terminou");

}

function gerar_popup() {
    console.log("grelha_popup");
    let nome_ganhador = $('#nome_jogador').val();
    $('#grelha_jogo').css('display', 'none');
    $('#contador').css('display', 'none');

    $('#popup-final').css('display', '');

    $('#popup-final').html(`

    <div class="div-modal" >
        <div class="modal">
        <img src="../img/Joystick_popup.png" id="img-joystick" alt="Logo Joystick Menu">
            <h3>JOGO TERMINOU</H3>
            <p>Parabéns <b>${nome_ganhador}</b> você terminou com sucesso! Deseja jogar novamente?</p>
            <button id="jogar-novamente">OK</button>
            <button id="voltar-menu">MENU</button>
        </div>
    </div>
    
    `)

    jogo_terminou_memoria();
    $('#jogar-novamente').on("click", () =>{
        $(".div-modal").css("display", "none");
        $('#grelha_jogo').css('display', '');
        
        iniciar_jogo_memoria();
    });
   
    
    $('#voltar-menu').on("click", () => {
        $("#img-banner").css("display", "");
        $('#pagina_HTML').html("");
    });

};


