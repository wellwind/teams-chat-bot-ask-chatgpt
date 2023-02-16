export interface CodeReviewSetting {
  conversationId: string;
  language: string;
}
export const getCodeReviewSetting = (
  conversationId: string
): CodeReviewSetting => {
  const setting = JSON.parse(process.env.CODE_REVIEW_SETTING) as CodeReviewSetting[];
  return setting.find((setting) =>
    conversationId.startsWith(setting.conversationId)
  );
};

export const checkCanCodeReview = (conversationId: string) => {
  return !!getCodeReviewSetting(conversationId);
};
