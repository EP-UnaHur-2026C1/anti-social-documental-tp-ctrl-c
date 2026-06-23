const cacheManager = require('../managers/CacheManager');

const cache = (durationInSeconds) => {
    
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }


        const key = req.originalUrl;
        const cachedData = await cacheManager.get(key);

        if (cachedData) {
            return res.json(cachedData);
        }

        const originalJson = res.json;

        res.json = (body) => {
            cacheManager.set(key, body, durationInSeconds);
            originalJson.call(res, body);
        };

        next();
    };
};

module.exports = cache;