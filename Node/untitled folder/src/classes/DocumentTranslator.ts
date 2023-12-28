import axios, { AxiosResponse } from "axios";
import { SubmitBatchResponse } from "src/interfaces/IBatchResponse";

const { BlobServiceClient } = require("@azure/storage-blob");

class DocumentTranslator {
    private connectionString: string;
    private containerName: string;
    private targetContainer: string;
    private route: string;
    private postBatchUrl: string;
    private key: string;
    private token: string;

    constructor() {
        // this.connectionString = "DefaultEndpointsProtocol=https;AccountName=first1122;AccountKey=d4EB3gn9Uvl891S7WPoVqhumDyA4s8C25SUU6V2j6Etm8+M6eTfc7UVzRkX545wrqdJSBH0Ibgpj+AStB2U4ng==;EndpointSuffix=core.windows.net";
        // this.containerName = process.env.AZURE_CONTAINER_NAME || "mycontainer";
        // this.postBatchUrl = "https://kamran.cognitiveservices.azure.com/translator/text/batch/v1.1"
        // this.route = "/batches"
        // this.key = process.env.AZURE_TRANSLATION_REQUEST_KEY || "b4c76100cd944086a32a94d2a0cc15f4";
        // this.targetContainer = "https://first1122.blob.core.windows.net/mycontainer"
        // this.token = 'sp=racwdli&st=2023-10-10T16:24:04Z&se=2025-10-11T00:24:04Z&spr=https&sv=2022-11-02&sr=c&sig=sygRuMTuD0JsSyR9EfgMY1qb5Zoj%2FnkUFnurObSxmyk%3D'

        this.connectionString = "DefaultEndpointsProtocol=https;AccountName=lokichatdev;AccountKey=Y5nOZqSkUTR601Gj45v4QIiBojPBJA1flszrr2BZ+XVkPmTAaBVhnOS9zG5eE8+ung32FmsH+OYl+AStY9t0TQ==;EndpointSuffix=core.windows.net";
        this.containerName = process.env.AZURE_CONTAINER_NAME || "translatedcontainer";
        this.postBatchUrl = "https://westeurope.api.cognitive.microsoft.com/translator/text/batch/v1.1"
        this.route = "/batches"
        this.key = process.env.AZURE_TRANSLATION_REQUEST_KEY || "ffa1afcb1bae462ba76ff64f12d068c1";
        this.targetContainer = "https://lokichatdev.blob.core.windows.net/translatedcontainer"
        this.token = 'sp=racwdli&st=2023-12-04T06:33:28Z&se=2026-04-01T14:33:28Z&spr=https&sv=2022-11-02&sr=c&sig=reQBKmMRdYX9Rqok%2FQkQSTdz6rgPmInmtaSaGURiONo%3D'
    }
    async uploadToAzureStorage(filePath, buffer, contentType) {

        const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
        const containerClient = blobServiceClient.getContainerClient(this.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(filePath);

        try {
            await blockBlobClient.upload(buffer, buffer.length, { blobHTTPHeaders: { blobContentType: contentType } });
            console.log("File uploaded successfully.");
            const uploadedUrl = blockBlobClient.url;
            return uploadedUrl; // Return the uploaded URL
        } catch (error) {
            console.error("Error during file upload:", error, error.message);
            throw error; // Re-throw the error to be caught in the /synthesize endpoint
        }
    }



    async submitDTRequest(urlToDocumentToTranslate: string, toLanguage: string, translatedFileName: string) {

        let data0 = {
            inputs: [
                {
                    storageType: "File",
                    source: {
                        sourceUrl: `${urlToDocumentToTranslate}`,
                        // storageSource: "AzureBlob",
                        // language: "en"
                    },
                    targets: [{
                        targetUrl: `${this.targetContainer}/${translatedFileName}?${this.token}`,
                        storageSource: "AzureBlob",
                        category: "general",
                        language: toLanguage
                    }]
                },
            ]
        }

        let config = {
            method: 'post',
            url: this.postBatchUrl + this.route,
            headers: {
                'Ocp-Apim-Subscription-Key': this.key,
                'Content-Type': 'application/json'
            },
            data: data0
        };
        console.log(JSON.stringify(config.data), " ===> config");

        let result: SubmitBatchResponse;
        try {
            const res: AxiosResponse = await axios.request(config)
            result = {
                success: res?.status == 202 ? true : false,
                status: res?.status,
                translatedFileUrl: `${this.targetContainer}/${translatedFileName}`,
                data: res?.data,
                headers: res?.headers,
                statusText: res?.statusText,
            }
        } catch (error) {
            console.log(error.message ?? error.msg, JSON.stringify(error), " ===> error");
            result = {
                success: false,
                data: error?.response?.data,
                stringError: JSON.stringify(error),
                message: error?.response?.data?.error?.message ?? error?.response?.data?.message ?? error?.data?.message ?? error?.message ?? "Failed to translate due to unknown reason.",
                code: error?.code ?? "",
                response: error?.response ?? {}
            }
        }
        return result;
    }

    async getBatchDetails(batchUrl: string) {

        let config = {
            method: 'get',
            url: batchUrl,
            headers: {
                'Ocp-Apim-Subscription-Key': this.key,
                'Content-Type': 'application/json'
            },
            data: {}
        };
        let result: SubmitBatchResponse;
        try {
            const res: AxiosResponse = await axios.request(config)
            result = {
                success: res?.status == 200 ? true : false,
                status: res?.status,
                data: res?.data,
                headers: res?.headers,
                statusText: res?.statusText,
            }
        } catch (error) {
            result = {
                success: false,
                data: error,
                stringError: JSON.stringify(error),
                message: error?.message ?? "",
                code: error?.code ?? "",
                response: error?.response ?? {}
            }
        }
        console.log(result.data, result?.data?.summary?.success, result?.data?.summary?.failed, " second Result");

        return result;
    }

    async recursiveBatchDetails(batchUrl: string) {
        const result = await this.getBatchDetails(batchUrl);
        if (result.success == true) {
            if (result.data?.status == 'Running' || result.data?.status == 'NotStarted') {
                await this.waitOneSecond();
                return await this.recursiveBatchDetails(batchUrl)
            } else if (result.data?.status == 'Succeeded') {
                return result;
            } else {
                return {
                    success: false,
                    data: result?.data,
                    stringError: JSON.stringify(result?.data),
                    message: result.data?.error?.message ?? "",
                    code: result.data?.error?.code ?? "",
                    response: result?.data ?? {}
                }
            }
        } else {
            return result;
        }
    }

    async waitOneSecond(): Promise<void> {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                console.log('2 second wait');
                resolve();
            }, 2000);
        });
    }

}

export default new DocumentTranslator()
