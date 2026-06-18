class CacheManager {
    constructor() {
        // Usamos un Map en lugar de un objeto literal porque es más eficiente para leer/escribir frecuentemente
        this.cache = new Map();
    }

    // Obtener un dato de la caché
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) return null;

        // Verificamos si el dato ya expiró
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    // Guardar un dato en la caché con un tiempo de vida en segundos
    set(key, value, ttlInSeconds = 60) {
        const expiry = Date.now() + (ttlInSeconds * 1000);
        this.cache.set(key, { value, expiry });
    }

    // Borrar un dato específico
    delete(key) {
        this.cache.delete(key);
    }

    // Limpiar toda la caché
    clear() {
        this.cache.clear();
    }
}

// Exportamos una INSTANCIA de la clase (Singleton) para que toda la app comparta la misma memoria
module.exports = new CacheManager();