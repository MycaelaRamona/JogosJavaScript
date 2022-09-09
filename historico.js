$(document).ready(function(){
  
  let historico_jogo = localStorage.getItem("historico_jogo");
  if (historico_jogo) {
    mostra_historico_jogo(JSON.parse(historico_jogo));
  }
})

/**
 * Função que imprime os resultados do históricos
 * dos jogos. Ela é responsável por inserir de forma dinamica
 * as linhas da tabela (histórico).
 */

function mostra_historico_jogo(historico_jogo) {


  historico_jogo.forEach(function(registo_jogo){
    let linha_tabela;

    linha_tabela = `
    <tr style="border:solid 1px;">
      <td>
        ${registo_jogo.jogo}
      </td>
    `

    if (registo_jogo.jogo == "memoria") {
      linha_tabela += `
      <td>
        ${registo_jogo.jogador1}
      </td>
      <td>
      
      </td>
      <td>
      
      </td>
      `
    }
    else
    linha_tabela += `
    <td>
      ${registo_jogo.jogador1}
    </td>
    <td>
      ${registo_jogo.jogador2}
    </td>
    <td>
      ${registo_jogo.vencedor}
    </td>

    `
  

    let data = new Date(registo_jogo.data).toLocaleString({hour12: false});


    linha_tabela += `
      <td>
        ${data}
      </td>
       <td>
        ${registo_jogo.contador_segundos}
      </td>
      
    </tr>
  `;

    $('#tabela-resultados').append(linha_tabela);

  }

)}