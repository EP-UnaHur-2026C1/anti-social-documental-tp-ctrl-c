const {createClient} = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL
});

class CacheManager {
    constructor() {
        this.client = redisClient;
        this.client.on('error', (err) => console.error('Redis Client Error', err));
        this.client.connect().catch(console.error)
    }



    async get(key) {
        try{
            const item = await this.client.get(key);
            return item ? JSON.parse(item) : null;
        }
        catch (error){
            console.error(error)
            return null
        }
    }


    set(key, value, time = 60) {
        this.client.setEx(key,time , JSON.stringify(value)).catch(console.error)
    }


    delete(key) {
        this.client.del(key).catch(console.error);
    }


    clear() {
        this.client.flushDb().catch(console.error);
    }
}


module.exports = new CacheManager();