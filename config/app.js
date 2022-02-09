const express = require("express");

const consign = require("consign");

const bodyParser = require("body-parser");

const expressValidator = require("express-validator");

const morgan = require("morgan");

const mongoose = require("mongoose");

const ResponseErrorBuild = require("../src/utils/erros/ResponseBuildError");

const SimpleNodeLogger = require("simple-node-logger");

const caminhoLog = `${__dirname}/../logs/logs-system.log`;

const opts = {
	logFilePath: caminhoLog,
	timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS"
};

const log = require("simple-node-logger").createSimpleLogger(opts);

global.log = log;

require("module-alias/register");

const app = express();

const cors = require('cors')

app.use(cors());

app.use(express.static("./public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressValidator());

/* Importando o módulo express-session. */

/* DESCOMENTAR CASO FOR UTILIZAR SESSIONS 
const expressSession = require('express-session');
app.use(expressSession({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false
}));
*/

/* setar as variáveis 'view engine' e 'views' do express */
/* DESCOMENTAR CASO FOR USAR RENDER NO NODE
app.set('view engine', 'ejs');
app.set('views', './src/views');
*/

app.use(morgan("dev"));

consign()
	.include("src/models")
	.then("src/routes")
	.into(app);

mongoose.set("useCreateIndex", true);

app.use((err, req, res, next) => {
	log.error(
		"Arquivo: app.j | Erro catch middleware ",
		err,
		" | criado em: ",
		new Date().toJSON()
	);
	const responseBuildError = new ResponseErrorBuild(res, err);
	responseBuildError.send();
});


app.use((req, res, next) => {
	res.status(404).json({
		status: false,
		code: 404,
		erros: [{
			msg: `Nenhuma rota encontrada para ${req.path}`
		}],
		date: new Date()
	});
});

/* Extraindo variaveis de ambiente. */
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config({ path: "./env/dev.env" });
} else {
	require("dotenv").config({ path: "./env/prod.env" });
}

/* Conecta com o banco de dados e lida com problemas de conexão */
mongoose.connect(process.env.DATABASE, {
	useNewUrlParser: true
});

mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6

mongoose.connection.on("error", err => {
	console.log(`🙅 🚫 → ${err.message}`);
});

/* exportar o objeto app */
module.exports = app;
