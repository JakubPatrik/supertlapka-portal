import posthog from 'posthog-js';

export const identifyUser = (email: string) => {
  if (process.env.NODE_ENV === 'development') return;

  posthog.identify(email);
};

export const captureEvent = (event: string, properties?: Record<string, unknown>) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Capture: ${event}`, properties);
    return;
  }

  posthog.capture(event, properties);
};

export const captureException = (error: Error, properties?: Record<string, unknown>) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Analytics] Exception: ${error.message}`, { error, ...properties });
    return;
  }

  posthog.captureException(error, { properties });
};
