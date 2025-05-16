/**
 * Utility for retrying operations that may fail temporarily
 */

interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Initial delay between retries in milliseconds */
  initialDelay: number;
  /** Factor by which to increase delay on each retry */
  backoffFactor: number;
  /** Function to determine if an error is retryable */
  isRetryable?: (error: Error) => boolean;
  /** Optional callback for each retry attempt */
  onRetry?: (attempt: number, error: Error, nextDelayMs: number) => void;
}

const defaultRetryOptions: RetryOptions = {
  maxRetries: 3,
  initialDelay: 1000,
  backoffFactor: 1.5,
  isRetryable: () => true,
};

/**
 * Executes an asynchronous operation with automatic retries
 * 
 * @param operation - The async operation to execute and potentially retry
 * @param options - Configuration options for retry behavior
 * @returns - The result of the operation if successful
 * @throws - The last error encountered if all retries fail
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const config = { ...defaultRetryOptions, ...options };
  let lastError: Error | null = null;
  let delay = config.initialDelay;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      // First attempt or one of the retries
      return await operation();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      lastError = err;
      
      // Check if we've hit the max retries or if this error isn't retryable
      if (
        attempt >= config.maxRetries || 
        (config.isRetryable && !config.isRetryable(err))
      ) {
        break;
      }
      
      // Calculate next delay with exponential backoff
      const nextDelay = delay * (attempt > 0 ? config.backoffFactor : 1);
      
      // Call the onRetry callback if provided
      if (config.onRetry) {
        config.onRetry(attempt + 1, err, nextDelay);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, nextDelay));
      delay = nextDelay;
    }
  }

  // If we get here, all attempts failed
  if (lastError) {
    throw lastError;
  }
  
  // This should never happen if operation always either resolves or rejects
  throw new Error('Operation failed for unknown reasons');
}

/**
 * A specialized version of withRetry for Twitter API rate limiting
 * 
 * @param operation - The async operation to execute and potentially retry
 * @returns - The result of the operation if successful
 */
export async function withRateLimitRetry<T>(
  operation: () => Promise<T>
): Promise<T> {
  return withRetry(operation, {
    maxRetries: 3,
    initialDelay: 5000,
    backoffFactor: 2,
    isRetryable: (error) => {
      // Check if this is a rate limiting error (HTTP 429)
      return (
        error.message.includes('429') || 
        error.message.includes('rate limit') ||
        error.message.toLowerCase().includes('too many requests')
      );
    },
    onRetry: (attempt, error, delay) => {
      console.warn(`Rate limit hit, retrying in ${delay}ms (attempt ${attempt})`);
    },
  });
}
