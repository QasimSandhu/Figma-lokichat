import axios from 'axios';

  class GetListVoices {
    private region;
    private subscriptionKey;

    constructor() {
      this.region = process.env.AZURE_SPEECH_SEARCH_REGION;
      this.subscriptionKey = process.env.AZURE_SPEECH_SEARCH_KEY;
    }
  
    async getAvailableVoices() {
      const token = await this.getAuthorizationToken();
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
          language: voice.Locale,
          gender: voice.Gender,
          speed: voice.WordsPerMinute,
          shortName: voice.ShortName,
          displayName: voice.DisplayName
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