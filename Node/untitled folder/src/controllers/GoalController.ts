import {
  DestroyGoalRequest,
  HandleGoalRequest,
  IndexGoalRequest,
  ShowGoalRequest,
  UpdateGoalRequest
} from "../requests/goal/GoalRequest";
import { handleRequest } from "../lib/helpers/requestHelper";
import GoalResource from "../resources/Goal/GoalResource";
import GetAllGoalResources from "../resources/Goal/GetAllGoalResources";
import GetGoalResource from "../resources/Goal/GetGoalResources";
import GoalService from "../services/GoalsService";
import GoalStatsResource from "../resources/Goal/GoalStatsResource";

class GoalsController {
  async index(req, res) {
    return handleRequest(req, res, IndexGoalRequest, GoalService.index, GetGoalResource);
  }

  async indexByPagination(req, res) {
    return handleRequest(req, res, IndexGoalRequest, GoalService.indexByPagination, GetAllGoalResources);
  }

  async store(req, res) {
    return handleRequest(req, res, HandleGoalRequest, GoalService.store, GoalResource);
  }

  async show(req, res) {
    return handleRequest(req, res, ShowGoalRequest, GoalService.show, GoalResource);
  }

  async update(req, res) {
    return handleRequest(req, res, UpdateGoalRequest, GoalService.update, GoalResource);
  }

  async destroy(req, res) {
    return handleRequest(req, res, DestroyGoalRequest, GoalService.destroy, GoalResource);
  }

  async stats(req, res) {
    return handleRequest(req, res, IndexGoalRequest, GoalService.stats, GoalStatsResource);
  }

}

export default new GoalsController();
