const boom = require('@hapi/boom')
const { config } = require('../../config')

function withErrorStack(err, stack) {
	if (config.dev) {
		return { ...err, stack }
	}
	return err
}

function logErrors(err, req, res, next) {
  //debug(err.stack);
  next(err);
}

function wrapErrors(err, req, res, next) {
	if (err.isBoom) {
		next(boom.badImplementation(err))
	}
	next(err)
}

function errorHandler(err, req, res, next) {
  // catch erros while streaming
	console.log(err);
  const { output: { statusCode, payload}, stack } = err

  res.status(statusCode);
  res.render("error", withErrorStack(payload, stack));
}

module.exports = {
	logErrors,
	wrapErrors,
	errorHandler
}