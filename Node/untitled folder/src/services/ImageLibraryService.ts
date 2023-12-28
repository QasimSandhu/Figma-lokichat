import PhotoGeneration from "../models/PhotoGeneration";
import ObjectManipulator from "../lib/helpers/ObjectDestructurer";
import { size } from "lodash";

class ImageLibraryService {
  async index(req) {
    const { query, userId } = req;
    let { date, page, resPerPage } = query;

    page = page ?? 1;
    resPerPage = resPerPage ?? 10;

    const queryOjb: any = [{ user: userId }];

    if (date && date !== "") {
      const newDate = new Date(date);
      newDate.setUTCHours(0, 0, 0, 0);
      const tomorrow = new Date(newDate);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

      queryOjb.push({
        createdAt: {
          $gte: newDate.toISOString(),
          $lt: tomorrow.toISOString(),
        },
      });
    }

    const [images, totalCount] = await Promise.all([
      PhotoGeneration.find({
        $and: [...queryOjb],
      })
        .sort({ _id: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage),

      PhotoGeneration.find({
        $and: [...queryOjb],
      }).countDocuments(),
    ]);

    return { images, totalCount };
  }

  async update(req) {
    const { body } = req;

    const { imageId, prompt } = body;

    if (size(prompt.trim()) < 4)
      throw new Error("Updated prompt should be valid");

    const imageLibrary = await PhotoGeneration.findByIdAndUpdate(
      imageId,
      { prompt },
      { new: true }
    );

    if (!imageLibrary) throw new Error("Could not find library with this Id");
    return { ...ObjectManipulator.distruct(imageLibrary) };
  }

  async destroy(req) {
    const { Id } = req.params;

    if (!Id) throw new Error("ImageId is required to delete");
    const deletedImage = await PhotoGeneration.findByIdAndDelete(Id);

    if (!deletedImage) throw new Error("No Image found with this id.");

    return deletedImage;
  }
}

export default new ImageLibraryService();
