import { RedisMessage } from '../redis/redis-message';

export abstract class FilterBase {
    async abstract run(item: RedisMessage): Promise<RedisMessage>;

    abstract get index(): number;
}
