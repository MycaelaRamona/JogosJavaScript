let jogadorAmarelo = 'A'
let jogadorVermelho = 'V'
let jogadorAtual = jogadorVermelho

let gameOver = false
let tabuleiro
let lugarColunas

let linhas = 6
let colunas = 7

// Global para o Intervalo Local
let intervaloQl
let contador_segundosQL
let nomeVencedorQL

/**
 * Esta função deve ser executada sempre que se inicia o jogo.
 * De inicio, ela zera a variavel global para contagem de segundos (contadorsegundosQL)
 * Na sequencia e realizada a montagem do tabuleiro do jogo pela funçao preparaTela
 * identifica o proximo jogador com a borda da box e inicia a contagem do tempo.
 * @return Null
 */
function iniciar_jogo() {

    if (!validar_nomeQL($("#nome_jogador1").val(), $("#nome_jogador2").val()))
        return;

    $("#quatroLinha").css("display", "");
    $("#div_login").css("display", "none");

    contador_segundosQL = 0; //sempre zera a variável quando o jogo inicia

    preparaTela();
    marcaProximo();
    // atribuindo o timer a uma variável global para poder limpar e reiniciar o mesmo sem
    // causar o descompasso na contagem
    intervaloQl = setInterval(() => {
        contador_segundosQL++;

        let minutos = Math.floor(contador_segundosQL / 60);
        let segudos = contador_segundosQL - (minutos * 60);
        let contador = (('00') + minutos).slice(-2) + ':' + (('00') + segudos).slice(-2);

        $('#contadorQL').html(contador);
    }, 1000);

}

/**
 * Funcao para validar a entrada dos nomes
 * @return boolean
 * */
function validar_nomeQL(nome1, nome2) {
    if ((nome1.length < 2) || (nome2.length < 2)) {
        alert("Nome tem que ter pelo menos 2 caracteres!");
        return false;
    }
    return true;
}

/** Funçao para aplicar Expressão regular - REGEX com os caracteres validos
 * 
 */
function excluiEspeciais(entrada) {
    var validos = /[^a-zç' '0-9]/gi; //^ Tudo EXCETO o que segue // gi Global I inclui Lower e Uppercases
    entrada.value = entrada.value.replace(validos, "") //Tudo que Não pertence ao Validos sera substituido por nada

}

/**
 * Cria/inicializa o array de controle da próxima posiçao livre
 * Atribui os nomes aos boxes identificadores do Jogador 1 (Vermelho) e Jogador 2 (Amarelo)
 * Realiza a montagem e mapeamento das celulas
 * cria a matriz de controle de preenchimento vazia
 * Cria os listeners para os eventos Click, MouseEnter e MouseLeave
 * Click - responsavel por "Pintar" a celula, atualizar a matrix de controle de preenchimento e testar vitoria
 * MouseEnter - resposavel por exibir onde caira a proxima peça
 * MouseLeave - limpa onde a peça iria cair
 *
 * @return Null
 */
function preparaTela() {

    gameOver = false
    tabuleiro = []
    lugarColunas = [5, 5, 5, 5, 5, 5, 5]
    let jogador1 = $('#nome_jogador1')
    let nome1 = jogador1.val()
    let jogador2 = $('#nome_jogador2')
    let nome2 = jogador2.val()
    let jog1 = $('#jog1')
    jog1.text(nome1)
    let jog2 = $('#jog2')
    jog2.text(nome2)
    nomeVencedorQL = ''

    for (let l = 0; l < linhas; l++) {
        let linha = []
        for (let c = 0; c < colunas; c++) {

            linha.push(' ')

            // Montagem das células dentro da grid
            // Esta realizando o append de DIVs individuais (celulas) com respectivos IDs para facilitar o acesso
            $('#tabuleiro').append(`
            <div id=${l.toString() + '-' + c.toString()} class="celula"></div>
            `)
        }
        tabuleiro.push(linha)
    }

    $('.celula').on({
        click: function() {
            preparaLugar(this.id)
        },
        mouseenter: function() {
            indicaProximaCelula(this.id)
        },
        mouseleave: function() {
            limpaProximaCelula(this.id)
        }
    })

    $('#jogarNovamente').on({
        click: function() {
            novoJogo(true)
        }
    })

    $('#finalizar').on({
        click: function() {
            novoJogo(false)
        }
    })

}

/**
 * Realiza a alternancia indicando qual é o jogador atual
 * Troca qual #jog possui a borda indicando o jogador corrente *
 * @return Null
 */
