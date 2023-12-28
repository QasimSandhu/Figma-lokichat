import DocumentTranslator from "../classes/DocumentTranslator";
import User from "../models/User";
import { SubmitBatchResponse } from "../interfaces/IBatchResponse";
import Translation from "../models/Translations";

class DocumentTranslationService {
  async store(req) {
    const { body, userId, file } = req;
    const { targetLanguage } = body;

    const user = await User.findById(userId);

    if (!user)
      throw new Error("User not found")

    try {

      const fileBuffer = file.buffer;
      const originalName = `${new Date().toString()}.${file?.originalname?.split('.')[file?.originalname?.split('.').length - 1]}` // `${file?.originalname}`

      const sourceUploadUrl = await DocumentTranslator.uploadToAzureStorage(
        originalName,
        fileBuffer,
        file?.mimetype
      );

      const result: SubmitBatchResponse = await DocumentTranslator.submitDTRequest(sourceUploadUrl, targetLanguage, `${new Date().getTime()}-${targetLanguage}-${originalName ?? "Unknown"}`)
      if (result?.status == 202) {
        const batchUrl = result?.headers['operation-location']
        const batchDetails: SubmitBatchResponse = await DocumentTranslator.recursiveBatchDetails(batchUrl)
        if (batchDetails.success == true) {
          var totalCharacterCharged = batchDetails?.data?.summary?.totalCharacterCharged;
          const createTranslation = await Translation.create({
            user: userId,
            originalDocumentUrl: sourceUploadUrl,
            translatedDocumentUrl: result?.translatedFileUrl,
            totalCharacterCharged: totalCharacterCharged ?? 0,
            getRequestBatchUrl: batchUrl,
            type: 'DOCUMENT',
            translatedLanguage: targetLanguage
          })
          console.log(createTranslation, " ===> createTranslation");

          if (createTranslation) {
            return createTranslation;
          } else {
            console.log("db creation error throws from here.");
            throw new Error('Translation unsuccessful. Ensure the input is valid and retry.')
          }
        }else{
          console.log("Second Error throws from here.");
          throw new Error('Translation unsuccessful. Ensure the input is valid and retry.')
        }
      } else {
        console.log("First Error throws from here");
        throw new Error('Translation unsuccessful. Ensure the input is valid and retry.');
      }
    } catch (error) {
      console.log('err-catch', error)
      throw new Error(error)
    }

  }
}

export default new DocumentTranslationService();
