const URL = `https://api.football-data.org/v4/matches/?${getDataAtualYYYYMMDD()}`;

export async function TodaysGames() {
  try {
    const res = await fetch(`${URL}`, {
      headers: { "X-Auth-Token": process.env.API_KEY },
    });
    if (res.status === 200) {
      const obj = await res.json();
      return obj;
    }
  } catch (error) {
    const message = `Não foi possível buscar os jogos de hoje`;
    throw new Error(message);
  }
}

function getDataAtualYYYYMMDD() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
