import { TurnContext } from "botbuilder";
import { ICommand } from "./ICommand";

export const helpCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return message.trim() === "/?" || message.trim() === "/help";
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    let helpText = `* \`/setApiKey <API_KEY>\`: 設定 API key；**注意**，不要在別人看得到的頻道設定 API key
      \n* \`/deleteApiKey\`: 刪除 API key
      \n* \`/forgetConversation\`: 忘記過去的對話記錄
      \n* \`/writeCode <指令>\`: 輸入指令，叫 AI 寫程式
      \n* \`/createImage <256|512|1024> <指令>\`: 依照指令產生指定大小的圖片 (alias: \`/image\`)`;
    if (context.activity.channelId === "line") {
      helpText += `\n* \`/askChatGPT <問題>\`: 輸入問題，叫 AI 回答`;
    } else {
      helpText += `\n* 直接輸入文字，就可以跟 AI 對話了`;
    }

    await context.sendActivity({
      type: "message",
      textFormat: "markdown",
      text: helpText,
    });
  },
};
