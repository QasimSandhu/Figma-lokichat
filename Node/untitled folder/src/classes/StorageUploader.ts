const { BlobServiceClient } = require("@azure/storage-blob");

class StorageUploader {
    private connectionString;
    private containerName;

    constructor(){
        this.connectionString = process.env.AZURE_BLOB_STRING;
        this.containerName = process.env.AZURE_BLOB_CONTAINER_NAME;
    }
    async uploadToAzureStorage(filePath, buffer, contentType) {

      const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
      const containerClient = blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(filePath);
  
      try {
        await blockBlobClient.upload(buffer, buffer.length, { blobHTTPHeaders: { blobContentType: contentType } });
        console.log("File uploaded successfully.", blockBlobClient.url);
        const uploadedUrl = blockBlobClient.url;
        return uploadedUrl; // Return the uploaded URL
      } catch (error) {
        console.error("Error during file upload:", error.message);
        throw error; // Re-throw the error to be caught in the /synthesize endpoint
      }
    }
  }

export default new StorageUploader()
