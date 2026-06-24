// middlewares/error.middleware.js
const errorHandler = (err, req, res, next) => {
    const message = err.message || 'Error interno del servidor';
    res.status(500).json({ message: message });
};

module.exports = errorHandler;