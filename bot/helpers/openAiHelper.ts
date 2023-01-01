
const { Configuration, OpenAIApi } = require("openai");

export const getOpenAiCompletionResponse = async (apiKey: string, prompt: string, config?: any) => {
  const apiConfig = {
    ...{
      model: 'text-davinci-003',
      temperature: 0.9,
      max_tokens: 2048
    },
    ...config,
    prompt
  }
  // call open ai API
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  return await openai.createCompletion(apiConfig);
};

export const getOpenAiImageResponse = async (apiKey: string, prompt:string, size: string) => {
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  return await openai.createImage({
    prompt,
    n: 1,
    size: `${size}x${size}`
  });
}