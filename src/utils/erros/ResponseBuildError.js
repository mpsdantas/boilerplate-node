module.exports = class ResponseBuildError {
	constructor(res, err) {
		this.res = res;
		this.err =
			err == undefined
				? new Error(
						"Erro de processamento interno. (O erro informado no construtor é undefined)"
				  )
				: err.error !== undefined
				? err.error
				: err;
	}
	send() {
		const ValidationError = require("mongoose").Error.ValidationError;

		const AppError = require("utils/erros/AppError");

		const RequestValidationError = require("utils/erros/RequestValidationError");

		if (this.err instanceof ValidationError) {
			let errosFinal = [];

			Object.keys(this.err.errors).forEach(key => {
				errosFinal.push({
					msg: this.err.errors[key].message,
					path: this.err.errors[key].path
				});
			});

			return this.res.status(400).json({
				status: false,
				code: parseInt("100"),
				erros: errosFinal
			});
		} else if (this.err instanceof RequestValidationError) {
			return this.res.status(this.err.code).json({
				status: false,
				code: this.err.codeSystem,
				erros: this.err.erros
			});
		} else if (this.err instanceof AppError) {
			return this.res.status(err.status).json({
				status: false,
				erros: [{ msg: this.err.message }]
			});
		} else {
			if (this.err.message.indexOf("duplicate key error") !== -1) {
				let campo = this.err.message
					.split("index:")[1]
					.split("dup key")[0]
					.split("_")[0];

				let dup_key = this.err.message.split("{ :")[1].split('"')[1];

				return this.res.status(500).json({
					status: false,
					erros: [
						{
							msg: `O ${campo} já foi utilizado por outro usuário, tente utilizar outro valor diferente de ${dup_key}`
						}
					]
				});
			} else {
				return this.res.status(500).json({
					status: false,
					erros: [{ msg: this.err.message }]
				});
			}
		}
	}
};
