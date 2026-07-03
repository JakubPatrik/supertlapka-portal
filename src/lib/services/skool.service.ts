/**
 * skool.com Configuration
 *
 * Invites new members to skool.com community.
 */
export const skoolConfig = {
  webhookUrl: 'https://api2.skool.com/groups/supertlapka/webhooks/1eefea4229fb4bf2b13f26552d889866',
  unlockUpsellUrl: 'https://hooks.zapier.com/hooks/catch/27323385/ujpbap9/silent',
} as const;

export async function unlockSkoolUpsell(email: string): Promise<void> {
  try {
    const response = await fetch(skoolConfig.unlockUpsellUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`Failed to unlock skool upsell: ${response.statusText}`);
    }

    console.log(`✅ Unlocked skool upsell for ${email}`);
  } catch (error: unknown) {
    console.error(`❌ Failed to unlock skool upsell for ${email}:`, (error as Error).message);
  }
}
