import { TodaysGames } from "../model/footballModel.js";

export async function getTodayGames(request, response) {
  const jogos = await TodaysGames();
  response.json(jogos);
}
