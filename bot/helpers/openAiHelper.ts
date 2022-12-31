const { Configuration, OpenAIApi } = require("openai");

export const getOpenAiResponse = async (apiKey: string, prompt: string, model = 'text-davinci-003', temperature = 0.9, max_tokens = 2048) => {
  // call open ai API
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  return await openai.createCompletion({
    model,
    prompt,
    temperature,
    max_tokens,
  });
};
