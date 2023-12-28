export default interface IPhotoGeneration extends Document {
    id: string;
    user: any;
    prompt: string;
    negativePrompt: string | null;
    imagePathUrls: string | null;
    eta: number;
    imageId: number | null;
}