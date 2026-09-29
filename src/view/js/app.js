let jogosDeHoje = [];

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
    jogosDeHoje = jogos.matches;
    ShowGamesScreen(jogosDeHoje);
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

  const idDoTimeFavorito = localStorage.getItem("idDoTimeFavorito");
  const idsDosTimesSeguidos = getFollowedTeamIds();

  const mandanteEhFavorito = String(jogo.homeTeam.id) === idDoTimeFavorito;
  const visitanteEhFavorito = String(jogo.awayTeam.id) === idDoTimeFavorito;

  const mandanteEhSeguido = idsDosTimesSeguidos.includes(
    String(jogo.homeTeam.id),
  );
  const visitanteEhSeguido = idsDosTimesSeguidos.includes(
    String(jogo.awayTeam.id),
  );

  const marcadorDoMandante = mandanteEhFavorito
    ? "⭐ "
    : mandanteEhSeguido
      ? "🟢 "
      : "";
  const marcadorDoVisitante = visitanteEhFavorito
    ? "⭐ "
    : visitanteEhSeguido
      ? "🟢 "
      : "";

  cardDoJogo.innerHTML = `
    <p class="card-campeonato">${jogo.competition.name}</p>
    <div class="card-confronto">
      <div class="card-time">
        <img src="${jogo.homeTeam.crest}" alt="Escudo do ${jogo.homeTeam.name}" />
        <span>${marcadorDoMandante}${jogo.homeTeam.shortName || jogo.homeTeam.name}</span>
      </div>
      <strong class="card-centro">${textoDoCentro}</strong>
      <div class="card-time">
        <img src="${jogo.awayTeam.crest}" alt="Escudo do ${jogo.awayTeam.name}" />
        <span>${marcadorDoVisitante}${jogo.awayTeam.shortName || jogo.awayTeam.name}</span>
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

function filterByLeague() {
  const ligaEscolhida = document.querySelector(".filtro-de-liga").value;

  if (ligaEscolhida === "TODAS") {
    ShowGamesScreen(jogosDeHoje);
    return;
  }

  const jogosDaLigaEscolhida = jogosDeHoje.filter(
    (jogo) => jogo.competition.code === ligaEscolhida,
  );

  ShowGamesScreen(jogosDaLigaEscolhida);
}

async function loadTeamList() {
  const response = await fetch("/api/times");
  const times = await response.json();

  const seletorDeTimeFavorito = document.querySelector(".time-favorito");
  const seletorParaSeguirTime = document.querySelector(".dropdown-seguir-time");

  times.forEach((time) => {
    const opcaoParaFavorito = document.createElement("option");
    opcaoParaFavorito.value = time.id;
    opcaoParaFavorito.textContent = time.shortName || time.name;
    seletorDeTimeFavorito.appendChild(opcaoParaFavorito);

    const opcaoParaSeguir = document.createElement("option");
    opcaoParaSeguir.value = time.id;
    opcaoParaSeguir.textContent = time.shortName || time.name;
    seletorParaSeguirTime.appendChild(opcaoParaSeguir);
  });

  const idDoTimeFavoritoSalvo = localStorage.getItem("idDoTimeFavorito");
  if (idDoTimeFavoritoSalvo) {
    seletorDeTimeFavorito.value = idDoTimeFavoritoSalvo;
  }
}

function saveFavoriteTeam() {
  const idDoTimeEscolhido = document.querySelector(".time-favorito").value;
  localStorage.setItem("idDoTimeFavorito", idDoTimeEscolhido);
}

function followTeam() {
  const seletorParaSeguirTime = document.querySelector(".dropdown-seguir-time");
  const idDoTimeEscolhido = seletorParaSeguirTime.value;

  if (idDoTimeEscolhido === "") {
    return;
  }

  const idsDosTimesSeguidos = getFollowedTeamIds();

  if (idsDosTimesSeguidos.includes(idDoTimeEscolhido)) {
    return;
  }

  idsDosTimesSeguidos.push(idDoTimeEscolhido);
  localStorage.setItem(
    "idsDosTimesSeguidos",
    JSON.stringify(idsDosTimesSeguidos),
  );

  seletorParaSeguirTime.value = "";
  showFollowedTeams();
}

function getFollowedTeamIds() {
  const idsSalvos = localStorage.getItem("idsDosTimesSeguidos");
  return idsSalvos ? JSON.parse(idsSalvos) : [];
}

function showFollowedTeams() {
  const containerDaLista = document.querySelector(".lista-de-times-seguidos");
  containerDaLista.innerHTML = "";

  const idsDosTimesSeguidos = getFollowedTeamIds();

  idsDosTimesSeguidos.forEach((idDoTime) => {
    const opcaoCorrespondente = document.querySelector(
      `.dropdown-seguir-time option[value="${idDoTime}"]`,
    );
    const nomeDoTime = opcaoCorrespondente
      ? opcaoCorrespondente.textContent
      : idDoTime;

    const itemDaLista = document.createElement("li");
    itemDaLista.innerHTML = `
      ${nomeDoTime}
      <button onclick="unfollowTeam('${idDoTime}')">Remover</button>
    `;

    containerDaLista.appendChild(itemDaLista);
  });
}

function unfollowTeam(idDoTime) {
  const idsDosTimesSeguidos = getFollowedTeamIds();
  const idsSemOTimeRemovido = idsDosTimesSeguidos.filter(
    (id) => id !== idDoTime,
  );

  localStorage.setItem(
    "idsDosTimesSeguidos",
    JSON.stringify(idsSemOTimeRemovido),
  );

  showFollowedTeams();
}

LoadTodaysGames();
loadTeamList();
showFollowedTeams();
