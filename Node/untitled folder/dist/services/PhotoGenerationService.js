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
const mongoose_1 = __importDefault(require("mongoose"));
const TextToImageConfig_1 = __importDefault(require("../classes/TextToImageConfig"));
const User_1 = __importDefault(require("../models/User"));
const Subscription_1 = __importDefault(require("../models/Subscription"));
class PhotoGenerationService {
    store(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            let { prompt, width, height, isNSFW, negativePrompt, noOfImages, interferenceSteps, guidanceScale, enhancePrompt, } = body;
            const params = {
                prompt,
                width,
                height,
                negative_prompt: negativePrompt,
                samples: noOfImages,
                safety_checker: isNSFW,
                guidance_scale: guidanceScale,
                num_inference_steps: interferenceSteps,
                panorama: enhancePrompt,
            };
            let photoGeneratedData = {};
            const user = yield User_1.default.findById(userId);
            const userImagesCount = (user === null || user === void 0 ? void 0 : user.imagesCount) || 0;
            if (!user) {
                throw new Error("User not found");
            }
            if (!user.subscription) {
                let limit = 10;
                //@ts-ignore
                if (userImagesCount >= limit) {
                    throw new Error("Free limit exceed please buy subscription");
                }
                //@ts-ignore
                if (userImagesCount < limit && limit < (userImagesCount + noOfImages)) {
                    //@ts-ignore
                    const remainingLimit = limit - userImagesCount;
                    throw new Error(`Your remaining limit is ${remainingLimit} images.`);
                }
            }
            if (user) {
                const subscriptions = yield Subscription_1.default.find();
                const findMatchingPlanTitle = (subscriptionId, subscriptions) => {
                    for (const subscription of subscriptions) {
                        const matchingPlan = subscription.plans.find((plan) => plan._id.toString() === (subscriptionId === null || subscriptionId === void 0 ? void 0 : subscriptionId.toString()));
                        if (matchingPlan) {
                            return matchingPlan;
                        }
                    }
                    return null;
                };
                const matchingPlanTitle = findMatchingPlanTitle(user.subscription, subscriptions);
                if (matchingPlanTitle) {
                    if (userImagesCount >= (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.imagesAllowed)) {
                        throw new Error("limit exceed please buy more images");
                    }
                    //@ts-ignore
                    if (userImagesCount < (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.imagesAllowed) && (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.imagesAllowed) < (userImagesCount + noOfImages)) {
                        //@ts-ignore
                        const remainingLimit = matchingPlanTitle.imagesAllowed - userImagesCount;
                        throw new Error(`Your remaining limit is ${remainingLimit} images.`);
                    }
                }
            }
            const textToImgResponse = yield TextToImageConfig_1.default.getGeneratedImage(params);
            if (textToImgResponse.status === "processing") {
                photoGeneratedData.eta = textToImgResponse.eta;
                photoGeneratedData.imageId = textToImgResponse.id;
            }
            else if (textToImgResponse.status !== "success") {
                throw new Error(textToImgResponse.messege || "Could not generate image from provided prompt");
            }
            else if (textToImgResponse.status === "success") {
                // here will apply a for loop and push urls into this one.
                photoGeneratedData.imagePathUrls = textToImgResponse === null || textToImgResponse === void 0 ? void 0 : textToImgResponse.output;
            }
            const photoGenerated = new PhotoGeneration_1.default({
                user: userId,
                prompt,
                eta: photoGeneratedData.eta || 0,
                imageId: photoGeneratedData.imageId || null,
                imagePathUrls: textToImgResponse === null || textToImgResponse === void 0 ? void 0 : textToImgResponse.output,
                negativePrompt: negativePrompt || "",
            });
            if (photoGenerated) {
                try {
                    yield User_1.default.findByIdAndUpdate(userId, { $inc: { imagesCount: noOfImages } });
                }
                catch (error) {
                    console.error("Error updating ImagesCount:", error);
                }
            }
            yield photoGenerated.save();
            return photoGenerated;
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { photoGeneratedId, message, messageId } = body;
            const textToImgResponse = yield TextToImageConfig_1.default.getGeneratedImage(message);
            const data = {};
            if (textToImgResponse.status === "processing") {
                data.eta = textToImgResponse.eta;
                data.imageId = textToImgResponse.id;
                data.content = null;
            }
            else if (textToImgResponse.status !== "success")
                throw new Error(textToImgResponse.messege ||
                    "Could not generate image from provided prompt");
            else {
                data.content = textToImgResponse === null || textToImgResponse === void 0 ? void 0 : textToImgResponse.output[0];
                data.eta = 0;
                data.imageId = null;
            }
            yield PhotoGeneration_1.default.findOneAndUpdate({
                _id: new mongoose_1.default.Types.ObjectId(photoGeneratedId),
                "messages.responseTo": messageId,
            }, {
                $set: {
                    "messages.$.content": data.content,
                    "messages.$.eta": data.eta,
                    "messages.$.imageId": data.imageId,
                },
            }, { new: true });
            return {
                _id: photoGeneratedId,
                message: message,
                response: data.content,
                messageId: messageId,
                imageId: data.imageId,
                eta: data.eta,
            };
        });
    }
    fetchQueuedPhoto(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { photoId, imageId } = body;
            const queuedImageResponse = yield TextToImageConfig_1.default.fetchQueuedImage(imageId);
            if (queuedImageResponse.status !== "success")
                throw new Error(queuedImageResponse.messege || "Could not generate image from provided prompt");
            const updatedResponse = yield PhotoGeneration_1.default.findOneAndUpdate({ _id: photoId }, {
                $set: {
                    "imagePathUrls": queuedImageResponse === null || queuedImageResponse === void 0 ? void 0 : queuedImageResponse.output,
                    "imageId": null,
                    "eta": 0,
                },
            }, { new: true });
            return updatedResponse;
        });
    }
}
exports.default = new PhotoGenerationService();
//# sourceMappingURL=PhotoGenerationService.js.map