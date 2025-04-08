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
exports.verifyOtp = exports.getOtp = void 0;
const auth_1 = require("../service/auth");
const mailer_1 = __importDefault(require("../service/mailer"));
const client_1 = __importDefault(require("../config/client"));
const asyncHandler_1 = __importDefault(require("src/middleware/asyncHandler"));
exports.getOtp = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    const otp = Math.floor(Math.random() * 1000000);
    yield (0, mailer_1.default)(email, otp);
    const token = (0, auth_1.getToken)({ otp, email });
    res.status(200).json({ token });
}));
exports.verifyOtp = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, token } = req.body;
    const { otp: actualOtp, email } = (0, auth_1.getData)(token);
    if (otp == actualOtp) {
        yield client_1.default.users.update({
            where: { email },
            data: {
                verified: true
            }
        });
        res.status(200).json({ message: "Verified" });
    }
    else {
        res.status(401).json({ error: "Invalid or expired otp." });
    }
}));
