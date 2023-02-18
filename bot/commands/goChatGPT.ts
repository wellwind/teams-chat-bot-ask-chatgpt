import { addDuotifyAskChatGPTHistory } from './../helpers/dbHelper';
import { getGoChatGPTSetting } from "../helpers/goChatGPTSetting";
import { TurnContext } from "botbuilder";
import { checkCanGoChatGPT } from "../helpers/goChatGPTSetting";
import { ICommand } from "./ICommand";

const promptTemplate = `從現在起，以流暢的繁體中文進行對話。請你扮演 "[[CODE_LANG]]" 領域的專家，你能以流暢的繁體中文溝通，並且熟練使用 markdown 語法回覆。
請你 review 以下 "[[CODE_LANG]]" 程式碼，並針對程式碼的可讀性、效能、安全性或其他問題提供一些建議，如果有任何建議，請提供範例程式碼。

[[CODE]]`;

const promptTemplateForPM = `從現在起，以流暢的繁體中文進行對話。請你扮演 "專案管理、企劃文案和系統分析" 領域的專家，你能以流暢的繁體中文溝通，並且熟練使用 markdown 語法回覆。
請你針對以下 "專案管理、企劃文案和系統分析" 等問題，以流暢的繁體中文提供建議。

[[QUESTION]]`;

const promptTemplateForTranslateTC = `從現在開始，請只使用繁體中文進行溝通。請假設你是能夠熟練地使用繁體中文和 Markdown 的翻譯人員，將下面的英文翻譯成繁體中文。

[[CONTENT]]`;

const promptTemplateForTranslateEN = `Please ignore all previous instructions. From now on, communicate only in English. Act as a translator who can fluently speak and write in English and markdown. Translate the below-mentioned Traditional Chinese into English.

[[CONTENT]]`;

export const goChatGPTCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    const conversationId = context.activity.conversation.id;
    return checkCanGoChatGPT(conversationId);
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    const canGoChatGPT = checkCanGoChatGPT(conversationId);
    if (!canGoChatGPT) {
      await context.sendActivity({
        type: "message",
        textFormat: "plain",
        text: "此頻道不接受導向 ChatGPT",
      });
      return;
    }

    const goChatGPTSetting = getGoChatGPTSetting(conversationId);
    let prompt = "";
    if (goChatGPTSetting.conversationType === "Free Style") {
      // 自由發揮
      prompt = message;
    } else if (goChatGPTSetting.conversationType === "TranslateTC") {
      // 翻譯成中文
      prompt = promptTemplateForTranslateTC.replace(
        /\[\[CONTENT\]\]/g,
        message
      );
    } else if (goChatGPTSetting.conversationType === "TranslateEN") {
      // 翻譯成英文
      prompt = promptTemplateForTranslateEN.replace(
        /\[\[CONTENT\]\]/g,
        message
      );
    } else if (goChatGPTSetting.conversationType === "Project Management") {
      // PM 的問題
      prompt = promptTemplateForPM.replace(/\[\[QUESTION\]\]/g, message);
    } else {
      // 其他語言的 Code Review
      prompt = promptTemplate
        .replace(/\[\[CODE_LANG\]\]/g, goChatGPTSetting.conversationType)
        .replace(/\[\[CODE\]\]/g, message);
    }

    const url =
      "https://chat.openai.com/chat#autoSubmit=true&prompt=" +
      encodeURIComponent(prompt);

    await context.sendActivity({
      type: "message",
      textFormat: "markdown",
      text: `請 [點擊連結](${url})，稍後 ChatGPT 將為您解答。`,
    });

    addDuotifyAskChatGPTHistory(fromId, conversationId, message);
  },
};
