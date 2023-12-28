import Devices from "../models/Devices";

class DevicesService {
  async index(req) {
    const { userId } = req;

    const devices: any = await Devices.find({ user: userId });
    devices.sort((a, b) => b.date - a.date);
    return devices;
  }
  async  saveDeviceIntoDB(data, isRefreshToken) {
    const {userId, ipAddress, browserName, os, browserVersion, isMobile, mobileId, mobileName} = data;
    let existingDevice;
    if(isMobile && isMobile === true) {
      existingDevice = await Devices.findOne({
        user: userId,
        os,
        mobileId
      });
    } else {
      existingDevice = await Devices.findOne({
        user: userId,
        os,
        ipAddress,
        browserName,
      });
    }

    if (existingDevice) {
      if(!isRefreshToken){
        existingDevice.date = new Date();
        await existingDevice.save();
      }
      return existingDevice;
    } else {
      const device = new Devices({
        os,
        user: userId,
        browserName,
        ipAddress,
        browserVersion,
        mobileId,
        mobileName,
        date: new Date(),
      });
      await device.save();

      return device;
    }
  }

  async store(req) {
    const { body, userId } = req;
    const { os, browserName, browserVersion, ipAddress, mobileId, mobileName } = body;
    const existingDevice = await Devices.findOne({
      user: userId,
      os,
      ipAddress,
      browserName,
    });
    if (existingDevice) {
      existingDevice.date = new Date();
      await existingDevice.save();
      return existingDevice;
    } else {
      const device = new Devices({
        os,
        user: userId,
        browserName,
        ipAddress,
        browserVersion,
        mobileId,
        mobileName,
        date: new Date(),
      });
      await device.save();

      return device;
    }
    
  }

  async destroy(req) {
    const { params } = req;
    const { deviceId } = params;

    const device = await Devices.findByIdAndDelete(deviceId);
    if (!device)
      throw new Error("No loggedIn device found with this device ID");

    return device;
  }

  async destroyAll(req) {
    const { userId } = req;

    const deletedDevices: any = await Devices.deleteMany({ user: userId });

    if (!deletedDevices.acknowledged)
      throw new Error("Could not logged out from all devices");

    return deletedDevices;
  }
}

export default new DevicesService();
