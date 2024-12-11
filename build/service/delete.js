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
const cloud_1 = __importDefault(require("../config/cloud"));
const extractPublicId = (url) => {
    const parts = url.split("/");
    const lastPart = parts.pop();
    if (!lastPart) {
        throw new Error("Invalid URL format");
    }
    const publicIdWithVersion = lastPart.split(".")[0].split("?")[0];
    return publicIdWithVersion;
};
const deleteFile = (url) => __awaiter(void 0, void 0, void 0, function* () {
    if (Array.isArray(url)) {
        const publicIds = url.map(extractPublicId);
        try {
            yield new Promise((resolve, reject) => {
                cloud_1.default.api.delete_resources(publicIds, (error) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        }
        catch (error) {
            console.error("Error deleting files:", error);
            throw error;
        }
    }
    else {
        const publicId = extractPublicId(url);
        try {
            yield new Promise((resolve, reject) => {
                cloud_1.default.uploader.destroy(publicId, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        }
        catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }
    return 1;
});
exports.default = deleteFile;
