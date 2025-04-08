"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (fn) => (request, response, next) => {
    Promise.resolve(fn(request, response, next)).catch(next);
};
exports.default = asyncHandler;
