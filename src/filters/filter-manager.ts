import { IHeaders } from 'kafkajs';
import { RedisMessage } from '../redis/redis-message';
import { RedisResult } from '../redis/redis-result';
import { FilterBase } from './filter-base';

const filters: FilterBase[] = [];

export const registerFilter = (filter: FilterBase) => {
	filters.push(filter);
};


export const runFilter = async (headers: IHeaders, key: Buffer | string, data: Buffer| string): Promise<RedisResult> => {
	const keyAsString: string = (key instanceof Buffer) ? (key as Buffer).toString('utf-8') : key;
	const dataAsBuffer: Buffer = (data instanceof Buffer) ? (data as Buffer) : Buffer.from(data);

	let tmp: RedisMessage = {
		headers: headers,
		data: dataAsBuffer,
		key: keyAsString,
	};
	for (const filter of filters.sort((a, b) => a.index - b.index)) {
		tmp = await filter.run(tmp);
	}


	return {
		key: tmp.key,
		data: tmp.data,
	};
};
