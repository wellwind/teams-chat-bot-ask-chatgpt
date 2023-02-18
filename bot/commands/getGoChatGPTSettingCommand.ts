import { TurnContext } from "botbuilder";
import { ICommand } from "./ICommand";

export const getGoChatGPTSettingCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return message.startsWith("/getGoChatGPTSetting");
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
${process.env.GO_CHATGPT_SETTING}
\`\`\`
      `,
    });
  },
};
