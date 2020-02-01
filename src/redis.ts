import Redis from 'redis';

const redis = Redis.createClient({
	host: process.env.REDIS_HOST,
	port: Number.parseInt(process.env.REDIS_PORT),
	return_buffers: true
});

// @ts-ignore
redis.print = Redis.print;


redis.on('error', (e) => console.error(e));


export { redis };
