export interface IHeaders {
    [key: string]: Buffer | string
}

export interface RedisMessage {
    headers: IHeaders;
    key: string;
    data: Buffer;
}
