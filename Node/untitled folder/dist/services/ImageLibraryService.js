"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PhotoGeneration_1 = __importDefault(require("../models/PhotoGeneration"));
const ObjectDestructurer_1 = __importDefault(require("../lib/helpers/ObjectDestructurer"));
const lodash_1 = require("lodash");
class ImageLibraryService {
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, userId } = req;
            let { date, page, resPerPage } = query;
            page = page !== null && page !== void 0 ? page : 1;
            resPerPage = resPerPage !== null && resPerPage !== void 0 ? resPerPage : 10;
            const queryOjb = [{ user: userId }];
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
            const [images, totalCount] = yield Promise.all([
                PhotoGeneration_1.default.find({
                    $and: [...queryOjb],
                })
                    .sort({ _id: -1 })
                    .skip(resPerPage * page - resPerPage)
                    .limit(resPerPage),
                PhotoGeneration_1.default.find({
                    $and: [...queryOjb],
                }).countDocuments(),
            ]);
            return { images, totalCount };
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { imageId, prompt } = body;
            if ((0, lodash_1.size)(prompt.trim()) < 4)
                throw new Error("Updated prompt should be valid");
            const imageLibrary = yield PhotoGeneration_1.default.findByIdAndUpdate(imageId, { prompt }, { new: true });
            if (!imageLibrary)
                throw new Error("Could not find library with this Id");
            return Object.assign({}, ObjectDestructurer_1.default.distruct(imageLibrary));
        });
    }
    destroy(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            if (!Id)
                throw new Error("ImageId is required to delete");
            const deletedImage = yield PhotoGeneration_1.default.findByIdAndDelete(Id);
            if (!deletedImage)
                throw new Error("No Image found with this id.");
            return deletedImage;
        });
    }
}
exports.default = new ImageLibraryService();
//# sourceMappingURL=ImageLibraryService.js.map