import { Kafka } from 'kafkajs';

const kafka = new Kafka({
	clientId: process.env.KAFKA_CLIENT_ID,
	brokers: process.env.KAFKA_BROKERS.split(',')
});

const topic = process.env.KAFKA_TOPIC;

const run = async () =>{
	const key = Math.round(Math.random() * 60 + 100).toString();
	console.log(key)

	const producer = kafka.producer();
	await producer.connect();

	await producer.send({
		topic,
		messages: [
			{
				headers: {
					action: 'create'
				},
				key,
				value: 'Test'
			},
			{
				headers: {
					action: 'create'
				},
				key: Math.round(Math.random() * 60 + 100).toString(),
				value: JSON.stringify({
					name: 'test'
				})
			}
		]
	});

	await producer.send({
		topic,
		messages: [
			{
				headers: {
					action: 'delete'
				},
				key,
				value: ''
			},
		]
	});

	await producer.disconnect();
};

run();