function marcaProximo() {

    if (jogadorAtual === jogadorVermelho) {
        $('#jog1').addClass('jogAtual')
        $('#jog2').removeClass('jogAtual')
    } else {
        $('#jog2').addClass('jogAtual')
        $('#jog1').removeClass('jogAtual')
    }
}

/**
 * Retorna o Objeto que devera ser colorido
 * Este codigo era antes dentro da preparaLugar, mas foi transformada em funçao para ser reutilizada
 * no Click, MouseEnter e MouseLeave
 * @return celula
 */
function retornaCoordenadas(elementoId, atualiza) {
    let coords = elementoId.split('-') //'0-0' -> ['0', '0']
    coords[1] = parseInt(coords[1])
    let c = coords[1]
    let l = lugarColunas[c]

    if (l < 0) {
        return;
    }

    if (atualiza) { //se for para atualizar o mapeamento - no caso do Click, entra aqui
        //atualiza o array ajustando a altura da linha para a coluna corrente
        lugarColunas[c] = l - 1
    }
    // na conversao para JQuery, o GET(0) é para recuperar o primeiro elemento - DOM
    // SEM o get iria retornar uma lista
    return $(`#${l.toString()+'-'+c.toString()}`).get(0)
}

/**
 * Responsavel por pintar a proxima celula onde caira a ficha
 * @return null
 */
function indicaProximaCelula(elementoId) {
    let celula = retornaCoordenadas(elementoId, false)
    $(celula).addClass(`prox-${jogadorAtual}`)
}
/**
 * Responsavel por remover a classe que indica a proxima celula
 * remove apenas da celula que acabou de deixar no MouseLeave
 * @return null
 */
function limpaProximaCelula(elementoId) {
    let celula = retornaCoordenadas(elementoId, false)
    $(celula).removeClass(`prox-${jogadorAtual}`)
}
/**
 * Executada pelo Click - recupera qual célula devera ser pintada e ATUALIZA array de controle
 * "Limpa" a celula alvo - pelo ID da mesma realiza a atualizaçao da Matriz de Controle
 * "Pinta" a celula alvo e Muda qual o jogador Atual - muda o indicativo no Box de nome tambem
 * executa a funçao para mostrar o proximo pois se manter na mesma coluna, nao dispara o
 * MouseEnter
 * A validaçao de vencedor esta em um TimeOut pois estava exibindo a mensagem ANTES de exibir a celula pintada
 * *
 * @return null
 */
function preparaLugar(elementoId) {
    if (gameOver) {
        return
    }
    // calulaAlvo e o objeto que temos de atualizar no Click
    let celulaAlvo = retornaCoordenadas(elementoId, true)
    $(celulaAlvo).removeClass(`prox-${jogadorAtual}`)
        //Trabalhando o ID da celulaAlvo para atualizar o mapa de celulas
    let coords = celulaAlvo.id.split('-') //'1-3' -> ['1', '3']
    let l = parseInt(coords[0])
    let c = parseInt(coords[1])
    tabuleiro[l][c] = jogadorAtual

    //Definindo a cor da celulaAlvo e atualizando o Jogador Seguinte
    if (jogadorAtual === jogadorVermelho) {
        $(celulaAlvo).addClass(`espaco_vermelho`)
        jogadorAtual = jogadorAmarelo
    } else {
        $(celulaAlvo).addClass(`espaco_amarelo`)
        jogadorAtual = jogadorVermelho
    }
    marcaProximo()
    indicaProximaCelula(celulaAlvo.id)

    setTimeout(() => {
        verificarVencedor()
    }, 100)

}

/**
 * Testa se todas as posiçoes do array de controle foram utilizadas sem ter vitoria
 * @return {boolean}
 */
function testaEmpate() {
    let empate = true
    lugarColunas.forEach(function(col) {
        if (col >= 0) {
            empate = false
        }
    })
    return empate
}

/**
 * Funçao responsavel por testar/validar todas as condiçoes de vitoria
 * Adicionado funçao com teste para EMPATE
 */
