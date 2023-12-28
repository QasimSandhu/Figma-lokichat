const axios = require("axios");
const { v4 } = require("uuid");

class AzureTranslator {
  private endpoint;
  private region;
  private subscriptionKey;

  constructor() {
    this.endpoint = process.env.AZURE_TRANSLATOR_END_POINT;
    this.region = process.env.AZURE_TRANSLATOR_REGION;
    this.subscriptionKey = process.env.AZURE_TRANSLATOR_KEY;
  }

  async translateText(text: string, lang: string) {
    const url = `${this.endpoint}/translate?api-version=3.0&to=${lang}`;
    const headers = {
      "Ocp-Apim-Subscription-Key": this.subscriptionKey,
      "Ocp-Apim-Subscription-Region": this.region,
      "Content-type": "application/json",
      "X-ClientTraceId": v4().toString(),
    };
    const data = [{ text: text }];

    const response = await axios.post(url, data, { headers });
    const translations = response.data[0].translations;
    if (translations && translations.length > 0) {
      return translations[0].text;
    }
  }
}

export default new AzureTranslator();
