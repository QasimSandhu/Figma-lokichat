import axios from 'axios';

class TextToImageConfig {
    private apiKey;

    constructor() {
      this.apiKey = process.env.OPENAI_API_KEY;
    }

    async fetchQueuedImage(imageId: any) {
      try {
        const url = `https://stablediffusionapi.com/api/v3/fetch/${imageId}`;
        // const url = `https://stablediffusionapi.com/api/v3/fetch/41147071`
      const response = await axios.post(url, {
        key: this.apiKey,
      });

      return response.data;
    } catch (error) {
      console.error('Queued Image Error Generating:', error.response);
      return error.response;
    }
    }

    async getGeneratedImage(params) {

        try {
          const url = `https://stablediffusionapi.com/api/v3/text2img`;
          const response = await axios.post(url, { key: this.apiKey, ...params });
          // console.log('response', response.data);
          // const response = {
          //   status: 'processing',
          //   tip: 'Your image is processing in background, you can get this image using fetch API: here is link for fetch api : https://stablediffusionapi.com/docs/community-models-api-v4/dreamboothfetchqueimg',
          //   eta: 81.8557122048,
          //   messege: 'Try to fetch request after seconds estimated',
          //   fetch_result: 'https://stablediffusionapi.com/api/v3/fetch/41147071',
          //   id: 41147071,
          //   output: [],
          //   meta: {
          //     H: 1024,
          //     W: 1024,
          //     enable_attention_slicing: 'true',
          //     file_prefix: '8c381eee-e094-42f6-af42-5bbc00769c9e',
          //     guidance_scale: 7,
          //     model: 'runwayml/stable-diffusion-v1-5',
          //     n_samples: 4,
          //     negative_prompt: '',
          //     outdir: 'out',
          //     prompt: 'Battle of Crusades',
          //     revision: 'fp16',
          //     safetychecker: '0',
          //     seed: 236251693,
          //     steps: 20,
          //     vae: 'stabilityai/sd-vae-ft-mse'
          //   }
          // }
          // return response;
          return response.data;
        } catch (error) {
          console.error('Error Generating OpenAI Image:', error.response);
          return error.response.data;
        }
      }
  }
  
export default new TextToImageConfig();
