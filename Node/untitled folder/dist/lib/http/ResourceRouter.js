"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceRouter = void 0;
class ResourceRouter {
    constructor(router, options) {
        this.router = router;
        this.path = options.path;
        this.controller = options.controller;
    }
    registerRoutes() {
        this.router.get(`${this.path}`, this.controller.index);
        this.router.post(`${this.path}`, this.controller.store);
        this.router.get(`${this.path}/:id`, this.controller.show);
        this.router.put(`${this.path}/:id`, this.controller.update);
        this.router.delete(`${this.path}/:id`, this.controller.destroy);
    }
}
exports.ResourceRouter = ResourceRouter;
//# sourceMappingURL=ResourceRouter.js.map