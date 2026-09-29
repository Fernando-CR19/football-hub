import { TodaysGames } from "../model/footballModel.js";
import { TeamList } from "../model/footballModel.js";

export async function getTodayGames(request, response) {
  try {
    const jogos = await TodaysGames();
    response.json(jogos);
  } catch (error) {
    console.error(error.message);
    response
      .status(502)
      .json({ message: "Não foi possível busca os jogos de hoje" });
  }
}

export async function getTimes(request, response) {
  try {
    const times = await TeamList();
    response.json(times);
  } catch (error) {
    console.error(error.message);
    response
      .status(500)
      .json({ mensagem: "Não foi possível carregar a lista de times" });
  }
}
