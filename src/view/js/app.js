async function getTodayGames() {
  const response = await fetch("/api/jogos-hoje");
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.mensagem);
  }

  const jogos = await response.json();
  return jogos;
}

async function LoadTodaysGames() {
  const messageStatus = document.querySelector(".mensagem-de-status");
  messageStatus.textContent = "Carregando...";
  try {
    const jogos = await getTodayGames();
    ShowGamesScreen(jogos.matches);
  } catch (error) {
    document.querySelector(".lista-de-jogos").innerHTML = "";
    messageStatus.textContent = error.message;
  }
}

function CreateGameCard(jogo) {
  const cardDoJogo = document.createElement("article");
  cardDoJogo.className = "card-do-jogo";

  const horarioDoJogo = new Date(jogo.utcDate).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const placarDoMandante = jogo.score.fullTime.home;
  const placarDoVisitante = jogo.score.fullTime.away;
  const jogoJaTemPlacar =
    placarDoMandante !== null && placarDoVisitante !== null;

  const textoDoCentro = jogoJaTemPlacar
    ? `${placarDoMandante} x ${placarDoVisitante}`
    : horarioDoJogo;

  cardDoJogo.innerHTML = `
    <p class="card-campeonato">${jogo.competition.name}</p>
    <div class="card-confronto">
      <div class="card-time">
        <img src="${jogo.homeTeam.crest}" alt="Escudo do ${jogo.homeTeam.name}" />
        <span>${jogo.homeTeam.shortName || jogo.homeTeam.name}</span>
      </div>
      <strong class="card-centro">${textoDoCentro}</strong>
      <div class="card-time">
        <img src="${jogo.awayTeam.crest}" alt="Escudo do ${jogo.awayTeam.name}" />
        <span>${jogo.awayTeam.shortName || jogo.awayTeam.name}</span>
      </div>
    </div>
    <p class="card-status">${jogo.status}</p>
  `;

  return cardDoJogo;
}

function ShowGamesScreen(listaDeJogos) {
  const mensagemDeStatus = document.querySelector(".mensagem-de-status");
  const containerDaLista = document.querySelector(".lista-de-jogos");

  containerDaLista.innerHTML = "";

  if (listaDeJogos.length === 0) {
    mensagemDeStatus.textContent = "Nenhum jogo hoje";
    return;
  }

  mensagemDeStatus.textContent = "";

  listaDeJogos.forEach((jogo) => {
    containerDaLista.appendChild(CreateGameCard(jogo));
  });
}

LoadTodaysGames();
