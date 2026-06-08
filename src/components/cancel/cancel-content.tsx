'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Step0 } from './step-0';
import { Step1 } from './step-1';
import { Step2 } from './step-2';
import { Step3 } from './step-3';

export function CancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stepParam = searchParams.get('step');

  useEffect(() => {
    if (stepParam === null) {
      router.replace('/portal/cancel?step=0');
    }
  }, [stepParam, router]);

  if (stepParam === null) return null;

  const step = Number(stepParam);
  const goToStep = (s: number) => router.push(`/portal/cancel?step=${s}`);

  return (
    <main className="flex-1 px-4">
      {step === 0 && <Step0 goToStep={goToStep} />}
      {step === 1 && <Step1 goToStep={goToStep} />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
    </main>
  );
}
