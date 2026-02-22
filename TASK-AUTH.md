# TASK: User Authentication — Auth.js v5 + Login Modal

## Goal
Add user authentication to the AWR website using Auth.js v5 (NextAuth). Users can register/login via email+password, Google, or Facebook. Login UI is a modal overlay (matching IDXBoost's pattern on Chad Carroll's site). Authenticated users can save favorite listings and saved searches (data storage is Phase 2 — this task sets up auth only).

## Dependencies to Install
```bash
npm install next-auth@latest @auth/prisma-adapter prisma @prisma/client bcryptjs zod
npm install -D @types/bcryptjs
```

## Phase 1 Scope (This Task)
- Auth.js v5 configuration
- Credentials (email/password) provider
- Google OAuth provider
- Login/Register modal component
- Session provider wrapping the app
- Protected API route pattern
- User icon in header triggers modal
- Database schema via Prisma + SQLite (upgrade to PostgreSQL later)

## Files to Create

### 1. `auth.ts` (project root)
```typescript
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/", // We use a modal, not a page
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user?.hashedPassword) return null

        const valid = await bcrypt.compare(parsed.data.password, user.hashedPassword)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
```

### 2. `src/app/api/auth/[...nextauth]/route.ts`
```typescript
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

### 3. `src/app/api/auth/register/route.ts`
Registration endpoint for email/password users.
```typescript
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        hashedPassword,
      },
    })

    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
```

### 4. `src/lib/prisma.ts`
```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

### 5. `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id             String    @id @default(cuid())
  name           String?
  email          String?   @unique
  emailVerified  DateTime?
  image          String?
  hashedPassword String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  accounts       Account[]
  sessions       Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### 6. `src/components/AuthModal.tsx` (NEW)
Two-column modal matching Chad Carroll's IDXBoost login pattern:

**Left column — "Why Create An Account?"**
- 🔔 Get new alerts — "We'll notify you when a listing matches your search criteria"
- ❤️ Save favorite listings — "Save listings for easy access when you return"
- 🔗 Share properties with friends — "Share your favorites with family via email"
- 📋 View property history — "Keep track of listings you've recently viewed"

**Right column — Login/Register form**
- **Login state:** email input, password input, "Continue with email" button (amber), "or" divider, Google button, Facebook button (blue), "Forgot password? Reset now", "Not registered yet? Register now" link
- **Register state:** first name, last name, email, password inputs, "Create Account" button (amber), "or" divider, Google/Facebook buttons, "Already have an account? Sign in" link
- Toggle between login and register states

**Modal behavior:**
- Opens from the user icon in the header (already exists as a circle icon)
- Dark overlay backdrop (`bg-black/60`)
- White modal card, centered, max-width ~800px
- × close button top right
- Closes on backdrop click or Escape key
- Uses `createPortal` to render at document body level

**Auth integration:**
- Email/password login: call `signIn("credentials", { email, password, redirect: false })`
- Email/password register: POST to `/api/auth/register`, then auto-login
- Google: call `signIn("google")`
- Facebook: call `signIn("facebook")` (add later, skip for now if no FB app)
- Show error messages inline on failure
- On success: close modal, refresh session

### 7. `src/components/AuthProvider.tsx` (NEW)
Wraps the app with NextAuth SessionProvider:
```typescript
"use client"
import { SessionProvider } from "next-auth/react"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### 8. `src/components/UserMenu.tsx` (NEW)
Replaces the current static user icon in the header:
- **Logged out:** User circle icon → click opens AuthModal
- **Logged in:** User avatar (or initials circle) → click opens dropdown with: "My Account", "Saved Listings", "Saved Searches", "Sign Out"

## Files to Modify

### `src/app/layout.tsx`
- Wrap `{children}` with `<AuthProvider>` component
- Import AuthProvider

### `src/components/Header.tsx` (or wherever the user icon is)
- Replace static user icon with `<UserMenu />` component

### `.env.local` (add these)
```
AUTH_SECRET=<generate with npx auth secret>
AUTH_GOOGLE_ID=<from Google Cloud Console>
AUTH_GOOGLE_SECRET=<from Google Cloud Console>
DATABASE_URL="file:./dev.db"
```

## After Codex Finishes — Manual Steps
1. Run `npx auth secret` to generate AUTH_SECRET
2. Run `npx prisma db push` to create the SQLite database
3. Set up Google OAuth credentials in Google Cloud Console (ato-awr-prod project)
   - Redirect URI: `http://localhost:3000/api/auth/callback/google` (dev)
   - Redirect URI: `https://iamandrewwhalen.com/api/auth/callback/google` (prod)
4. Add `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` to Vercel env vars
5. For production: migrate from SQLite to PostgreSQL (update `schema.prisma` provider + DATABASE_URL)

## DO NOT Touch — CRITICAL
- **`src/components/SearchFilters.tsx`**
- **`src/components/SearchPropertyCard.tsx`**
- **`src/components/PropertyMap.tsx`**
- **`src/components/MapDrawControl.tsx`**
- **`src/data/mockListings.ts`**
- **`src/app/search/page.tsx`** (search page layout)

## Design
- Modal background: white
- Primary button: amber (`#d97706`) — "Continue with email" / "Create Account"
- Google button: white with Google "G" logo + "Login with Google"
- Facebook button: Facebook blue (`#1877F2`) with "f" logo + "Login with Facebook"
- Text: neutral-800 headings, neutral-600 body
- Input fields: white bg, neutral-200 border, rounded-md
- × close: neutral-400, top-right corner
- "or" divider: horizontal line with centered "or" text

## Test
- `npm run build` must pass with zero errors
- `npx prisma db push` creates database without errors
- Clicking user icon opens the auth modal
- Can register with email/password
- Can login with email/password
- Can login with Google (if credentials configured)
- After login, user icon shows avatar/initials
- Sign out works and returns to anonymous state
- Modal closes on × click, backdrop click, and Escape key
