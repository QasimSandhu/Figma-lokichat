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
exports.convertTextToMp3 = void 0;
const textFormatting_1 = require("../../lib/helpers/textFormatting");
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs').promises;
const { exec } = require('child_process');
require('dotenv').config();
const client = new TextToSpeechClient();
const translateClient = new Translate();
const convertTextToMp3 = (text, language, voiceName, gender, speed, voiceMode, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const mergedFileName = 'audioFile.mp3';
    try {
        yield fs.access(mergedFileName);
        yield fs.unlink(mergedFileName);
        console.log(`Deleted existing file: ${mergedFileName}`);
    }
    catch (error) {
    }
    // const [translation] = await translateClient.translate(text, language);
    // const textToTranslate = translation;
    const chunkSize = 500;
    const textChunks = [];
    text = (0, textFormatting_1.getPlainTextFromMarkdown)((0, textFormatting_1.removeMarkdownHorizontalRules)(text));
    //console.log(text, " ===> text");
    for (let i = 0; i < text.length; i += chunkSize) {
        textChunks.push(text.substring(i, i + chunkSize));
    }
    const audioFiles = [];
    for (let i = 0; i < textChunks.length; i++) {
        const text = textChunks[i];
        const request = {
            input: { text: text },
            voice: { languageCode: language, name: voiceName, ssmlGender: gender },
            audioConfig: { audioEncoding: "MP3", speakingRate: speed },
        };
        try {
            const [response] = yield client.synthesizeSpeech(request);
            const fileName = `output_chunk_${userId}_${i}.mp3`;
            const writeFile = fs.writeFile;
            yield writeFile(fileName, response.audioContent, 'binary');
            console.log(`Audio chunk ${i} created`);
            audioFiles.push(fileName);
        }
        catch (error) {
            console.error(`Error in chunk ${i}:`, error.details || error.message);
            throw new Error(error.message);
        }
    }
    const mergeCommand = `ffmpeg -i "concat:${audioFiles.join('|')}" -c copy ${mergedFileName}`;
    exec(mergeCommand, (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.error('Error merging audio files:', error.message);
            return;
        }
        console.log('Audio files merged successfully:', mergedFileName);
        // Delete individual chunk files after merging
        for (const fileName of audioFiles) {
            try {
                yield fs.unlink(fileName);
                console.log(`Deleted ${fileName}`);
            }
            catch (deleteError) {
                console.error(`Error deleting ${fileName}:`, deleteError.message);
            }
        }
    }));
});
exports.convertTextToMp3 = convertTextToMp3;
// const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
// const fs = require('fs').promises;
// const { exec } = require('child_process');
// require('dotenv').config();
// const client = new TextToSpeechClient();
// export const convertTextToMp3 = async (text, language, voiceName, gender, speed, voiceMode) => {
//   const mergedFileName = 'audioFile.mp3';
//   try {
//     await fs.access(mergedFileName);
//     await fs.unlink(mergedFileName);
//     console.log(`Deleted existing file: ${mergedFileName}`);
//   } catch (error) {}
//   const chunkSize = 5000;
//   const textChunks = [];
//   for (let i = 0; i < text.length; i += chunkSize) {
//     textChunks.push(text.substring(i, i + chunkSize));
//   }
//   const audioFiles = [];
//   for (let i = 0; i < textChunks.length; i++) {
//     const chunk = textChunks[i];
//     // const ssml = `<speak><prosody rate="${speed}" pitch="${getPitch(voiceMode)}">${chunk}</prosody></speak>`;
//     // const request = {
//     //   input: { text: text },
//     //   voice: { languageCode: language, name: voiceName, ssmlGender: gender },
//     //   audioConfig: { audioEncoding: 'MP3',speakingRate:speed },
//     // };
//     const request = {
//       input: { text: text },
//       voice: { languageCode: language, name: voiceName, ssmlGender: gender },
//       audioConfig: { audioEncoding: "MP3" },
//     };
//     try {
//       const [response] = await client.synthesizeSpeech(request);
//       const fileName = `output_chunk_${i}.mp3`;
//       const writeFile = fs.writeFile;
//       await writeFile(fileName, response.audioContent, 'binary');
//       audioFiles.push(fileName);
//     } catch (error) {
//       console.error(`Error in chunk ${i}:`, error.details || error.message);
//     }
//   }
//   const mergeCommand = `ffmpeg -i "concat:${audioFiles.join('|')}" -c copy ${mergedFileName}`;
//   exec(mergeCommand, async (error, stdout, stderr) => {
//     if (error) {
//       console.error('Error merging audio files:', error.message);
//       return;
//     }
//     console.log('Audio files merged successfully:', mergedFileName);
//     // Delete individual chunk files after merging
//     for (const fileName of audioFiles) {
//       try {
//         await fs.unlink(fileName);
//       } catch (deleteError) {
//         console.error(`Error deleting ${fileName}:`, deleteError.message);
//       }
//     }
//   });
// };
// export function getPitch(emotion) {
//   switch (emotion) {
//     case 'friendly':
//       return 'x-high';
//     case 'sad':
//       return 'low';
//     case 'angry':
//       return 'x-low';
//     case 'whispering':
//       // Define pitch for whispering mode
//       return 'x-low';
//     case 'terrified':
//       // Define pitch for terrified mode
//       return 'x-low';
//     case 'unfriendly':
//       // Define pitch for unfriendly mode
//       return 'medium'; // Adjust as needed
//     case 'excited':
//       // Define pitch for excited mode
//       return 'x-high';
//     case 'hopeful':
//       // Define pitch for hopeful mode
//       return 'medium'; // Adjust as needed
//     case 'shouting':
//       // Define pitch for shouting mode
//       return 'x-high';
//     // Add more cases for other modes as needed
//     default:
//       return 'medium';
//   }
// }
//# sourceMappingURL=TextToSpeechConvertor.js.map