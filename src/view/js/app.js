async function getTodayGames() {
  const response = await fetch("/api/jogos-hoje");
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.message);
  }

  const jogos = await response.json();
  return jogos;
}

async function LoadTodaysGames() {
  try {
    const jogos = await getTodayGames();
    console.log(jogos);
  } catch (error) {
    console.error(error.message);
  }
}

LoadTodaysGames();
