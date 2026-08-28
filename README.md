# Football Hub

Aplicação simples em Node.js para centralizar informações das cinco principais ligas de futebol da Europa em uma única interface.

O objetivo inicial do projeto é manter a arquitetura pequena e fácil de entender, usando uma separação inspirada em MVC:

- **View**: responsável pela interface exibida no navegador.
- **Model**: responsável pela comunicação com a API externa de futebol.
- **Controller**: responsável pelas rotas HTTP e pela comunicação entre View e Model.

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

A estrutura inicial:

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
│   ├── view/
│   │   └── index.html
│   │
│   └── app.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

A intenção é manter poucos arquivos para que seja fácil visualizar todo o fluxo da aplicação.

---

# Responsabilidade de cada arquivo

## `src/view/index.html`

Responsável pelo frontend.

Neste arquivo ficarão inicialmente:

- estrutura HTML;
- estilos CSS;
- JavaScript executado no navegador;
- seleção da liga;
- chamadas para as rotas internas do nosso servidor;
- renderização dos jogos;
- renderização da classificação.

## `src/model/footballModel.js`

Responsável pela obtenção e organização dos dados utilizados pela aplicação.

Neste primeiro momento, a fonte externa dos dados ainda não está definida.

Quando essa decisão for tomada, o Model será o ponto responsável por concentrar essa integração, evitando que detalhes da fonte de dados fiquem espalhados pelo Controller ou pela View.

---

## `src/controller/footballController.js`

Responsável pelas rotas da aplicação.

Exemplo:

```text
GET /api/leagues/:leagueCode/matches
GET /api/leagues/:leagueCode/standings
```

O Controller recebe a requisição do navegador, chama o Model e devolve os dados.

Fluxo conceitual:

```text
View
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
View
```

---

## `src/app.js`

É o ponto de entrada da aplicação.

Suas responsabilidades serão pequenas:

- criar a aplicação Express;
- disponibilizar a pasta da View;
- registrar o Controller;
- iniciar o servidor.

Exemplo conceitual:

```text
app.js
  |
  +--> disponibiliza index.html
  |
  +--> registra footballController
  |
  +--> inicia servidor
```

---

# Fluxo completo

Um exemplo de interação seria:

O usuário escolhe:

```text
Premier League
```

A View chama:

```text
GET /api/leagues/PL/matches
```

O Controller recebe:

```text
leagueCode = "PL"
```

O Controller chama:

```text
footballModel.getMatchesByLeague("PL")
```

O Model chama a API externa:

```text
Exemplo: GET https://api.football-data.org/v4/competitions/PL/matches
```

A resposta volta para o Controller.

O Controller devolve JSON para a View.

Finalmente, a View renderiza os jogos na tela.

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
