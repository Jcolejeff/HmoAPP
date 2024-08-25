import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true, // remove this and make this call via an API only
});

/**
 * Queries an LLM with a prompt and returns the response.
 * @returns
 */
export const query = async ({ prompt }: { prompt: string }) => {
  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  return completion.choices[0].message.content;
};
