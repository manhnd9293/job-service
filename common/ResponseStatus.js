const ResponseStatus = Object.freeze({
    Ok: 200,
    BadRequest: 400,
    Unauthorised: 401,
    Forbidend: 403,
    NotFound: 404,
    InternalError: 500,

})

module.exports = ResponseStatus;