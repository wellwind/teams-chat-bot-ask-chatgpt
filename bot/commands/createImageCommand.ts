import { getOpenAiImageResponse } from "./../helpers/openAiHelper";
import { getOpenAiCompletionResponse } from "../helpers/openAiHelper";
import { TurnContext } from "botbuilder";
import { ICommand } from "./ICommand";
import { checkApiKey } from "../helpers/checkApiKeyHelper";

export const createImageCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    return message.startsWith("/createImage ") || message.startsWith("/image ");
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    const command = message.replace("/createImage", "").replace("/image ", "").trim();
    const size = command.split(" ")[0];
    const instruction = command.split(" ").slice(1).join(" ");

    if (["256", "512", "1024"].indexOf(size) === -1) {
      await context.sendActivity({
        type: "message",
        textFormat: "plain",
        text: "請輸入正確的 size (256, 512, 1024)",
      });
      return;
    }

    if (!instruction) {
      await context.sendActivity({
        type: "message",
        textFormat: "plain",
        text: "請輸入正確的指令",
      });
      return;
    }

    const apiKey = await checkApiKey(context, fromId);
    if (!apiKey) {
      return;
    }

    var response = await getOpenAiImageResponse(apiKey, instruction, size);

    for (var i = 0; i < response.data.data.length; i++) {
      await context.sendActivity({
        type: "message",
        attachments: [
          {
            name: "image.png",
            contentType: "image/png",
            contentUrl: response.data.data[i].url,
          },
        ],
      });
    }
  },
};
