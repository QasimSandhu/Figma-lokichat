import axios from "axios";

class LLama2Bot {
  private token;
  private endpoint;
  private modelName;
  private errorMessage;

  constructor() {
    this.token = process.env.LLAMA2_MODEL_KEY;
    this.endpoint = process.env.LLAMA2_MODEL_URL;
    this.modelName = "meta-llama/Llama-2-70b-chat-hf"
    this.errorMessage = `Sorry, service is not available`;
  }
  async fetchAnswer(oldMessages, newMessage) {
    try {

    newMessage = newMessage
    const initialMessage = {
        "role": "system",
        "content": `Your name is Loki who is an experienced professor who is proficient in multiple languages such as English, French, Spanish, Dutch etc. Your task is to provide the answer to the student in clear narration style paragraphs. Follow these instructions before initializing final response. 
 
        Rules:
        - Always reply in the language that the user is speaking 
        - Just start generating response rather than asking for clarifying question
        - ALWAYS RESPOSNE IN MARKDOWN FORMAT USING BOLD, HEADINGS, PARAGRAPHS AND LIST.`
    };
    let messages = [];
    let payload = oldMessages
    ?.filter((item) => item.role === "user" || item.role === 'system')
    ?.map((item) => {
      return {
        role: item.role === "system" ? "assistant" : item.role,
        content: item.content,
      };
    });

    payload.push({ role: "user", content: newMessage });
    messages = [initialMessage, ...payload];

      const { data } = await axios.post(this.endpoint,
        { temperature: 0.4, model: this.modelName, messages },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": `${this.token}`,
          },
        }
      );
      if (data.choices[0] && data?.choices[0]?.message) {
        const response = data?.choices[0]?.message?.content;
        return response ?? this.errorMessage;
      }
      return this.errorMessage;
    } catch (error) {
      console.log("error", error.response);
      console.log("chat error", error?.response?.data?.error?.message ?? this.errorMessage);
    }
  }
  async promptAdvisor(newMessage) {
    try {
      const content = newMessage;

      let payload = [];

      payload.push({ role: "user", content: content });

      let request = {
        messages: [
          {
            role: "system",
            content: `Assuming the role of a seasoned student who is very curious and tries to always ask more questions which are relevant to the topic. Always try to provide at least 10 follow-up questions. \n\nHere is the response from which you have to generate the questions: \"${content}`,
          },
          ...payload,
        ],
        temperature: 1,
      };

      request["model"] = "gpt-3.5-turbo-instruct";

      let { data } = await axios.post(this.endpoint, request, {
        headers: {
          "Content-Type": "application/json",
          "api-key": `${this.token}`,
        },
      });
      if (data.choices && data?.choices[0]?.message) {
        const response = data?.choices[0]?.message.content;
        const cleanedResponse = response.replace(/Assistant: \./, "");
        return cleanedResponse.split("\n") ?? this.errorMessage;
      }
      return this.errorMessage;
    } catch (error) {
      console.log("chat error", error?.response?.data?.error?.message ?? this.errorMessage);
      return error?.response?.data?.error?.message ?? this.errorMessage;
    }
  }
}

export default new LLama2Bot();
