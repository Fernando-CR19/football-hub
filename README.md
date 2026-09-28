# Football Hub

Aplicação simples em Node.js para centralizar informações das cinco principais ligas de futebol da Europa em uma única interface.

O objetivo inicial do projeto é manter a arquitetura pequena e fácil de entender, usando uma separação inspirada em MVC:

- **View**: responsável pela interface exibida no navegador.
- **Model**: responsável pela comunicação com a API externa de futebol.
- **Controller**: responsável por receber a requisição, chamar o Model e devolver a resposta.
- **Routes**: responsável por mapear os endpoints HTTP às funções do Controller.

Não haverá autenticação de usuários, banco de dados ou outras camadas avançadas neste primeiro momento.

---

## Objetivo

As cinco grandes ligas europeias possuem fontes e aplicativos diferentes para acompanhar partidas e classificações.

Este projeto busca apresentar essas informações de forma centralizada:

- Premier League — Inglaterra
- La Liga — Espanha
- Bundesliga — Alemanha
- Serie A — Itália
- Ligue 1 — França

No primeiro MVP, o foco pode ficar em:

- listar as ligas;
- mostrar os próximos jogos;
- mostrar resultados;
- mostrar a classificação de cada liga.

---

## Tecnologias

O projeto utiliza apenas tecnologias simples:

- Node.js
- JavaScript
- Express
- HTML
- CSS
- JavaScript no navegador
- dotenv

Não haverá inicialmente:

- banco de dados;
- autenticação;
- ORM;
- framework de frontend;
- Docker;
- cache;
- testes automatizados;
- arquitetura em múltiplas camadas.

Esses elementos podem ser adicionados futuramente somente se houver necessidade.

---

## Arquitetura

Estrutura atual do projeto:

```text
european-football-hub/
│
├── src/
│   ├── controller/
│   │   └── footballController.js
│   │
│   ├── model/
│   │   └── footballModel.js
│   │
│   ├── routes/
│   │   └── footballRoutes.js
│   │
│   ├── view/
│   │   ├── index.html
│   │   └── js/
│   │       └── app.js
│   │
│   └── app.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

A pasta `routes` foi adicionada para separar "quais URLs existem" (routes) de "o que acontece quando alguém as chama" (controller), evitando que `app.js` acumule toda a definição de endpoints conforme novos recursos forem entrando.

A intenção é manter poucos arquivos para que seja fácil visualizar todo o fluxo da aplicação.

---

# Responsabilidade de cada arquivo

## `src/view/index.html` e `src/view/js/app.js`

Responsáveis pelo frontend.

- `index.html`: estrutura HTML e elementos da página (botões, containers de jogos, etc.).
- `js/app.js`: JavaScript executado no navegador — faz `fetch` nas rotas internas do servidor (nunca diretamente na API externa) e vai ficar responsável por renderizar jogos e classificação na tela.

## `src/model/footballModel.js`

Responsável pela comunicação com a API externa (football-data.org), incluindo o envio da API key via header `X-Auth-Token`.

Hoje concentra a busca dos jogos do dia (`TodaysGames`). É o único ponto do projeto que conhece o formato de resposta da API externa — Controller e View não lidam com esse detalhe diretamente.

---

## `src/controller/footballController.js`

Responsável por receber a requisição vinda de uma rota, chamar o Model correspondente e devolver a resposta em JSON via `response.json(...)`.

## `src/routes/footballRoutes.js`

Responsável por mapear os endpoints HTTP às funções do Controller. Endpoint implementado até agora:

```text
GET /api/jogos-hoje
```

Fluxo conceitual:

```text
View
  |
  v
Routes
  |
  v
Controller
  |
  v
Model
```

A resposta percorre o caminho contrário:

```text
Model
  |
  v
Controller
  |
  v
Routes
  |
  v
View
```

---

## `src/app.js`

É o ponto de entrada da aplicação.

Suas responsabilidades:

- criar a aplicação Express;
- disponibilizar a pasta `view` como estática (`express.static`);
- registrar as rotas (`app.use("/api", footballRoutes)`);
- iniciar o servidor.

Exemplo conceitual:

```text
app.js
  |
  +--> disponibiliza src/view (HTML + JS do navegador)
  |
  +--> registra footballRoutes em /api
  |
  +--> inicia servidor
```

---

# Fluxo completo (implementado até agora)

O usuário clica no botão "Buscar Jogos de hoje" na tela principal.

A View (`view/js/app.js`) chama:

```text
GET /api/jogos-hoje
```

O Router direciona para o Controller, que chama:

```text
footballModel.TodaysGames()
```

O Model busca os jogos do dia na API externa:

```text
GET https://api.football-data.org/v4/matches/
```

A resposta volta: Model → Controller → JSON → View, onde por enquanto só é exibida no console do navegador (renderização na tela ainda pendente).

---

# Pré-requisitos

Para executar o projeto é necessário ter instalado:

- Node.js 18 ou superior
- npm

Verifique a instalação:

```bash
node --version
npm --version
```

---

# Configuração do `.env`

Crie um arquivo:

```text
.env
```

Esse arquivo será utilizado para armazenar variáveis de ambiente necessárias para executar a aplicação.

```env
PORT=3000
API_KEY=sua_chave_da_football-data.org
```

Novas variáveis poderão ser adicionadas posteriormente conforme as necessidades do projeto forem definidas.

---

# Executando

Clone o projeto:

```bash
git clone git@github.com:Fernando-CR19/football-hub.git
```

Instale as dependências:

```bash
npm install
```

Depois de instalar as dependências e configurar o `.env`, execute:

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

---

# Progresso

- [x] Servidor Express servindo a View como estática
- [x] Model buscando jogos do dia na football-data.org
- [x] Controller e Routes conectando View → API externa
- [x] Endpoint `GET /api/jogos-hoje` funcionando ponta a ponta
- [ ] Renderização dos jogos na tela (atualmente só `console.log`)
- [ ] Seleção de liga (Premier League, La Liga, Bundesliga, Serie A, Ligue 1)
- [ ] Endpoints de classificação
