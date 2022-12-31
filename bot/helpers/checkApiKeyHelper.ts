import { TurnContext } from 'botbuilder';
import { getApiKey } from './dbHelper';

export const checkApiKey = async (context: TurnContext, fromId: string) => {
    const records = await getApiKey(fromId);
    if (records.length === 0) {
      await context.sendActivity({
        type: "message",
        textFormat: "markdown",
        text: "你還沒設定 API key，無法使用 OpenAI API，請先到 https://beta.openai.com/account/api-keys 建立 API key，然後使用 `setApiKey <API key>` 設定\n；**注意**，不要在別人看得到的頻道設定 API key",
      });
      return null;
    }
    return records[0].api_key;
}