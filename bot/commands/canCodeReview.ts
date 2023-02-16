import { TurnContext } from "botbuilder";
import { checkCanCodeReview } from "../helpers/getCodeReviewSetting";
import { ICommand } from "./ICommand";

export const canCodeReviewCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return message.startsWith("/canCodeReview");
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    const canCodeReview = checkCanCodeReview(conversationId);
    
    await context.sendActivity({
      type: "message",
      textFormat: "plain",
      text: `${canCodeReview}`,
    });
  },
};
