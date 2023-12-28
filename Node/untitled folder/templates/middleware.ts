class templateNameMiddleware {
    static async handle(req, res, next) {
        // middleware logic here
        next();
    }
}

module.exports = templateNameMiddleware;
