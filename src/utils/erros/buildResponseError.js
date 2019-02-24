const ResponseBuildError = require("utils/erros/ResponseBuildError");
const log = global.log;

const buildResponseError = (res, exception, arquivo) => {
	log.error(
		`Arquivo: ${arquivo} | Exception: `,
		exception,
		" | criado em: ",
		new Date().toJSON()
	);

	const responseBuildError = new ResponseBuildError(res, exception);
	responseBuildError.send();
};

module.exports = buildResponseError;