import express from "express";
import "dotenv/config";

import path from "path";
import { fileURLToPath } from "url";

import footballRoutes from "./routes/footballRoutes.js";

const app = express();

const port = process.env.PORT || 3000;

const arquivo = fileURLToPath(import.meta.url);
const pasta = path.dirname(arquivo);

app.use(express.static(path.join(pasta, "view")));
app.use("/api", footballRoutes);

app.listen(port);
