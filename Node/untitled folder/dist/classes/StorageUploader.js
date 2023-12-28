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
Object.defineProperty(exports, "__esModule", { value: true });
const { BlobServiceClient } = require("@azure/storage-blob");
class StorageUploader {
    constructor() {
        this.connectionString = process.env.AZURE_BLOB_STRING;
        this.containerName = process.env.AZURE_BLOB_CONTAINER_NAME;
    }
    uploadToAzureStorage(filePath, buffer, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
            const containerClient = blobServiceClient.getContainerClient(this.containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(filePath);
            try {
                yield blockBlobClient.upload(buffer, buffer.length, { blobHTTPHeaders: { blobContentType: contentType } });
                console.log("File uploaded successfully.", blockBlobClient.url);
                const uploadedUrl = blockBlobClient.url;
                return uploadedUrl; // Return the uploaded URL
            }
            catch (error) {
                console.error("Error during file upload:", error.message);
                throw error; // Re-throw the error to be caught in the /synthesize endpoint
            }
        });
    }
}
exports.default = new StorageUploader();
//# sourceMappingURL=StorageUploader.js.map