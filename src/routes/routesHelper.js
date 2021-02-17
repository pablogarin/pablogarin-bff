const { BadRequest, NotFound, Forbidden, UnprocessableEntity } = require("http-errors")

const getStatusCodeFromError = (e) => {
  let statusCode;
  switch (e.constructor) {
    case BadRequest:
      statusCode = 400;
      break;
    case Forbidden:
      statusCode = 401;
      break;
    case NotFound:
      statusCode = 404;
      break;
    case UnprocessableEntity:
      statusCode = 422;
      break;
    case InternalServerError:
    default:
      statusCode = 500;
      break;
  }
  return statusCode;
}

module.exports = {getStatusCodeFromError}
