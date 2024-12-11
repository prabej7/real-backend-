"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.login = exports.register = void 0;
const client_1 = __importDefault(require("../config/client"));
const bcrypt_1 = require("bcrypt");
const redis_1 = require("../service/redis");
const auth_1 = require("../service/auth");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const isUser = yield client_1.default.users.findFirst({ where: { email: email } });
        if (isUser) {
            return res.status(409).json({ error: "User already Exists." });
        }
        const newUser = yield client_1.default.users.create({
            data: {
                email: email,
                password: (0, bcrypt_1.hashSync)(password, 12),
                username: email
            }
        });
        yield redis_1.client.set(`uif${newUser.id}`, JSON.stringify(newUser));
        return res.status(200).json({
            message: "Success", token: (0, auth_1.getToken)({
                email: newUser.email,
                id: newUser.id
            })
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield client_1.default.users.findFirst({ where: { email: email } });
        if (!user) {
            return res.status(404).json({ error: "User does't exists." });
        }
        if ((0, bcrypt_1.compareSync)(password, user.password)) {
            const token = (0, auth_1.getToken)({
                email: user.email,
                id: user.id
            });
            yield redis_1.client.set(`uif${user.id}`, JSON.stringify(user));
            return res.status(200).json({ message: "Success", token: token });
        }
        return res.status(401).json({ error: "Email or password is incorrect!" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.login = login;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        if (!token)
            return res.status(401).json({ error: "Token is required." });
        const decoded = (0, auth_1.getData)(token);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid or expired token." });
        }
        const { id } = decoded;
        const cachedData = yield redis_1.client.get(`uif${id}`);
        if (cachedData) {
            return res.status(200).json({ message: "Success", user: JSON.parse(cachedData) });
        }
        const user = yield client_1.default.users.findFirst({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        yield redis_1.client.set(`uif${user.id}`, JSON.stringify(user));
        return res.status(200).json({ message: "Success", user: user });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.getUser = getUser;
