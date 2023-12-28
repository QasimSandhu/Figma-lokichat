import { handleRequest } from "../lib/helpers/requestHelper";
import { 
  GetSuperUserRequest,
  StoreSuperUserRequest,
  UpdateSuperUserRequest
 } from "../requests/superUser/SuperUserRequest";
import SuperUserService from "../services/SuperUserService";
import SuperUserResource from "../resources/SuperUser/SuperUserResource";

class SuperUserController {
  async index(req, res) {
    return handleRequest(req, res, GetSuperUserRequest, SuperUserService.index, SuperUserResource);
  }

  async store(req, res) {
    return handleRequest(req, res, StoreSuperUserRequest, SuperUserService.store, SuperUserResource);
  }

  async update(req, res) {
    return handleRequest(req, res, UpdateSuperUserRequest, SuperUserService.update, SuperUserResource);
  }

  async show(req, res) {
    return handleRequest(req, res, GetSuperUserRequest, SuperUserService.show, SuperUserResource);
  }
}

export default new SuperUserController();
