'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Step0 } from './step-0';
import { Step1 } from './step-1';
import { Step2 } from './step-2';
import { Step3 } from './step-3';
import { StepLoading } from './step-loading';

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

  if (stepParam === 'loading') {
    const action = searchParams.get('action') as 'pause' | 'cancel';
    return (
      <main className="flex flex-1 px-4">
        <StepLoading action={action} />
      </main>
    );
  }

  const step = Number(stepParam);
  const reason = searchParams.get('reason');
  const goToStep = (s: number, r?: number) => {
    const params = new URLSearchParams({ step: String(s) });
    const effectiveReason = r !== undefined ? r : reason;
    if (effectiveReason !== null && effectiveReason !== undefined) {
      params.set('reason', String(effectiveReason));
    }
    router.push(`/portal/cancel?${params.toString()}`);
  };

  return (
    <main className="mx-auto max-w-md flex-1 overflow-clip px-4">
      {step === 0 && <Step0 goToStep={goToStep} />}
      {step === 1 && <Step1 goToStep={goToStep} />}
      {step === 2 && <Step2 reason={reason !== null ? Number(reason) : undefined} />}
      {step === 3 && <Step3 />}
    </main>
  );
}
