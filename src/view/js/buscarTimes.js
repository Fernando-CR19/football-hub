import "dotenv/config";
import { writeFile } from "fs/promises";

const CODIGOS_DAS_LIGAS = ["PL", "PD", "FL1", "SA", "BL1", "BSA"];

async function searchForLeagueTeams(codigoDaLiga) {
  const resposta = await fetch(
    `https://api.football-data.org/v4/competitions/${codigoDaLiga}/teams`,
    { headers: { "X-Auth-Token": process.env.API_KEY } },
  );

  if (!resposta.ok) {
    throw new Error(
      `Falha ao buscar times da liga ${codigoDaLiga}: status ${resposta.status}`,
    );
  }

  const dados = await resposta.json();
  return dados.teams;
}

async function fetchAllTeams() {
  const todosOsTimes = [];

  for (const codigoDaLiga of CODIGOS_DAS_LIGAS) {
    console.log(`Buscando times de ${codigoDaLiga}...`);
    const timesDaLiga = await searchForLeagueTeams(codigoDaLiga);

    const timesResumidos = timesDaLiga.map((time) => ({
      id: time.id,
      name: time.name,
      shortName: time.shortName,
      crest: time.crest,
    }));

    todosOsTimes.push(...timesResumidos);
  }

  return todosOsTimes;
}

const times = await fetchAllTeams();
await writeFile("./times.json", JSON.stringify(times, null, 2));
console.log(`Pronto! ${times.length} times salvos em times.json`);
