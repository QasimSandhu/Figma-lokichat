import axios from "axios";
import config from "../config/config";

class TestChatBot {
  private token;
  private endpoint;
  private errorMessage;

  constructor() {
    this.token = config.chatGPT.apiKey;
    this.endpoint = `${config.chatGPT.endpoint}/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15`;
    this.errorMessage = `Sorry, service is not available`;
  }
  async fetchAnswer(newMessage, systemPrompt, temperature, oldMessages) {
    try {
      const content = newMessage;

      console.log('conte', content);

      let payload = oldMessages
        ?.filter((item) => item.role === "user")
        ?.map((item) => {
          return {
            role: item.role,
            content: item.content,
          };
        });

      payload.push({ role: "user", content: content });

      let request = {
        messages: [
          {
            role: "system",
            content: systemPrompt || 'You are an AI assistant',
          },
          ...payload,
        ],
        temperature: temperature || 0.5, // Set your desired temperature value here
      };

      let { data } = await axios.post(this.endpoint, request, {
        headers: {
          "Content-Type": "application/json",
          "api-key": `${this.token}`,
        },
      });
      if (data.choices && data?.choices[0]?.message) {
        const response = data?.choices[0]?.message.content;
        const cleanedResponse = response.replace(/Assistant: \./, "");
        return cleanedResponse ?? this.errorMessage;
      }
      return this.errorMessage;
    } catch (error) {
      console.log('chat error', error);
      return this.errorMessage;
    }
  }
}

export default new TestChatBot();
