/* importar o módulo do framework express */
const express = require('express');

/* importar o módulo do consign */
const consign = require('consign');

/* importar o módulo do body-parser */
const bodyParser = require('body-parser');

/* importar o módulo do express-validator */
const expressValidator = require('express-validator');

/*Importando modulo morgan*/
const morgan = require('morgan');

/* iniciar o objeto do express */
const app = express();

/* Variaveis de ambiente. */
const env = require('dotenv');

/* Importando o módulo do mongoose. */
const mongoose = require('mongoose');

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

/* configurar o middleware express.static */
app.use(express.static('./public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/* configurar o middleware express-validator */
app.use(expressValidator());

/* Setando morgan */
app.use(morgan('dev'));

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign().include('src/models')
	.then('src/routes')
	.then('src/controllers').into(app);

/* Extraindo variaveis de ambiente. */
env.config({ path: './env/dev.env' });

/* Conecta com o banco de dados e lida com problemas de conexão */
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6
mongoose.connection.on('error',err => {
	console.log(`🙅 🚫 → ${err.message}`);
});

/* exportar o objeto app */
module.exports = app;
