import { TurnContext } from "botbuilder";
import { checkCanGoChatGPT } from "../helpers/goChatGPTSetting";
import { ICommand } from "./ICommand";

export const canGoChatGPTCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return message.startsWith("/canGoChatGPT");
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    const canGoChatGPT = checkCanGoChatGPT(conversationId);
    
    await context.sendActivity({
      type: "message",
      textFormat: "plain",
      text: `${canGoChatGPT}`,
    });
  },
};
