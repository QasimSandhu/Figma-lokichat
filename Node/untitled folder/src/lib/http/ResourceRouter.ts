import { Router } from 'express';

type Options = {
  path: string;
  controller: any;
};

export class ResourceRouter {
  router: Router;
  path: string;
  controller: any;

  constructor(router: Router, options: Options) {
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
