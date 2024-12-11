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
exports.getAllUser = exports.getUser = exports.login = exports.register = void 0;
const client_1 = __importDefault(require("../config/client"));
const bcrypt_1 = require("bcrypt");
const auth_1 = require("../service/auth");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const isUser = yield client_1.default.users.findFirst({ where: { email: email } });
        if (isUser) {
            res.status(409).json({ error: "User already Exists." });
            return;
        }
        const newUser = yield client_1.default.users.create({
            data: {
                email: email,
                password: (0, bcrypt_1.hashSync)(password, 12),
                username: email
            }
        });
        res.status(200).json({
            message: "Success", token: (0, auth_1.getToken)({
                email: newUser.email,
                id: newUser.id
            })
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield client_1.default.users.findFirst({ where: { email: email } });
        if (!user) {
            res.status(404).json({ error: "User does't exists." });
            return;
        }
        if ((0, bcrypt_1.compareSync)(password, user.password)) {
            const token = (0, auth_1.getToken)({
                email: user.email,
                id: user.id
            });
            res.status(200).json({ message: "Success", token: token });
            return;
        }
        res.status(401).json({ error: "Email or password is incorrect!" });
        return;
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
        return;
    }
});
exports.login = login;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        if (!token) {
            res.status(401).json({ error: "Token is required." });
            return;
        }
        const decoded = (0, auth_1.getData)(token);
        if (!decoded) {
            res.status(401).json({ error: "Invalid or expired token." });
            return;
        }
        const { id } = decoded;
        const user = yield client_1.default.users.findFirst({ where: { id } });
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }
        res.status(200).json({ message: "Success", user: user });
        return;
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
        return;
    }
});
exports.getUser = getUser;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield client_1.default.users.findMany();
        res.status(200).json({ users: allUsers });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error." });
        return;
    }
});
exports.getAllUser = getAllUser;
