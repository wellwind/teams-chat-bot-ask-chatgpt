import { ChatCompletionRequestMessage } from "openai";

const { Configuration, OpenAIApi } = require("openai");
const { encode } = require('gpt-3-encoder')

export const getTokenLength = (str) => encode(str).length;

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

export const getChatCompletionResponse = async (apiKey: string, messages: ChatCompletionRequestMessage[], config?: any) => {
  const apiConfig = {
    ...{
      model: 'gpt-3.5-turbo'
    },
    ...config,
    messages: [
      ...messages
    ]
  };

  // call open ai API
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  return await openai.createChatCompletion(apiConfig);
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