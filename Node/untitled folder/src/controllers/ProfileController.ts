
import { handleRequest } from "../lib/helpers/requestHelper";
import ProfileService from "../services/ProfileService";
import HandleProfileResoruce from "../resources/Profile/HandleProfileResource";
import { DestroyProfile } from "../requests/profile/ProfileRequestHandler";
import UpdateUserNameResourceResource from "../resources/Profile/UpdateUserNameResource";

class ProfileController {

  async update(req, res) {
    return handleRequest( req, res, null, ProfileService.update, HandleProfileResoruce );
  }

  async updatePassword(req, res) {
    return handleRequest( req, res, null, ProfileService.updatePassword, HandleProfileResoruce );
  }

  async destroy(req, res) {
    return handleRequest( req, res, DestroyProfile, ProfileService.destroy, HandleProfileResoruce );
  }
  async destroyUser(req, res) {
    return handleRequest( req, res, null, ProfileService.destroyUser, HandleProfileResoruce );
  }
  async getUserProfile(req, res) {
    return handleRequest( req, res, null, ProfileService.getUserProfile, HandleProfileResoruce );
  }

  async updateUserName(req, res) {
    try {
      const result: any = await ProfileService.updateUserName(req);
      return res.status(200).json(new UpdateUserNameResourceResource(result, "Username updated successfully", 200));
    } catch (error) {
      return res.status(500).json(new UpdateUserNameResourceResource(null, error.message));
    }
  }
}

export default new ProfileController();