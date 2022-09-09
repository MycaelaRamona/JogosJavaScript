var celulas = $(".celula_galo");
var checarTurno = true;
var jogador_x = "X";
var jogador_o = "O";
var empatefinal = "EMPATOU!";
var contador_segundos = 0;
var timerContador;
var nomeVencedor = "";
var vencedor_x = 0;
var vencedor_o = 0;
var empate = 0;
var rodada = 1;
var vencedorOficial = "Ninguém ainda";
var combinacoes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

document.addEventListener("click", (event) => {
    if(event.target.matches(".celula_galo")) {
        const dataId = event.target.id;
        const $celula_galo = $('.celula_galo[id="' + dataId + '"]');
        if($celula_galo.hasClass(jogador_x) || $celula_galo.hasClass(jogador_o)) {
            return;
        }
        jogar(dataId);
    }
});


function zerarVariaveis(){
    celulas = $(".celula_galo");
}

function marcarRodadas (){
    $('#rodada').html("Rodada " + rodada);
        rodada++;
}

function iniciarJogo() {

    if (!validar_nomeAB($("#nome_jogador1").val(), $("#nome_jogador2").val()))
        return;

    //precisou zerar a váriavel, pois ela estava apontando para a class antes dela existir.
    zerarVariaveis();
    let jogador_um = $('#nome_jogador1').val()
    let jogador_dois = $('#nome_jogador2').val()
    let jogad1 = $('#jogad1')
    jogad1.text(jogador_um)
    let jogad2 = $('#jogad2')
    jogad2.text(jogador_dois)
    

    $("#jogo_dogalo").css("display", "");
    $("#div_login").css("display", "none");
    iniciarContadorTempo()
    marcarRodadas();
}

function validar_nomeAB(jogador1, jogador1) {
    if ((jogador1.length < 3) || (jogador1.length < 3)) {
        alert("O jogador deve ter no mínimo 3 caracteres!");
        return false;
    }
    return true;
}

function iniciarContadorTempo() {
    timerContador = window.setInterval(() => {
        contador_segundos++;

        let minutos = Math.floor(contador_segundos / 60);
        let segundos = contador_segundos - minutos * 60;
        let contador =
            (new Array(2).join('0') + minutos).slice(-2) +
            ':' +
            (new Array(2).join('0') + segundos).slice(-2)
        ;

        $('#timer').html(contador);

    }, 1000);
}

function jogar(id){
    const celula_galo = document.getElementById(id);
    const turno = checarTurno ? jogador_x : jogador_o;
    celula_galo.textContent = turno;
    celula_galo.classList.add(turno);
    checarVencedor(turno);
}

function marcaProximo() {

    if (checarTurno === true) {
        $('#jogad1').removeClass('vez')
        $('#jogad2').addClass('vez')
    } else {
        $('#jogad1').addClass('vez')
        $('#jogad2').removeClass('vez')
    }
}

function checarVencedor (turno){
    let vencedor = combinacoes.some((comb) =>{
        return comb.every((index) => {
            return celulas[index].classList.contains(turno);
        })
    });


    if (vencedor){
        encerrarJogo(turno);
    } else if (checarEmpate()){
        encerrarJogo();
    } else {
        checarTurno = !checarTurno;
        marcaProximo()
    }
}

function checarEmpate()  {
    let x = 0;
    let o = 0;

    $(celulas).each(function(index, celula_galo) {
        if (celula_galo.classList.contains(jogador_x)){
            x++;
        }
        if (celula_galo.classList.contains(jogador_o)){
            o++;
        }
    } )
    return x + o === 9;
}

function limpaCelulas() {
    celulas.empty()
    document.querySelectorAll('.celula_galo').forEach(celula_galo => {
        celula_galo.classList.remove('X')
        celula_galo.classList.remove('O')
    });
}

function encerrarJogo(vencedor = null) {

    if (vencedor === jogador_x) {
        nomeVencedor = document.getElementById("nome_jogador1").value;
        vencedor_x++;
    } else if (vencedor === jogador_o) {
        nomeVencedor = document.getElementById("nome_jogador2").value;
        vencedor_o++;
    } else {
        nomeVencedor = empatefinal;
        empate++;
    }

    setTimeout(function () {
        if (vencedor) {
            final(vencedor);
            alert(nomeVencedor + " ganhou.");
            limpaCelulas();
        } else {
            final();
            alert("EMPATE!");
            limpaCelulas();
        }
        1000;
    });
    marcarRodadas();
}

function final (vencedor = null) {
    if (empate + vencedor_x + vencedor_o === 5) {
        if (vencedor_x > vencedor_o) {
            vencedorOficial = jogador_x
        } else if (vencedor_o > vencedor_x) {
            vencedorOficial = jogador_o
        } else {
            vencedorOficial = empate
        }
    } else {
        vencedorOficial = "Ninguém ainda"
    }
    if (vencedorOficial !== "Ninguém ainda") {
        reiniciar(vencedorOficial)
    }


}

function reiniciar(vencedorOficial) {
    setTimeout(function () {
        if (vencedorOficial === jogador_x || jogador_o) {
            if (confirm('***' + nomeVencedor + '*** Deseja jogar novamente?') === true) {
                registrarJogo();
                iniciarJogo();
                

            } else {
                registrarJogo()
                $("#img-banner").css("display", "");
                $('#pagina_HTML').html("");
            }
        }
        1000;
    });
}

function registrarJogo(){
    let date = new Date();
    registo_jogo.jogo = "jogodogalo";
    registo_jogo.jogador1 = $("#nome_jogador1").val();
    registo_jogo.jogador2 = $("#nome_jogador2").val();
    registo_jogo.vencedor = nomeVencedor;
    registo_jogo.contador_segundos = contador_segundos;
    registo_jogo.data = date.getTime();

    salvar_jogo();
    vencedor_x = 0;
    vencedor_o = 0;
    empate = 0;
    contador_segundos = 0;
    rodada = 1;
    limpaCelulas();
    window.clearInterval(timerContador);
    $('#timer').html('00:00');


}