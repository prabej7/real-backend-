import { createClient } from 'redis';

console.log(process.env.REDIS_PASS)
const client = createClient({
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-15773.c11.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 15773
    }
});


export { client }