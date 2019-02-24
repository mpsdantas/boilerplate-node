module.exports = class RequestValidationError extends require("./AppError") {
	constructor(erros, codeHTTP, codeSystem) {
		super("O processamento de algumas informações não foi realizado.", 400);
		this.code = codeHTTP;
		this.codeSystem = codeSystem == undefined ? codeHTTP : codeSystem;
		this.erros = erros;
	}
};
