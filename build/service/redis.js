"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const redis_1 = require("redis");
console.log(process.env.REDIS_PASS);
const client = (0, redis_1.createClient)({
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-15773.c11.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 15773
    }
});
exports.client = client;
