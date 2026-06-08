import { NavHeader } from '@/components/shared/nav-header';
import { CancelContent } from '@/components/cancel/cancel-content';
import { Suspense } from 'react';

export default function CancelPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavHeader />
      <Suspense>
        <CancelContent />
      </Suspense>
    </div>
  );
}
