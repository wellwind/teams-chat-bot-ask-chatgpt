import { getOpenAiCompletionResponse } from './../helpers/openAiHelper';
import { TurnContext } from "botbuilder";
import { ICommand } from "./ICommand";
import { checkApiKey } from "../helpers/checkApiKeyHelper";

export const writeCodeCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return message.startsWith("/writeCode ");
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    const instruction = message.replace("/writeCode ", "").trim();

    const apiKey = await checkApiKey(context, fromId);
    if(!apiKey) {
      return;
    }

    const response = await getOpenAiCompletionResponse(apiKey, instruction, { model: 'code-davinci-002' });

    for (let choice of response.data.choices) {
        const responseText = choice.text.trim();
        // send activity
        await context.sendActivity({
          type: "message",
          textFormat: "markdown",
          text: '```\n' + responseText + '\n```',
        });
      }
  },
};
