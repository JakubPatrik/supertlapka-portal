import { trackEvent as fathomTrackEvent } from 'fathom-client';
import * as pixel from './fpixel';
import { captureEvent, captureException } from './services/posthog.service';

/**
 * High-level analytics utility that coordinates multiple tracking services.
 * This ensures that common events are tracked across all platforms (e.g., PostHog and Meta Pixel)
 * with a single call, while keeping the service-specific code decoupled.
 */

export const trackEvent = (name: string, options?: Record<string, unknown>) => {
  captureEvent(name, options); // PostHog
  fathomTrackEvent(name, options); // Fathom
  pixel.event(name, options);
};

export const trackCustomEvent = (name: string, options?: Record<string, unknown>) => {
  captureEvent(name, options); // PostHog
  fathomTrackEvent(name, options); // Fathom
};

export const trackException = (error: Error, properties?: Record<string, unknown>) => {
  captureException(error, properties); // PostHog
};
