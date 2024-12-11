"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("tsconfig-paths/register");
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    return res.status(200).json({ message: "PONG" });
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
