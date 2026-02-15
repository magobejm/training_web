import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the token from cookies or localStorage (in middleware we only have cookies)
    // Since we are using localStorage for this app (as per phase 4 requirements), 
    // middleware protection is limited. 
    // However, for a real app we should use cookies.
    // For now, we'll implement a basic check if we were using cookies, 
    // but rely mainly on client-side protection for localStorage auth.

    // NOTE: In this architecture (localStorage auth), middleware can't read the token easily.
    // We will keep this file to support future cookie-based auth migration.
    // For now, client-side protection in layout.tsx is the primary mechanism.

    return NextResponse.next();
}

export const config = {
    matcher: '/dashboard/:path*',
};
