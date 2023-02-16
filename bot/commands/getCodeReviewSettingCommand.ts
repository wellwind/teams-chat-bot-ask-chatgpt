import { TurnContext } from "botbuilder";
import { ICommand } from "./ICommand";

export const getCodeReviewSettingCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return message.startsWith("/getCodeReviewSetting");
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    await context.sendActivity({
      type: "message",
      textFormat: "markdown",
      text: `
\`\`\`json
${process.env.CODE_REVIEW_SETTING}
\`\`\`
      `,
    });
  },
};
