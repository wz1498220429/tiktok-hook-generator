export class ApiError extends Error {
  status: number;
  code: string;
  retryAfterSeconds?: number;

  constructor(status: number, code: string, message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function extractUpstreamMessage(message: string): string {
  if (message.includes('User location is not supported')) {
    return 'The configured AI provider is blocked in this region. Switch providers or deploy in a supported region.';
  }

  if (message.includes('rate limit') || message.includes('Rate limit')) {
    return 'The AI provider is rate limiting requests right now. Please wait a moment and try again.';
  }

  if (message.includes('Invalid API key') || message.includes('API key')) {
    return 'The AI provider credentials are invalid or missing. Update the environment variables and try again.';
  }

  return 'The AI provider could not generate hooks right now. Please try again shortly.';
}

export function toApiError(error: unknown, fallbackMessage: string): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message === 'Topic is required' || error.message === 'Audience is required' || error.message === 'Invalid request payload') {
      return new ApiError(400, 'invalid_request', error.message);
    }

    if (
      error.message.startsWith('DeepSeek request failed:') ||
      error.message.startsWith('Gemini request failed:') ||
      error.message.includes('returned empty content') ||
      error.message.includes('Provider did not return valid JSON') ||
      error.message.includes('Not enough valid hooks returned')
    ) {
      return new ApiError(502, 'provider_error', extractUpstreamMessage(error.message));
    }
  }

  return new ApiError(500, 'internal_error', fallbackMessage);
}
