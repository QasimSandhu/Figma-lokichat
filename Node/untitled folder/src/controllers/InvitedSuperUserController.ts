import { handleRequest } from "../lib/helpers/requestHelper";
import InvitedSuperUserService from "../services/InvitedSuperUserService";
import InviteUserResource from "../resources/InviteSuperUser/HandleInviteUserResource";

class InvitedSuperUserController {
  async inviteSuperUser(req, res) {
    return handleRequest( req, res, null, InvitedSuperUserService.inviteSuperUser, InviteUserResource );
  }
}
export default new InvitedSuperUserController();