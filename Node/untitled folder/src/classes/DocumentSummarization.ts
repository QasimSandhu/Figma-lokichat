import { AzureKeyCredential, TextAnalysisClient } from '@azure/ai-language-text';
import pdfParse from 'pdf-parse';
import mammoth from "mammoth";
import fs from 'fs';

class DocumentSummarizer {
    private endpoint: string;
    private key: string;

    constructor() {
        this.endpoint = 'https://kamransummary.cognitiveservices.azure.com/';
        this.key = 'e62fdbf6b2a544f180a4fdb59adc45f6';
    }

    async summarizeDocument(document: string, language: string): Promise<string> {

        const client = new TextAnalysisClient(this.endpoint, new AzureKeyCredential(this.key));


        const options = {
            language: language,
            modelVersion: "latest",
            maxSentenceCount: 3, // Number of sentences in the summary
        };

        //@ts-ignore
        const result = await client.extractSummary([document], options);

        return result[0].sentences.map((sentence) => sentence.text).join(" ");
    }

    async main(documents: string[], maxSentenceCount: number): Promise<string> {
        console.log("== Extractive Summarization Sample ==");

        const client = new TextAnalysisClient(this.endpoint, new AzureKeyCredential(this.key));
        const actions = [
            {
                kind: "ExtractiveSummarization",
                maxSentenceCount: maxSentenceCount,
            },
        ];
        //@ts-ignore
        const poller = await client.beginAnalyzeBatch(actions, documents);

        poller.onProgress(() => {
            console.log(
                `Last time the operation was updated was on: ${poller.getOperationState().modifiedOn}`
            );
        });
        console.log(`The operation was created on ${poller.getOperationState().createdOn}`);
        console.log(`The operation results will expire on ${poller.getOperationState().expiresOn}`);

        const results = await poller.pollUntilDone();
        var resultText: string = '';
        for await (const actionResult of results) {
            if (actionResult.kind !== "ExtractiveSummarization") {
                throw new Error(`Expected extractive summarization results but got: ${actionResult.kind}`);
            }
            if (actionResult.error) {
                const { code, message } = actionResult.error;
                throw new Error(`Unexpected error (${code}): ${message}`);
            }
            //@ts-ignore
            for (const result of actionResult?.results) {
                console.log(`- Document ${result.id}`);
                if (result.error) {
                    const { code, message } = result.error;
                    throw new Error(`Unexpected error (${code}): ${message}`);
                }
                console.log("Summary:");
                console.log(result.sentences.map((sentence) => sentence.text).join("\n"));
                //@ts-ignore
                resultText += result.sentences.map((sentence) => sentence.text).join("\n");
            }
        }
        return resultText;
    }

    async getFileText(file: File | any): Promise<string> {
        try {
            const type = file?.mimetype
        if (type == 'application/pdf') {
            const pdf = await pdfParse(file.buffer);
            const text = pdf.text
            return text;
        } else if (type == 'application/msword' || type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {//'application/msword'
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            return result.value;
        } else if (type == 'text/plain') {
            try {
                const text = file.buffer.toString('utf8');
                // console.log(text," ==>txt");
                return text;
            } catch (error) {
                throw new Error(error?.message ?? "Failed to read file.")
            }
        } else {
            throw new Error(`InValid File Sent`);
        }
        } catch (error) {
            throw new Error('Unable to extract text. Check the file content and try again.')
        }
    }

    readTextFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
    
          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };
    
          reader.onerror = (error) => {
            reject(error);
          };
    
          reader.readAsText(file);
        });
      };

}

export default new DocumentSummarizer()
