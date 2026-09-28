import { TodaysGames } from "../model/footballModel.js";

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
