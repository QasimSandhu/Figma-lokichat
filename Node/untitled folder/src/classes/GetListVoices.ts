import axios from 'axios';

  
  class GetListVoices {
    private region;
    private subscriptionKey;
    private tokenProvider;

    constructor() {
      this.tokenProvider = this.getAuthorizationToken();
      this.region = process.env.AZURE_CONGNITIVE_REGION;
      this.subscriptionKey = process.env.AZURE_CONGNITIVE_SERVICE_KEY;
    }
  
    async getAvailableVoices() {
      const token = await this.tokenProvider.getAuthorizationToken();
      if (!token) {
        return null;
      }
  
      const endpoint = `https://${this.region}.tts.speech.microsoft.com/cognitiveservices/voices/list`;
      try {
        const response = await axios.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const { data } = response;
        
        // Extract and return required attributes from the response
        const voices = data.map((voice: any) => ({
          language: voice.locale,
          gender: voice.gender,
          speed: voice.speakingRate,
        }));

        return voices;
        // return response.data;
      } catch (error) {
        console.error('Error fetching available voices:', error);
        return null;
      }
    }

    async getAuthorizationToken() {
        const endpoint = `https://${this.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
        try {
          const response = await axios.post(endpoint, null, {
            headers: {
              'Ocp-Apim-Subscription-Key': this.subscriptionKey,
              'Content-Length': 0,
            },
          });
          return response.data;
        } catch (error) {
          console.error('Error fetching authorization token:', error);
          return null;
        }
      }
  }

  export default new GetListVoices();
  
//   const ttsService = new TextToSpeechService(region);