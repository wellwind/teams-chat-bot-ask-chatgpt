export interface ChatGPTSetting {
  conversationId: string;
  conversationType: string;
}

export const getGoChatGPTSetting = (
  conversationId: string
): ChatGPTSetting => {
  const setting = JSON.parse(process.env.GO_CHATGPT_SETTING) as ChatGPTSetting[];
  return setting.find((setting) =>
    conversationId.startsWith(setting.conversationId)
  );
};

export const checkCanGoChatGPT = (conversationId: string) => {
  return !!getGoChatGPTSetting(conversationId);
};