function verificarVencedor() {
    //horizontalmente
    for (let l = 0; l < linhas; l++) {
        for (let c = 0; c < colunas - 3; c++) {
            if (tabuleiro[l][c] !== ' ') {
                if (tabuleiro[l][c] === tabuleiro[l][c + 1] && tabuleiro[l][c + 1] === tabuleiro[l][c + 2] && tabuleiro[l][c + 2] === tabuleiro[l][c + 3]) {
                    conjuntoVencedor(l, c, true)
                    return
                }
            }
        }
    }
    //verticalmente
    for (let c = 0; c < colunas; c++) {
        for (let l = 0; l < linhas - 3; l++) {
            if (tabuleiro[l][c] !== ' ') {
                if (tabuleiro[l][c] === tabuleiro[l + 1][c] && tabuleiro[l + 1][c] === tabuleiro[l + 2][c] && tabuleiro[l + 2][c] === tabuleiro[l + 3][c]) {
                    conjuntoVencedor(l, c, true)
                    return;
                }
            }
        }
    }
    //anti diagonal(\)
    for (let l = 0; l < linhas - 3; l++) {
        for (let c = 0; c < colunas - 3; c++) {
            if (tabuleiro[l][c] !== ' ') {
                if (tabuleiro[l][c] === tabuleiro[l + 1][c + 1] && tabuleiro[l + 1][c + 1] === tabuleiro[l + 2][c + 2] && tabuleiro[l + 2][c + 2] === tabuleiro[l + 3][c + 3]) {
                    conjuntoVencedor(l, c, true)
                    return;
                }
            }
        }
    }
    //diagonal(/)
    for (let l = 3; l < linhas; l++) {
        for (let c = 0; c < colunas - 3; c++) {
            if (tabuleiro[l][c] !== ' ') {
                if (tabuleiro[l][c] === tabuleiro[l - 1][c + 1] && tabuleiro[l - 1][c + 1] === tabuleiro[l - 2][c + 2] && tabuleiro[l - 2][c + 2] === tabuleiro[l - 3][c + 3]) {
                    conjuntoVencedor(l, c, true)
                    return;
                }
            }
        }
    }
    //let empate = testaEmpate();
    if (testaEmpate()) {
        conjuntoVencedor(0, 0, false);
    }
}

/**
 * Quando encontra um conjunto vencedor, verifica quem e o "Dono" da celula (Vermelho-Jogador1/Amarelo-Jogador2)
 * e seta o mesmo como Vencedor - grava as informaçeos do jogo
 * Questiona se jogadores querem Nova Partida ou Encerrar
 * o Mesmo é feito quanto se trata de um Empate - grava as informaçoes do jogo
 * @param l Int
 * @param c Int
 * @param vitoria Boolean
 */
function conjuntoVencedor(l, c, vitoria) {
    let contador = $('#contadorQL')
    let tempo = contador.text()
    let jogVencedor

    if (gameOver === false) {
        if (vitoria) {
            if (tabuleiro[l][c] === jogadorVermelho) {
                jogVencedor = $('#jog1')
                    //nome = jogVencedor.text()
                nomeVencedorQL = jogVencedor.text()

            } else {
                jogVencedor = $('#jog2')
                    //nome = jogVencedor.text()
                nomeVencedorQL = jogVencedor.text()
            }
            gameOver = true
                // Grava dados do jogo e exibe mensagem pela modal
            jogo_terminou(nomeVencedorQL)
            $('#h1Alerta').text(`Parabéns, ${nomeVencedorQL} ganhou com o tempo de ${tempo}! Desejam jogar novamente?`)
            /* $('#alertaModal').addClass("exibir") */
        } else {
            // Grava dados do jogo e exibe mensagem pela modal
            jogo_terminou('Empate')
            $('#h1Alerta').text(`O jogo terminou sem vencedores em ${tempo}! Desejam jogar novamente?`)
            /* $('#alertaModal').addClass("exibir") */
        }
        $('#alertaModal').addClass("exibir")
    }
}

/**
 * Grava Histórico - reseta jogo
 * limpa o Intervalo para Nao ter o problema do tempo que "Corre" mais a cada partida
 * @param jogar_novamente
 * @param vencedor
 */
function jogo_terminou(vencedor) {
    let date = new Date();

    registo_jogo.jogo = "quatroemlinha";
    registo_jogo.jogador1 = $('#nome_jogador1').val();
    registo_jogo.jogador2 = $('#nome_jogador2').val();
    registo_jogo.vencedor = vencedor;
    registo_jogo.contador_segundos = contador_segundosQL
    registo_jogo.data = new Date(date.getTime()).toJSON();

    salvar_jogo();
    clearInterval(intervaloQl)

}

/** Esconde a modal
 *  de acordo com a escolha do usuário, reinicia o jogo ou encerra
 */
function novoJogo(jogar_novamente) {
    clearInterval(intervaloQl)
    let alerta = $('#alertaModal')
    alerta.removeClass("exibir")

    if (jogar_novamente) {
        limpaTela()
    } else {
        contador = $('#contadorQL')
        $("#img-banner").css("display", "");
        $('#pagina_HTML').html("");
    }
}

/**
 * "Limpa" a DIV do tabuleiro e entao recria tabuleiro, matriz e reinicia o jogo
 */
function limpaTela() {
    tabu = $('#tabuleiro')
    tabu.empty()
    iniciar_jogo()
}