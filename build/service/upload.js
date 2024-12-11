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
exports.uploadFile = void 0;
const cloud_1 = __importDefault(require("../config/cloud"));
const path_1 = __importDefault(require("path"));
const randomstring_1 = require("randomstring");
const uploadFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const uploadResult = cloud_1.default.uploader.upload_stream({
            public_id: path_1.default.parse((0, randomstring_1.generate)(6) + file.originalname).name,
        }, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return 1;
            }
            const optimizedUrl = cloud_1.default.url(result.public_id, {
                fetch_format: "auto",
                quality: "auto",
            });
            if (optimizedUrl) {
                resolve(optimizedUrl);
            }
        }));
        uploadResult.end(file.buffer);
    });
});
exports.uploadFile = uploadFile;
