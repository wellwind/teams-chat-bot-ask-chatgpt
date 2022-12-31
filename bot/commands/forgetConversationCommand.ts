import { TurnContext } from "botbuilder";
import { clearChatHistory } from "../helpers/dbHelper";
import { ICommand } from "./ICommand";

export const forgetConversationCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return message === "forgetConversation";
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    await clearChatHistory(fromId, conversationId);
    await context.sendActivity({
      type: "message",
      textFormat: "plain",
      text: "已忘記過去的對話記錄",
    });
  },
};
