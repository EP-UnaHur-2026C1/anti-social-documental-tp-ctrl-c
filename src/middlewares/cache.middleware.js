const cacheManager = require('../managers/CacheManager');

const cache = (durationInSeconds) => {
    return (req, res, next) => {
        // La caché suele usarse solo para peticiones de lectura (GET)
        if (req.method !== 'GET') {
            return next();
        }

        // Usamos la URL de la petición como "llave" para guardar el dato (ej. '/api/posts')
        const key = req.originalUrl;
        const cachedData = cacheManager.get(key);

        if (cachedData) {
            console.log(`[Cache Hit] Devolviendo datos cacheados para: ${key}`);
            return res.json(cachedData);
        }

        // Si no está en caché, guardamos una referencia al método res.json original
        const originalJson = res.json;

        // Sobrescribimos el método res.json para interceptar la respuesta del controlador
        res.json = (body) => {
            cacheManager.set(key, body, durationInSeconds);
            originalJson.call(res, body);
        };

        next();
    };
};

module.exports = cache;