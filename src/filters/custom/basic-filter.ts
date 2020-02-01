import { RedisMessage } from '../../redis/redis-message';
import { FilterBase } from '../filter-base';
import { Filter } from '../filter-decorator';

@Filter('basic')
export class BasicFilter implements FilterBase{
	get index(): number {
		return 0;
	}

	async run(item: RedisMessage): Promise<RedisMessage> {
		return item;
	}

}
