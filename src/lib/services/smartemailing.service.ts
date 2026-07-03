import { fetchRetry } from '../retry';

/**
 * SmartEmailing.cz API Service
 *
 * Fire-and-forget wrapper around the SmartEmailing REST API (v3).
 * Every exported function catches errors internally and never throws,
 * making it safe to call from hot paths without risking unhandled rejections.
 */
const smartEmailingConfig = {
  baseUrl: 'https://app.smartemailing.cz/api/v3',
  username: process.env.SMARTEMAILING_USERNAME || '',
  apiKey: process.env.SMARTEMAILING_API_KEY || '',

  maxRetries: 3,
  retryDelayMs: 1000,

  contactLists: {
    ALL_CONTACTS: 5,
    REGULAR: 8,
    PREMIUM: 11,
    ABANDONED: 14,
  },
} as const;

const { baseUrl, username, apiKey, contactLists, maxRetries, retryDelayMs } = smartEmailingConfig;

const authHeader =
  username && apiKey ? 'Basic ' + Buffer.from(username + ':' + apiKey).toString('base64') : '';

function isConfigured(): boolean {
  if (!username || !apiKey) {
    console.warn(
      '[SmartEmailing] Service is not configured (missing username or apiKey). Skipping API call.',
    );
    return false;
  }
  return true;
}

interface ContactListEntry {
  id: number;
  status: 'confirmed' | 'removed';
}

interface ImportContactParams {
  email: string;
  contactListEntries: ContactListEntry[];
}

/**
 * Import (create or update) a single contact into SmartEmailing with the
 * given list memberships.
 *
 * This is the low-level building block used by all convenience helpers.
 * It never throws -- all errors are caught and logged.
 * Retries up to IMPORT_MAX_RETRIES times on network errors or 5xx responses.
 */
async function importContact(params: ImportContactParams): Promise<void> {
  if (!isConfigured()) return;

  const { email, contactListEntries } = params;

  const body = {
    settings: {
      update: true,
      preserve_unsubscribed: true,
    },
    data: [
      {
        emailaddress: email,
        contactlists: contactListEntries,
      },
    ],
  };

  try {
    const response = await fetchRetry(
      `${baseUrl}/import`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      },
      {
        retries: maxRetries,
        retryDelayMs,
        onRetry: (attempt, error) => {
          if (error) {
            console.warn(
              `[SmartEmailing] Import request error for ${email} - retrying (${attempt}/${maxRetries}):`,
              error,
            );
          } else {
            console.warn(
              `[SmartEmailing] Import failed for ${email} - retrying (${attempt}/${maxRetries})`,
            );
          }
        },
      },
    );

    if (!response.ok) {
      const text = await response.text().catch(() => '<unreadable body>');
      console.error(
        `[SmartEmailing] Import failed for ${email}: HTTP ${response.status} - ${text}`,
      );
    } else {
      console.info(`[SmartEmailing] Import succeeded for ${email}: ${JSON.stringify(body)}`);
    }
  } catch (error) {
    console.error(`[SmartEmailing] Import request error for ${email}:`, error);
  }
}

/**
 * Promote a contact to the PREMIUM list and simultaneously remove them
 * from the REGULAR list.
 */
export async function promoteToPremium(email: string): Promise<void> {
  await importContact({
    email,
    contactListEntries: [
      { id: contactLists.PREMIUM, status: 'confirmed' },
      { id: contactLists.REGULAR, status: 'removed' },
    ],
  });
}
