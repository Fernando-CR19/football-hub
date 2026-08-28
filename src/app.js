import express from 'express';
import 'dotenv/config';

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (request, response) => {
    response.send('Football Hub está rodando!');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});