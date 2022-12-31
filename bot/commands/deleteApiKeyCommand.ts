import { TurnContext } from "botbuilder";
import { deleteApiKey } from "../helpers/dbHelper";
import { ICommand } from "./ICommand";

export const deleteApiKeyCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return message === "deleteApiKey";
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    await deleteApiKey(fromId);
    await context.sendActivity({
      type: "message",
      textFormat: "plain",
      text: "已刪除 API key",
    });
  },
};
