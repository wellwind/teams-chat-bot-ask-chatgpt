import { TurnContext } from "botbuilder";
import { ICommand } from "./ICommand";

export const getConversationIdCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return message.startsWith("/getConversationId");
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    await context.sendActivity({
      type: "message",
      textFormat: "plain",
      text: conversationId,
    });
  },
};
