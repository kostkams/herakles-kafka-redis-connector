import { Kafka } from 'kafkajs';

const kafka = new Kafka({
	clientId: process.env.KAFKA_CLIENT_ID,
	brokers: process.env.KAFKA_BROKERS.split(',')
});

export const kafkaConsumer = kafka.consumer({ groupId: process.env.KAKFA_CONSUMER_ID });
