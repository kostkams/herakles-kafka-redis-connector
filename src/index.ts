import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { runFilter } from './filters/filter-manager';
import { kafkaConsumer } from './kafka';
import { redis } from './redis';

console.log('Start Kafka Redis Connector');




const run = async () => {
	await kafkaConsumer.connect();

	await kafkaConsumer.subscribe({
		topic: process.env.KAFKA_TOPIC,
		fromBeginning: process.env.KAFKA_FROM_BEGINNING === 'true'
	});

	console.log('Ready for Kafka Topics');

	await kafkaConsumer.run({
		eachMessage: async ({ message }) => {
			const filteredData = await runFilter(message.headers ,message.key, message.value);

			if (!filteredData)
				return;

			const hashKey = process.env.REDIS_HASH_KEY;
			const key = filteredData.key;
			const data = filteredData.data;

			if (message.headers['action']){
				switch (message.headers['action'].toString('utf-8')) {
				case 'create':
				case 'update':
					if (hashKey) {
						// @ts-ignore
						redis.hmset(hashKey, key, data, redis.print);
					} else {
						// @ts-ignore
						redis.set(key, data.toString('utf-8'), redis.print);
					}

					console.log(`Saved: ${key} - ${data}`);
					break;
				case 'delete':
					if (hashKey) {
						// @ts-ignore
						redis.hdel(hashKey, key, redis.print);
					} else {
						// @ts-ignore
						redis.del(key, redis.print);
					}

					console.log(`Deleted: ${key}`);
					break;
				}

			}
		}
	});
};


const normalizedPath = join(__dirname, 'filters', 'custom');

if (existsSync(normalizedPath)) {
	readdirSync(normalizedPath)
		.filter(file => file.endsWith('.js'))
		.forEach(file => {
			require(join(normalizedPath, file));
		});
}

run();
