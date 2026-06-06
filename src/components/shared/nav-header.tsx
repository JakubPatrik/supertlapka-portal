import Image from 'next/image';

export function NavHeader() {
  return (
    <header className="relative shrink-0 border-b border-gray-200">
      <div className="flex min-h-14 items-center px-4 py-2">
        <div className="flex flex-1 items-center justify-center">
          <Image
            src="/images/logo-no-arrow.svg"
            alt="SuperTlapka"
            width={158}
            height={31}
            priority
          />
        </div>
      </div>
    </header>
  );
}
