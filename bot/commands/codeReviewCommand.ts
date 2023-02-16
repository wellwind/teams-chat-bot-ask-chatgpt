import { getCodeReviewSetting } from "./../helpers/getCodeReviewSetting";
import { TurnContext } from "botbuilder";
import { checkCanCodeReview } from "../helpers/getCodeReviewSetting";
import { ICommand } from "./ICommand";

const promptTemplate = `Please ignore all previous instructions. From now on, communicate only in Traditional Chinese. Act as an expert in "[[CODE_LANG]]" who can fluently speak and write in Traditional Chinese and markdown. Review the below-mentioned "[[CODE_LANG]]" code and provide some suggestions in Traditional Chinese language with regards to better readability, performance, and security, or any other recommends. If there are any recommendation, kindly provide the sample code.

[[CODE]]`;

const promptTemplateForPM = `Please ignore all previous instructions. From now on, communicate only in Traditional Chinese. Act as a Project Management expert who can fluently speak and write in Traditional Chinese and markdown. Answer below-mentioned Project Management question in Traditional Chinese:

[[QUESTION]]`;

const promptTemplateForTranslateTC = `Please ignore all previous instructions. From now on, communicate only in Traditional Chinese. Act as a translator who can fluently speak and write in Traditional Chinese and markdown. Translate the below-mentioned English into Traditional Chinese.

[[CONTENT]]`;

const promptTemplateForTranslateEN = `Please ignore all previous instructions. From now on, communicate only in English. Act as a translator who can fluently speak and write in English and markdown. Translate the below-mentioned Traditional Chinese into English.

[[CONTENT]]`;

const promptTemplateFreeStyle = "[[CONTENT]]";

export const codeReviewCommand: ICommand = {
  checkCommand: (message: string, context: TurnContext) => {
    const conversationId = context.activity.conversation.id;
    return checkCanCodeReview(conversationId);
  },
  processCommand: async (
    context: TurnContext,
    message: string,
    fromId: string,
    conversationId: string
  ) => {
    const canCodeReview = checkCanCodeReview(conversationId);
    if (!canCodeReview) {
      await context.sendActivity({
        type: "message",
        textFormat: "plain",
        text: "此頻道不接受 Code Review",
      });
      return;
    }

    const codeReviewSetting = getCodeReviewSetting(conversationId);
    let prompt = "";
    if (codeReviewSetting.language === "Free Style") {
      // 自由發揮
      prompt = message;
    } else if (codeReviewSetting.language === "TranslateTC") {
      // 翻譯成中文
      prompt = promptTemplateForTranslateTC.replace(
        /\[\[CONTENT\]\]/g,
        message
      );
    } else if (codeReviewSetting.language === "TranslateEN") {
      // 翻譯成英文
      prompt = promptTemplateForTranslateEN.replace(
        /\[\[CONTENT\]\]/g,
        message
      );
    } else if (codeReviewSetting.language === "Project Management") {
      // PM 的問題
      prompt = promptTemplateForPM.replace(/\[\[QUESTION\]\]/g, message);
    } else {
      // 其他語言的 Code Review
      prompt = promptTemplate
        .replace(/\[\[CODE_LANG\]\]/g, codeReviewSetting.language)
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
  },
};
