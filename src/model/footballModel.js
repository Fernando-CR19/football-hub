import { readFile } from "fs/promises";

export async function TodaysGames() {
  //const URL = `https://api.football-data.org/v4/matches?date=${getDataAtualYYYYMMDD()}`;
  const URL = `https://api.football-data.org/v4/matches?date=2026-10-07`;

  let response;

  try {
    response = await fetch(`${URL}`, {
      headers: { "X-Auth-Token": process.env.API_KEY },
    });
  } catch (error) {
    const message = `Não foi possível conectar a API de futebol`;
    throw new Error(message);
  }

  if (!response.ok) {
    throw new Error(
      `A api de futebol respondeu com status: ${response.status}`,
    );
  }

  const jogos = await response.json();
  return jogos;
}

function getDataAtualYYYYMMDD() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export async function TeamList() {
  const conteudoDoArquivo = await readFile("./times.json", "utf-8");
  const times = JSON.parse(conteudoDoArquivo);
  return times;
}
