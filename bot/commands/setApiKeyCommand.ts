import { setApiKey } from "./../helpers/dbHelper";
import { TurnContext } from "botbuilder";
import { ICommand } from "./ICommand";

export const setApiKeyCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return message.startsWith("/setApiKey");
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    const apiKey = message.replace("/setApiKey", "").trim();
    setApiKey(fromId, apiKey);
    await context.sendActivity({
      type: "message",
      textFormat: "plain",
      text: "已設定 API key",
    });
  },
};
