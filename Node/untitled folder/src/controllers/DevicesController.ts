import { handleRequest } from "../lib/helpers/requestHelper";
import {
  IndexLoggedInDevices,
  StoreLoggedInDevice,
  DestroyLoggedInDevice,
} from "../requests/devices/DevicesRequest";
import DevicesResource from "../resources/Devices/DevicesResource";
import DevicesService from "../services/DevicesServices";
import DestroyAllDevices from "../resources/Devices/DestroyAllDevicesResource";

class DevicesController {
  async index(req, res) {
    return handleRequest(req, res, IndexLoggedInDevices, DevicesService.index, DevicesResource);
  }

  async store(req, res) {
    return handleRequest(req, res, StoreLoggedInDevice, DevicesService.store, DevicesResource);
  }

  async destroy(req, res) {
    return handleRequest(req, res, DestroyLoggedInDevice, DevicesService.destroy, DevicesResource);
  }
  async destroyAll(req, res) {
    return handleRequest(req, res, DestroyLoggedInDevice, DevicesService.destroyAll, DestroyAllDevices);
  }
}

export default new DevicesController();
