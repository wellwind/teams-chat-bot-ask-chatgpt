import { TurnContext } from "botbuilder";
import { checkApiKey } from "../helpers/checkApiKeyHelper";
import { addChatHistory, getChatHistory } from "../helpers/dbHelper";
import { getOpenAiResponse } from "../helpers/openAiHelper";
import { ICommand } from "./ICommand";


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
    const apiKey = await checkApiKey(context, fromId);
    if(!apiKey) {
      return;
    }

    // get last history list
    const chatHistories = await getChatHistory(fromId, conversationId);

    // push human says
    chatHistories.push(`Human: ${message}`);
    // create prompt
    const prompt = ('以下是和 AI 助理的對話，AI 助理提供友善且詳盡的回答，使用 markdown 語法回覆，如果需要範例程式，會盡可能提供完整的程式碼。' + '\n\n' + chatHistories.join("\n") + "\nAI: ").slice(-1024);
    console.log(prompt);
    // request success
    var response = await getOpenAiResponse(apiKey, prompt);

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
