"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = exports.getToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const getToken = (payLoad) => {
    if (!secret)
        return "Please provide the JWT Secret!";
    return (0, jsonwebtoken_1.sign)(payLoad, secret);
};
exports.getToken = getToken;
const getData = (token) => {
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, secret);
        return decoded;
    }
    catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};
exports.getData = getData;
