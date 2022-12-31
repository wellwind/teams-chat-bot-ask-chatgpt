import { TurnContext } from "botbuilder";
import { addChatHistory, getApiKey, getChatHistory } from "../helpers/dbHelper";
import { ICommand } from "./ICommand";
const { Configuration, OpenAIApi } = require("openai");

export const askAiCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return true;
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    const records = await getApiKey(fromId);
    if (records.length === 0) {
      await context.sendActivity({
        type: "message",
        textFormat: "markdown",
        text: "你還沒設定 API key，無法使用 OpenAI API，請先到 https://beta.openai.com/account/api-keys 建立 API key，然後使用 `setApiKey <API key>` 設定\n；**注意**，不要在別人看得到的頻道設定 API key",
      });
      return;
    }
    const apiKey = records[0].api_key;

    // get last history list
    const chatHistories = await getChatHistory(fromId, conversationId);

    // push human says
    chatHistories.push(`Human: ${message}`);
    // create prompt
    const prompt = (chatHistories.join("\n") + "\nAI: ").slice(-1024);

    // call open ai API
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 2048,
    });

    // request success

    // add human says to history
    await addChatHistory(fromId, conversationId, `Human: ${message}`);

    for (let choice of response.data.choices) {
      var responseText = choice.text.trim();
      // add ai says to history
      await addChatHistory(fromId, conversationId, `AI: ${responseText}`);
      // send activity
      await context.sendActivity({
        type: "message",
        textFormat: "markdown",
        text: responseText,
      });
    }
  },
};
