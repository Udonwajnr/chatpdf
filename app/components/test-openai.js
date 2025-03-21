import OpenAI from 'openai';

const client = new OpenAI({
  apiKey:process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

export  const response = await client.responses.create({
  model: 'gpt-4o',
  instructions: 'You are a coding assistant that talks like a pirate',
  input: 'Are semicolons optional in JavaScript?',
});
