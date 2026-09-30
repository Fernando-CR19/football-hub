# Football Hub

Aplicação web em Node.js que reúne os jogos do dia e permite acompanhar clubes de algumas das principais ligas de futebol. O backend funciona como intermediário entre o navegador e a [football-data.org](https://www.football-data.org/), mantendo a chave da API fora do frontend.

O projeto usa uma estrutura simples inspirada em MVC:

- **View:** interface em HTML, CSS e JavaScript puro;
- **Model:** acesso à API externa e leitura da lista local de times;
- **Controller:** tratamento das requisições e respostas JSON;
- **Routes:** definição dos endpoints internos da aplicação.

## Funcionalidades atuais

- carregamento automático dos jogos do dia;
- atualização manual da lista de partidas;
- cards com campeonato, escudos, times, horário ou placar e status da partida;
- filtro de jogos por liga;
- escolha de um time favorito, destacado com `⭐` nos jogos;
- acompanhamento de vários times, destacados com `🟢`;
- remoção de times acompanhados;
- persistência do favorito e dos times acompanhados no `localStorage` do navegador;
- geração de uma lista local de clubes a partir da API externa.

As opções disponíveis no filtro e no gerador de times são:

| Código | Competição |
| --- | --- |
| `PL` | Premier League |
| `PD` | La Liga |
| `FL1` | Ligue 1 |
| `SA` | Serie A |
| `BL1` | Bundesliga |
| `BSA` | Brasileirão Série A |

> A disponibilidade das competições e dos dados depende do plano e das permissões da chave usada na football-data.org.

## Tecnologias

- Node.js 18 ou superior;
- Express 5;
- JavaScript com ES Modules;
- HTML e CSS;
- dotenv;
- nodemon no ambiente de desenvolvimento;
- API football-data.org v4.

O projeto não utiliza banco de dados, autenticação, framework de frontend, ORM, Docker ou cache. Também ainda não possui testes automatizados.

## Estrutura do projeto

```text
football-hub/
├── src/
│   ├── controller/
│   │   └── footballController.js
│   ├── model/
│   │   └── footballModel.js
│   ├── routes/
│   │   └── footballRoutes.js
│   ├── view/
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── js/
│   │   │   ├── app.js
│   │   │   └── buscarTimes.js
│   │   └── index.html
│   └── app.js
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

Depois de executar o gerador de times, o arquivo `times.json` também é criado na raiz. Tanto ele quanto o `.env` são ignorados pelo Git.

### Responsabilidades dos arquivos

- `src/app.js`: carrega as variáveis de ambiente, cria o servidor Express, publica `src/view` como conteúdo estático, registra as rotas em `/api` e inicia a aplicação.
- `src/routes/footballRoutes.js`: mapeia os endpoints para o controller.
- `src/controller/footballController.js`: chama o model e converte resultados ou falhas em respostas HTTP.
- `src/model/footballModel.js`: busca as partidas do dia na football-data.org e lê o arquivo local `times.json`.
- `src/view/index.html`: define a página e seus controles.
- `src/view/css/style.css`: estiliza controles, lista de times e cards de partidas.
- `src/view/js/app.js`: consome a API interna, renderiza e filtra jogos e gerencia favorito e times acompanhados.
- `src/view/js/buscarTimes.js`: script executado separadamente para consultar os clubes das seis competições e gerar `times.json`.

## Fluxo da aplicação

```text
Navegador (View)
       ↓ fetch
Rotas /api
       ↓
Controller
       ↓
Model
       ├── football-data.org (jogos do dia)
       └── times.json (lista de clubes)
```

O navegador nunca envia a chave diretamente para a API externa. O model adiciona `API_KEY` ao header `X-Auth-Token` no servidor.

## Endpoints

### `GET /api/jogos-hoje`

Consulta as partidas da data local atual do servidor por meio de:

```text
GET https://api.football-data.org/v4/matches?date=AAAA-MM-DD
```

Em caso de sucesso, devolve ao frontend o JSON recebido da API externa. Em caso de falha de conexão ou resposta inválida da API, devolve status `502`.

### `GET /api/times`

Lê e devolve o conteúdo de `times.json`. O arquivo precisa ter sido gerado antes com o script descrito na configuração. Se ele não existir ou não puder ser lido, o endpoint devolve status `500`.

## Pré-requisitos

- Node.js 18 ou superior, necessário para o uso nativo de `fetch`;
- npm;
- uma chave válida da football-data.org.

Confira as versões instaladas:

```bash
node --version
npm --version
```

## Instalação e configuração

Clone o repositório e instale as dependências:

```bash
git clone git@github.com:Fernando-CR19/football-hub.git
cd football-hub
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell, o comando equivalente é:

```powershell
Copy-Item .env.example .env
```

Preencha as variáveis:

```env
PORT=3000
API_KEY=sua_chave_da_football-data.org
```

- `PORT` é opcional em tempo de execução; quando ausente, o servidor usa `3000`.
- `API_KEY` é necessária para consultar jogos e gerar a lista de times.

Antes de iniciar a aplicação pela primeira vez, gere `times.json`:

```bash
node src/view/js/buscarTimes.js
```

O script consulta cada liga sequencialmente e grava, para cada clube, `id`, `name`, `shortName` e `crest`. Execute-o novamente quando quiser atualizar a lista. Se alguma competição não estiver disponível para a sua chave, o script será encerrado com erro e o arquivo não será atualizado.

## Executando

Durante o desenvolvimento, com reinício automático após alterações:

```bash
npm run dev
```

Em execução normal:

```bash
npm start
```

Acesse:

```text
http://localhost:3000
```

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor com nodemon. |
| `npm start` | Inicia o servidor com Node.js. |
| `node src/view/js/buscarTimes.js` | Gera ou atualiza `times.json`. |

O script `npm test` ainda é apenas o placeholder padrão e termina com erro, pois a suíte de testes não foi implementada.

## Armazenamento no navegador

As preferências são locais a cada navegador e não exigem conta:

- `idDoTimeFavorito`: ID do clube marcado como favorito;
- `idsDosTimesSeguidos`: lista em JSON dos IDs dos clubes acompanhados.

Limpar os dados do site no navegador remove essas preferências.

## Estado atual e próximos passos

- [x] servidor Express servindo a interface estática;
- [x] integração com os jogos do dia da football-data.org;
- [x] renderização de partidas em cards;
- [x] filtro por liga;
- [x] geração e endpoint da lista de times;
- [x] time favorito persistido no navegador;
- [x] múltiplos times acompanhados e opção de remoção;
- [ ] endpoint e tela de classificação das ligas;
- [ ] testes automatizados;
- [ ] tratamento visual mais detalhado para falhas ao carregar a lista de times.
