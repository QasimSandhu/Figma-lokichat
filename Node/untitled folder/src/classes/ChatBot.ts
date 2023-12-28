import axios from "axios";
import config from "../config/config";
import { Configuration, OpenAIApi } from "openai";

class OpenAIBot {
  private token;
  private endpoint;
  private errorMessage;
  private davinciModelUrl;
  private davinciModelKey;

  constructor() {
    this.token = config.chatGPT.apiKey;
    this.davinciModelKey = config.chatGPT.davinciApiKey;
    this.davinciModelUrl = `${config.chatGPT.davinciApiURL}openai/deployments/text-davinci-003/completions?api-version=2023-09-15-preview`;
    this.endpoint = `${config.chatGPT.endpoint}openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15`;
    this.errorMessage = `Sorry, service is not available`;
  }
  async fetchAnswer(oldMessages, newMessage, type: string = "chat", chatModel="gpt-35-turbo") {
    try {
      const content = newMessage;

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
            content:
              type == "sum"
                ? `You are a Text Summarizer, who does not mention anything else other than the summary. For example, DO NOT start the answer with "Sure, here is the summary". Make sure to provide a clear and concise summary, and after the summary if possible please generate bullet points for the at least 10 key highlights as well.
            Here is the text :
             "${newMessage}"`
                : `Acting as a seasoned professor. Answer students query which is '${newMessage}' Ensure the response is structured as a clear, narratable paragraph. Before answering make sure to format the response in a proper HTML format making sure to use bold headings size no more than 16px and add spaces between paragraphs.
            Guidelines: Structure your response in clear, succinct, and organized paragraphs for easy assimilation. Anticipate that your words will be narrated, so craft them to be both readable and audibly engaging. Uphold a tone that's both professional and instructive. Aim for linguistic precision, reflecting your commitment to the highest standards of academic excellence.`,
          },
          ...payload,
        ],
        temperature: type == "sum" ? 0 : 0.5, // Set your desired temperature value here
      };

      if(chatModel === "gpt-35-turbo") {
        request["model"] = "gpt-35-turbo";
      } else if(chatModel === "text-davinci-003") request["model"] = "text-davinci-003";

      if (type == "sum") request["model"] = "gpt-35-turbo";

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
      console.log('er', error, " ===? summary error");
      console.log(error?.response ?? error?.response?.data ?? error?.message, " ===> summary error");
      
      // return this.errorMessage;
      throw new Error(error?.response?.message ?? error?.response?.data?.message ?? error?.message);
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
      console.log("chat error", error.response);
      return this.errorMessage;
    }
  }
  async promptAdvisor2(message: string) {
    console.log(message, "message");

    try {
      const configuration = new Configuration({
        apiKey: `${process.env.OPENAI_API_KEY2}`,
      });
      //@ts-ignore
      const openai = new OpenAIApi(configuration);
      const response1 = await openai.createCompletion({
        model: "gpt-3.5-turbo-instruct",
        prompt: `Assuming the role of a seasoned student who is very curious and tries to always ask more questions which are relevant to the topic. Always try to provide at least 10 follow-up questions. \n\nHere is the response from which you have to generate the questions: \"${message}`,
        temperature: 1,
        max_tokens: 4048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return response1;
    } catch (error) {
      console.log(error, "errror");
      throw new Error(error?.message ?? error);
    }
  }

  async fetchAnswerDavinci(message) {
    const content = `Convert the response in HTML implement either <ol> (ordered list) or <ul> (unordered list) tags for creating easy-to-follow numbered points. Each block element, including <div>, <p>, <br>, <ul>, <li>, <ol>, or <b> will maintain a stylistic consistency with a margin-top of 16 pixels for optimal readability. The task, however, strictly prohibits the use of <html>, <head>, and <body> tags. In case the provided prompt is borne of ambiguity or lacks sufficient detail, I will express an apology for the misunderstanding or kindly seek a more defined prompt. Here is an example of how the response should be: <div style="margin-top: 10px;"> <p><b>The Concept of Factorials:</b></p> <p>Factorials are a fundamental concept in mathematics associated with positive integers. The factorial of an integer is often denoted by the symbolism <b>"!"</b>, where the operation involves obtaining the product of all positive integers up to the specified number. For instance, the factorial of number 5, denoted as <i>5!</i>, can be obtained as <i>5 x 4 x 3 x 2 x 1</i> which equals <b>120</b>.</p> <br> <p><u>Applications of Factorials:</u></p> <p>Factorials serve an integral role in numerous mathematical realms, inclusive of combinatorics, permutations, and probability calculations. In essence, understanding the groundwork of factorials builds a stronger foundation for delving into more intricate elements of mathematical solutions and concepts.</p> <br> <b><u>Properties of Factorials:</u></b> <ol style="margin-top: 10px;"> <li>The factorial operation is confined to positive integers. Hence, the factorial of a negative number remains undefined.</li> <li>A unique exception to the aforementioned guideline is 0! which is defined as 1.</li> <li>The factorial of a number entails exponential growth, therefore, upon input increase, express growth in its factorial is observed.</li> </ol> <br> <p><u>Calculation of Factorials:</u></p> <p>Various approaches can be employed when calculating factorials, among them is recursion and iteration. Recursion is the practice of defining the factorial of a number in terms of the factorial of a lesser number. A frequently used iterative approach involves utilizing a loop structure to continually multiply the present integer by all numerically lesser integers down to 1.</p> </div> convert the following message: ${message}`;
    const requestData = {
      prompt: content,
      max_tokens: 2604,
      temperature: 0,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 1,
      best_of: 1,
      stop: null,
    };
    try {
      const result = await axios.post(this.davinciModelUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          "api-key": this.davinciModelKey,
        },
      });
      const { data } = result;
      return data.choices[0].text ?? "Sorry, could not generate chat";
    } catch (error) {
      console.log("api error", error);
      return "Sorry, could not generate chat";
    }
  }
  async fetchAnswerDavinci2(oldMessages, newMessage) {
    const content = `Convert the response in HTML implement either <ol> (ordered list) or <ul> (unordered list) tags for creating easy-to-follow numbered points. Each block element, including <div>, <p>, <br>, <ul>, <li>, <ol>, or <b> will maintain a stylistic consistency with a margin-top of 16 pixels for optimal readability. The task, however, strictly prohibits the use of <html>, <head>, and <body> tags. In case the provided prompt is borne of ambiguity or lacks sufficient detail, I will express an apology for the misunderstanding or kindly seek a more defined prompt. Here is an example of how the response should be: <div style="margin-top: 10px;"> <p><b>The Concept of Factorials:</b></p> <p>Factorials are a fundamental concept in mathematics associated with positive integers. The factorial of an integer is often denoted by the symbolism <b>"!"</b>, where the operation involves obtaining the product of all positive integers up to the specified number. For instance, the factorial of number 5, denoted as <i>5!</i>, can be obtained as <i>5 x 4 x 3 x 2 x 1</i> which equals <b>120</b>.</p> <br> <p><u>Applications of Factorials:</u></p> <p>Factorials serve an integral role in numerous mathematical realms, inclusive of combinatorics, permutations, and probability calculations. In essence, understanding the groundwork of factorials builds a stronger foundation for delving into more intricate elements of mathematical solutions and concepts.</p> <br> <b><u>Properties of Factorials:</u></b> <ol style="margin-top: 10px;"> <li>The factorial operation is confined to positive integers. Hence, the factorial of a negative number remains undefined.</li> <li>A unique exception to the aforementioned guideline is 0! which is defined as 1.</li> <li>The factorial of a number entails exponential growth, therefore, upon input increase, express growth in its factorial is observed.</li> </ol> <br> <p><u>Calculation of Factorials:</u></p> <p>Various approaches can be employed when calculating factorials, among them is recursion and iteration. Recursion is the practice of defining the factorial of a number in terms of the factorial of a lesser number. A frequently used iterative approach involves utilizing a loop structure to continually multiply the present integer by all numerically lesser integers down to 1.</p> </div> convert the following message: ${newMessage}`;
    const requestData = {
      prompt: content,
      max_tokens: 2604,
      temperature: 0,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 1,
      best_of: 1,
      stop: null,
    };
    try {
      const result = await axios.post(this.davinciModelUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          "api-key": this.davinciModelKey,
        },
      });
      const { data } = result;
      return data.choices[0].text ?? "Sorry, could not generate chat";
    } catch (error) {
      console.log("api error", error);
      return "Sorry, could not generate chat";
    }
  }
  async fetchMCQS(type: string = "chat",payload:any) {
    // console.log(payload, type," ===> text");
    
    try {
      let request = {
        messages: [
          {
            role: "system",
            content:
              (type == "chat" || type == "document")
                ? 
                // `give me 5 multiple choice questions related to following text in Json.stringify array format so I can manupulate it dynamically through javascript.
                
                // Here is the text: ${payload?.text ?? payload?.getSendableData}
                
                // send response in Json.stringify array format so I can manupulate it dynamically through javascript. and correct answer key should be 'answer', and options or choices key should be 'options' and question key should be 'question'.`

                `Write a MCQ of 5 questions for a the student based on the following passage,
                with 4 options. For clarity, provide the correct answer separately along with a one-sentence explanation.
                The questions should test the comprehension and analysis of the context and avoid factual errors or ambiguity.
                There should be a double line break after each option, and write "Question" before question number, and wirte questions text in bold text, and it is must.

                Here is the context: ${payload?.text}`
                : 
                // `give me 5 multiple choice questions related to ${payload?.subject} in Json.stringify array format so I can manupulate it dynamically through javascript. and correct answer key should be 'answer', and options or choices key should be 'options' and question key should be 'question'.`
                `Develop a set of 5 multiple-choice questions (MCQs) related to the subject of ${payload?.subject},
                  with a specific focus on the domain of ${payload?.domain}. Each question should have four options.
                  For clarity, provide the correct answer separately along with a one-sentence explanation.
                  The questions aim to assess students' comprehension
                  and analytical skills in the context presented in the passage related to ${payload?.subject} and ${payload?.domain}.
                  Ensure the questions avoid factual errors or ambiguity.
                  There should be a double line break after each option, and write "Question" before question number, and wirte questions text in bold text, and it is must.`,
          },
        ],
        temperature: 0.5, // Set your desired temperature value here
      };
      
      request["model"] = "gpt-35-turbo";

      let { data } = await axios.post(this.endpoint, request, {
        headers: {
          "Content-Type": "application/json",
          "api-key": `${this.token}`,
        },
      });
      if (data.choices && data?.choices[0]?.message) {
        const response = data?.choices[0]?.message.content;
        const cleanedResponse = response.replace(/Assistant: \./, "");
        // return cleanedResponse?.replace(/\n/g, '<br /><br />') ?? this.errorMessage;
        return cleanedResponse?.replace(/\n/g, ' \n\n ') ?? this.errorMessage;
        // return cleanedResponse ?? this.errorMessage;
        // return response ?? this.errorMessage;
      }
      return this.errorMessage;
    } catch (error) {
      // console.log('er', error);
      return this.errorMessage;
    }
  }
}

export default new OpenAIBot();
