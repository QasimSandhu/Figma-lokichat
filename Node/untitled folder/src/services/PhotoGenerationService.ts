import PhotoGeneration from "../models/PhotoGeneration";
import mongoose from "mongoose";
import TextToImageConfig from "../classes/TextToImageConfig";
import User from "../models/User";
import Subscription from "../models/Subscription";

class PhotoGenerationService {
  async store(req) {
    const { body, userId } = req;

    let {
      prompt,
      width,
      height,
      isNSFW,
      negativePrompt,
      noOfImages,
      interferenceSteps,
      guidanceScale,
      enhancePrompt,
    } = body;

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
    let photoGeneratedData: any = {};
    const user = await User.findById(userId);
    const userImagesCount = user?.imagesCount || 0;
    if (!user) {
        throw new Error(
          "User not found")
    }
    if(!user.subscription){
      let limit = 10
      //@ts-ignore
      if (userImagesCount >= limit) {
        throw new Error(
          "Free limit exceed please buy subscription")
      }
       //@ts-ignore
       if (userImagesCount < limit && limit < (userImagesCount + noOfImages)) {
        //@ts-ignore
        const remainingLimit = limit - userImagesCount as number;
        throw new Error(
          `Your remaining limit is ${remainingLimit} images.`
        );
      }
    }
    if(user){
      const subscriptions = await Subscription.find();     
      const findMatchingPlanTitle = (subscriptionId: string, subscriptions: any[]) => {
        for (const subscription of subscriptions) {
          const matchingPlan = subscription.plans.find((plan: any) => plan._id.toString() === subscriptionId?.toString());
      
          if (matchingPlan) {
            return matchingPlan;
          }
        }
        return null;
      };
      const matchingPlanTitle = findMatchingPlanTitle(user.subscription, subscriptions);
      
      if(matchingPlanTitle){
        if (userImagesCount >= matchingPlanTitle?.imagesAllowed) {
          throw new Error(
            "limit exceed please buy more images")
        }
         //@ts-ignore
         if (userImagesCount < matchingPlanTitle?.imagesAllowed && matchingPlanTitle?.imagesAllowed < (userImagesCount + noOfImages)) {
          //@ts-ignore
          const remainingLimit = matchingPlanTitle.imagesAllowed - userImagesCount as number;
          throw new Error(
            `Your remaining limit is ${remainingLimit} images.`
          );
        }
      }
         
    }
    const textToImgResponse = await TextToImageConfig.getGeneratedImage(params);

    if (textToImgResponse.status === "processing") {
      photoGeneratedData.eta = textToImgResponse.eta;
      photoGeneratedData.imageId = textToImgResponse.id;
    } else if (textToImgResponse.status !== "success") {
      throw new Error(textToImgResponse.messege || "Could not generate image from provided prompt");
    } else if (textToImgResponse.status === "success") {
      // here will apply a for loop and push urls into this one.
      photoGeneratedData.imagePathUrls = textToImgResponse?.output;
    }

    const photoGenerated = new PhotoGeneration({
      user: userId,
      prompt,
      eta: photoGeneratedData.eta || 0,
      imageId: photoGeneratedData.imageId || null,
      imagePathUrls: textToImgResponse?.output,
      negativePrompt: negativePrompt || "",
    });
if(photoGenerated){
  try {
    await User.findByIdAndUpdate(userId, { $inc: { imagesCount: noOfImages } });
  } catch (error) {
    console.error("Error updating ImagesCount:", error);
  }
  
}
    await photoGenerated.save();

    return photoGenerated;
  }

  async update(req) {
    const { body } = req;
    const { photoGeneratedId, message, messageId } = body;

    const textToImgResponse = await TextToImageConfig.getGeneratedImage(
      message
    );

    const data: any = {};

    if (textToImgResponse.status === "processing") {
      data.eta = textToImgResponse.eta;
      data.imageId = textToImgResponse.id;
      data.content = null;
    } else if (textToImgResponse.status !== "success")
      throw new Error(
        textToImgResponse.messege ||
          "Could not generate image from provided prompt"
      );
    else {
      data.content = textToImgResponse?.output[0];
      data.eta = 0;
      data.imageId = null;
    }

    await PhotoGeneration.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(photoGeneratedId),
        "messages.responseTo": messageId,
      },
      {
        $set: {
          "messages.$.content": data.content,
          "messages.$.eta": data.eta,
          "messages.$.imageId": data.imageId,
        },
      },
      { new: true }
    );

    return {
      _id: photoGeneratedId,
      message: message,
      response: data.content,
      messageId: messageId,
      imageId: data.imageId,
      eta: data.eta,
    };
  }

  async fetchQueuedPhoto(req) {
    const { body } = req;
    const { photoId, imageId } = body;

    const queuedImageResponse = await TextToImageConfig.fetchQueuedImage(imageId);

    if (queuedImageResponse.status !== "success")
      throw new Error(queuedImageResponse.messege || "Could not generate image from provided prompt");
    
    const updatedResponse = await PhotoGeneration.findOneAndUpdate(
      { _id: photoId },
      {
        $set: {
          "imagePathUrls": queuedImageResponse?.output,
          "imageId": null,
          "eta": 0,
        },
      },
      { new: true }
    );

    return updatedResponse;
  }
}

export default new PhotoGenerationService();
