import Anthropic from '@anthropic-ai/sdk';
import { createHandler } from './_handler.js';
import { buildMessages } from './_prompt.js';

// Claude è opzionale: senza ANTHROPIC_API_KEY risponde solo il motore di regole.
const client = process.env.ANTHROPIC_API_KEY ? new Anthropic({ maxRetries: 0, timeout: 9000 }) : null;

async function askClaude(question, result) {
  const { system, messages } = buildMessages(question, result);
  const response = await client.beta.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 2000,
    output_config: { effort: 'low' },
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system,
    messages,
  });
  if (response.stop_reason === 'refusal' || response.stop_reason === 'max_tokens') return null;
  return response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}

export default createHandler({ askClaude: client ? askClaude : null });
