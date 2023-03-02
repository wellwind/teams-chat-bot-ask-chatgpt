import { TurnContext } from "botbuilder";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { checkApiKey } from "../helpers/checkApiKeyHelper";
import { addChatHistory, getChatHistory } from "../helpers/dbHelper";
import { getChatCompletionResponse } from "../helpers/openAiHelper";
import { ICommand } from "./ICommand";

export const askAiCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    if (context.activity.channelId === "line") {
      return message.startsWith("/askChatGPT ");
    }
    return true;
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    let askQuestion = "";
    if (context.activity.channelId === "line") {
      askQuestion = message.replace("/askChatGPT ", "").trim();
    } else {
      askQuestion = message;
    }

    const apiKey = await checkApiKey(context, fromId);
    if (!apiKey) {
      return;
    }

    // get last history list
    const basicInstruction = {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content:
        "請你扮演一個專業且知識淵博的 AI 助理，提供友善且詳盡的回答，懂得使用 markdown 語法，並且一律使用流暢的繁體中文回覆，如果需要範例程式，會盡可能提供完整的程式碼。",
    };
    const chatHistories = (await getChatHistory(fromId, conversationId)).map(text => ({
      role: text.startsWith('AI:') ? ChatCompletionRequestMessageRoleEnum.Assistant : ChatCompletionRequestMessageRoleEnum.User,
      content: text.startsWith('AI:') ? text.replace('AI:', '').trim() : text.replace('Human:', '').trim()
    }));

    const messages = [
      basicInstruction,
      ...chatHistories,
      { role: ChatCompletionRequestMessageRoleEnum.User, content: askQuestion },
    ];

    // request success
    const response = await getChatCompletionResponse(apiKey, messages);

    // add human says to history
    await addChatHistory(fromId, conversationId, `Human:${askQuestion}`);

    for (let choice of response.data.choices) {
      const responseText = choice.message.content.trim();
      // add ai says to history
      await addChatHistory(fromId, conversationId, `AI:${responseText}`);

      // send activity
      await context.sendActivity({
        type: "message",
        textFormat: "markdown",
        text: responseText,
      });
    }

    await context.sendActivity({
      type: "message",
      textFormat: "markdown",
      text: `對話已使用 ${response.data.usage.total_tokens} tokens (送出：${response.data.usage.prompt_tokens};回答：${response.data.usage.completion_tokens})
      
注意：超過 4096 tokens 將無法繼續對話，需要使用 /forgetConversation 忘記過去對話`,
    });
  },
};
