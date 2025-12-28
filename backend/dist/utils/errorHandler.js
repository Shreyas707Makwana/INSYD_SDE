"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.badRequest = badRequest;
exports.notFound = notFound;
function errorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
}
function badRequest(message) {
    const error = new Error(message);
    error.status = 400;
    return error;
}
function notFound(message) {
    const error = new Error(message);
    error.status = 404;
    return error;
}
