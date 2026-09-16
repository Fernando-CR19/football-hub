async function getTodayGames() {
  const response = await fetch("/api/jogos-hoje");
  const jogos = await response.json();
  console.log(jogos);
}
