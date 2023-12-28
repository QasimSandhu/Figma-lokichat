import { logger } from "@azure/storage-blob";
import { getPlainTextFromMarkdown, removeMarkdownHorizontalRules } from "../../lib/helpers/textFormatting";

const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs').promises;
const { exec } = require('child_process');

require('dotenv').config();
const client = new TextToSpeechClient();
const translateClient = new Translate();
export const convertTextToMp3 = async (text, language, voiceName, gender, speed, voiceMode,userId) => {
  
  const mergedFileName = 'audioFile.mp3';
  try {
    await fs.access(mergedFileName);
    await fs.unlink(mergedFileName);
    console.log(`Deleted existing file: ${mergedFileName}`);
  } catch (error) {
  }

  // const [translation] = await translateClient.translate(text, language);
  // const textToTranslate = translation;
  
  const chunkSize = 500;
  const textChunks = [];

  text = getPlainTextFromMarkdown(removeMarkdownHorizontalRules(text))

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
            audioConfig: { audioEncoding: "MP3",speakingRate:speed },
          };

    try {
      const [response] = await client.synthesizeSpeech(request);
      const fileName = `output_chunk_${userId}_${i}.mp3`;
      const writeFile = fs.writeFile;
      await writeFile(fileName, response.audioContent, 'binary');
      console.log(`Audio chunk ${i} created`);
      audioFiles.push(fileName);
    } catch (error) {
      console.error(`Error in chunk ${i}:`, error.details || error.message);
      throw new Error(error.message);
    }
  }

  const mergeCommand = `ffmpeg -i "concat:${audioFiles.join('|')}" -c copy ${mergedFileName}`;

  exec(mergeCommand, async (error, stdout, stderr) => {
    if (error) {
      console.error('Error merging audio files:', error.message);
      return;
    }
    console.log('Audio files merged successfully:', mergedFileName);

    // Delete individual chunk files after merging
    for (const fileName of audioFiles) {
      try {
        await fs.unlink(fileName);
        console.log(`Deleted ${fileName}`);
      } catch (deleteError) {
        console.error(`Error deleting ${fileName}:`, deleteError.message);
      }
    }
  });


}


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
