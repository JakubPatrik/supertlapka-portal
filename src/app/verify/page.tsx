import { OtpForm } from '@/components/form/otp-form';
import { redirect } from 'next/navigation';

type VerifyPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { email } = await searchParams;
  if (!email) redirect('/');

  return (
    <main className="bg-background flex flex-1 items-center justify-center px-4 pt-24 sm:pt-[10%]">
      <OtpForm email={decodeURIComponent(email)} />
    </main>
  );
}
