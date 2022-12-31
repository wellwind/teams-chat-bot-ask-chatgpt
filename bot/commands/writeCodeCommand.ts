import { getOpenAiResponse } from './../helpers/openAiHelper';
import { setApiKey } from "./../helpers/dbHelper";
import { TurnContext } from "botbuilder";
import { ICommand } from "./ICommand";
import { checkApiKey } from "../helpers/checkApiKeyHelper";

export const writeCodeCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return message.startsWith("writeCode");
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    var instruction = message.replace("writeCode", "").trim();

    const apiKey = await checkApiKey(context, fromId);
    if(!apiKey) {
      return;
    }

    var response = await getOpenAiResponse(apiKey, instruction, { model: 'code-davinci-002' });

    for (let choice of response.data.choices) {
        var responseText = choice.text.trim();
        // send activity
        await context.sendActivity({
          type: "message",
          textFormat: "markdown",
          text: '```\n' + responseText + '\n```',
        });
      }
  },
};
