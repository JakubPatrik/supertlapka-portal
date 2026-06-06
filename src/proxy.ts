import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { APP_LOCALES, AppLocale } from './i18n/request';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const LOCALE_COOKIE_MAX_AGE = 34560000;

const PUBLIC_PATHS = ['/', '/verify'];

function isValidLocale(v: string | null | undefined): v is AppLocale {
  return APP_LOCALES.includes(v as AppLocale);
}

function detectLocaleFromHeader(acceptLanguage: string | null): AppLocale {
  if (!acceptLanguage) return 'cs';
  const primary = (acceptLanguage.split(',')[0] ?? '').trim().toLowerCase().slice(0, 2);
  return isValidLocale(primary) ? primary : 'cs';
}

export async function proxy(_request: NextRequest) {
  const currentUrl = _request.nextUrl;
  const pathname = currentUrl.pathname;

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!isPublic) {
    let supabaseResponse = NextResponse.next({ request: _request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => _request.cookies.getAll(),
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => _request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({ request: _request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/verify', _request.url));
    }

    return supabaseResponse;
  }

  const existingLocale = _request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const resolvedLocale: AppLocale = isValidLocale(existingLocale)
    ? existingLocale
    : detectLocaleFromHeader(_request.headers.get('accept-language'));
  const needsLocaleCookie = !isValidLocale(existingLocale);

  const setLocaleCookie = (response: NextResponse) => {
    if (needsLocaleCookie) {
      response.cookies.set(LOCALE_COOKIE_NAME, resolvedLocale, {
        maxAge: LOCALE_COOKIE_MAX_AGE,
        path: '/',
        sameSite: 'lax',
      });
    }
    return response;
  };

  const langParam = currentUrl.searchParams.get('lang');
  if (langParam !== null) {
    const locale: AppLocale = isValidLocale(langParam) ? langParam : 'cs';
    const redirectUrl = _request.nextUrl.clone();
    redirectUrl.searchParams.delete('lang');
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      maxAge: LOCALE_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  return setLocaleCookie(NextResponse.next());
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|icons|fonts|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)',
  ],
};
