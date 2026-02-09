# Build Barguna Co-operative - AI Agent Guidelines

> **Project Context**: Build Barguna is a modern, bilingual (English ↔ Bengali) co-operative platform built with Next.js 16, React 19, Prisma 6, and NextAuth v5. It manages member onboarding, training courses, venture proposals, brands, and community stories.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack & Architecture](#tech-stack--architecture)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Next.js 16 Best Practices](#nextjs-16-best-practices)
6. [Prisma 6 Database Patterns](#prisma-6-database-patterns)
7. [Authentication & Authorization](#authentication--authorization)
8. [Internationalization (i18n)](#internationalization-i18n)
9. [Server Actions & Forms](#server-actions--forms)
10. [Error Handling & Validation](#error-handling--validation)
11. [Security Guidelines](#security-guidelines)
12. [Coding Standards](#coding-standards)
13. [Common Workflows](#common-workflows)
14. [Environment Configuration](#environment-configuration)

---

## Project Overview

### Mission
Build transparent foundations for co-operative-based fair economy through community participation and pilot-first approach.

**Tagline**: Together Capital, Together Development

### Core Features

1. **Member Management**: KYC with nominee information, approval workflow
2. **Training Programs**: Course catalog with scholarship options, application system
3. **Venture Proposals**: Members can propose business ideas with lean canvas uploads
4. **Brand Showcase**: Co-operative brands with galleries and bilingual content
5. **Success Stories**: Community impact stories (published/draft system)
6. **Contact & Partner Inquiry**: Multi-purpose contact forms
7. **Admin Dashboard**: Full CRUD operations, approval workflows, KPI tracking

---

## Tech Stack & Architecture

### Core Technologies
- **Framework**: Next.js 16.1.5 (App Router, Server Components, Server Actions)
- **Language**: TypeScript 5.9 (strict mode enabled)
- **UI**: React 19 + Tailwind CSS 4 + shadcn/ui + Radix Primitives
- **ORM**: Prisma 6.19.x (PostgreSQL)
- **Auth**: NextAuth.js v5 (credentials provider with JWT)
- **i18n**: next-intl 4.x
- **Validation**: Zod 4.x
- **Storage**: Vercel Blob (for file uploads)
- **Email**: Resend API
- **Deployment**: Vercel

### Architecture Principles
- **Server-First**: Prefer Server Components; use Client Components sparingly
- **Progressive Enhancement**: Forms work without JavaScript via Server Actions
- **Type Safety**: End-to-end type safety from database to UI
- **Bilingual by Default**: All user-facing content in EN + BN
- **Role-Based Access**: ADMIN, EDITOR, MEMBER roles with proper authorization

---

## Project Structure

```
build-barguna-website/
├── prisma/
│   ├── schema.prisma          # Database schema (14 models)
│   ├── migrations/            # Auto-generated migration files
│   └── seed.ts                # Seed data script
├── public/                    # Static assets (SVGs, images)
├── src/
│   ├── app/
│   │   ├── [locale]/          # Localized routes (en, bn)
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── about/         # About page
│   │   │   ├── admin/         # Admin dashboard (protected)
│   │   │   ├── auth/          # Auth pages (signin, error)
│   │   │   ├── brands/        # Brand catalog + detail pages
│   │   │   ├── contact/       # Contact form
│   │   │   ├── join-member/   # KYC membership form
│   │   │   ├── programs/      # Training + ventures
│   │   │   ├── stories/       # Success stories
│   │   │   └── ...
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin CRUD endpoints
│   │   │   └── auth/[...nextauth]/  # NextAuth handler
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── admin/             # Admin-specific components
│   │   ├── auth/              # Auth forms
│   │   ├── forms/             # Public forms (member, contact, venture)
│   │   ├── layout/            # Navbar, Footer
│   │   ├── providers/         # Context providers (SessionProvider)
│   │   └── ui/                # shadcn/ui primitives
│   ├── lib/
│   │   ├── actions/           # Server Actions (6 action files)
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── schemas.ts         # Zod validation schemas
│   │   └── utils.ts           # Utility functions (cn, etc.)
│   ├── i18n/
│   │   └── request.ts         # next-intl config
│   ├── messages/
│   │   ├── en.json            # English translations
│   │   └── bn.json            # Bengali translations
│   ├── auth.ts                # NextAuth configuration
│   ├── i18n.ts                # Locale definitions
│   └── middleware.ts          # next-intl middleware
├── .env.example               # Environment template
├── AGENTS.md                  # This file
├── README.md                  # Setup instructions
├── context7.json              # Context7 AI parsing config
└── package.json               # Dependencies & scripts
```

### Module Organization Rules

1. **App Router Routes**: Group by feature, not by technical layer
   - ✅ `app/[locale]/admin/members/page.tsx`
   - ❌ `app/[locale]/pages/admin-members.tsx`

2. **Components**: Co-locate hooks and types with components
   ```tsx
   components/
   ├── forms/
   │   ├── JoinMemberForm.tsx
   │   └── JoinMemberForm.types.ts  // If complex
   ```

3. **Server Actions**: One file per domain
   - `lib/actions/member.actions.ts` (join, approve, reject)
   - `lib/actions/venture.actions.ts` (propose, update status)
   - `lib/actions/admin.actions.ts` (dashboard stats, bulk ops)

4. **Schemas**: Centralized in `lib/schemas.ts` for consistency

---

## Development Workflow

### Daily Development Commands

```bash
# Start development server
npm run dev                    # http://localhost:3000

# Database operations
npx prisma studio              # Visual database browser
npx prisma migrate dev         # Create & apply migration
npx prisma generate            # Regenerate Prisma Client
npm run prisma:seed            # Populate with seed data

# Code quality
npm run lint                   # ESLint check
npm run build                  # Production build test
npm run start                  # Test production build
```

### Pre-commit Checklist
1. ✅ Run `npm run lint` (zero errors)
2. ✅ Run `npm run build` (successful build)
3. ✅ Test affected routes in both EN and BN locales
4. ✅ Verify database migrations are in sync (`npx prisma migrate status`)
5. ✅ Update both `en.json` and `bn.json` if adding i18n keys
6. ✅ Update `.env.example` if adding new environment variables

### Migration Workflow (Team Collaboration)

```bash
# 1. Pull latest changes
git pull origin main

# 2. Regenerate Prisma Client
npx prisma generate

# 3. Apply pending migrations
npx prisma migrate dev

# 4. Make schema changes in schema.prisma
# (Edit models, add fields, etc.)

# 5. Create migration with descriptive name
npx prisma migrate dev --name add_user_avatar_field

# 6. Commit both schema.prisma AND migration files
git add prisma/
git commit -m "feat(db): add user avatar field"
```

**⚠️ Never manually edit migration SQL files!**

---

## Next.js 16 Best Practices

### Server Components vs Client Components

**Default to Server Components** (no `"use client"` directive):
- Fetch data directly in components
- Access environment variables
- Keep sensitive logic server-side
- Reduce JavaScript bundle size

**Use Client Components when you need**:
- React hooks (`useState`, `useEffect`, `useRouter`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `localStorage`)
- Third-party libraries requiring client-side (e.g., framer-motion)

```tsx
// ✅ GOOD: Server Component (default)
// src/app/[locale]/brands/page.tsx
import { prisma } from '@/lib/prisma';

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany();
  return <BrandList brands={brands} />;
}

// ✅ GOOD: Client Component (when needed)
// src/components/admin/BrandForm.tsx
"use client";
import { useState } from 'react';

export function BrandForm() {
  const [isOpen, setIsOpen] = useState(false);
  // ... form logic
}
```

### Server Actions Pattern

**Always use for mutations**:
```tsx
// src/lib/actions/member.actions.ts
"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function joinMemberAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validate with Zod
  const validated = schema.safeParse(data);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    // 2. Perform mutation
    await prisma.user.create({ data: validated.data });
    
    // 3. Revalidate affected paths
    revalidatePath('/admin/members');
    
    return { success: true, message: 'Member created!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to create member.' };
  }
}
```

### Data Fetching Patterns

```tsx
// ✅ Parallel Fetching (fast)
async function DashboardPage() {
  const [members, courses, ventures] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.venture.count(),
  ]);
  // ...
}

// ❌ Sequential Fetching (slow)
async function SlowDashboard() {
  const members = await prisma.user.count();
  const courses = await prisma.course.count();  // Waits for members
  const ventures = await prisma.venture.count(); // Waits for courses
}
```

### Caching & Revalidation

```tsx
// Opt out of caching for dynamic data
export const dynamic = 'force-dynamic';

// Revalidate after time period
export const revalidate = 3600; // 1 hour

// Revalidate specific paths in Server Actions
import { revalidatePath, revalidateTag } from 'next/cache';

revalidatePath('/admin');           // Revalidate all /admin routes
revalidatePath('/admin', 'layout'); // Revalidate layout only
```

---

## Prisma 6 Database Patterns

### Schema Design Principles

1. **Use meaningful, domain-driven names**
   ```prisma
   model MemberProfile {  // ✅ Clear and specific
     // Not: Profile, UserData
   }
   ```

2. **Leverage Prisma decorators**
   ```prisma
   model User {
     id        String   @id @default(cuid())
     email     String   @unique
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     memberProfile MemberProfile?
     @@index([email])  // Performance optimization
   }
   ```

3. **Implement soft delete with timestamps**
   ```prisma
   model Story {
     id          String    @id @default(cuid())
     publishedAt DateTime?  // Null = draft
     deletedAt   DateTime?  // Soft delete
   }
   ```

4. **Use enums for fixed sets**
   ```prisma
   enum UserRole {
     ADMIN
     EDITOR
     MEMBER
   }
   ```

### Relation Patterns

```prisma
// One-to-One (User ↔ MemberProfile)
model User {
  id            String         @id @default(cuid())
  memberProfile MemberProfile?
}

model MemberProfile {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// One-to-Many (User → Ventures)
model User {
  ventures Venture[]
}

model Venture {
  proposerId String
  proposer   User   @relation(fields: [proposerId], references: [id])
}

// Many-to-Many (with join table)
model CourseApplication {
  id       String @id @default(cuid())
  userId   String
  courseId String
  user     User   @relation(fields: [userId], references: [id])
  course   Course @relation(fields: [courseId], references: [id])
  
  @@unique([userId, courseId])  // Prevent duplicate applications
}
```

### Query Optimization

```tsx
// ✅ Select only needed fields
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true }
});

// ✅ Use include for relations
const user = await prisma.user.findUnique({
  where: { id },
  include: { memberProfile: true, ventures: true }
});

// ✅ Pagination
const users = await prisma.user.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { createdAt: 'desc' }
});

// ❌ Avoid N+1 queries
// Bad: Fetching relations in loop
for (const user of users) {
  const profile = await prisma.memberProfile.findUnique({
    where: { userId: user.id }
  });
}
```

### Transaction Patterns

```tsx
// Use transactions for related operations
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.memberProfile.create({ 
    data: { ...profileData, userId: user.id } 
  });
  await tx.auditLog.create({
    data: { action: 'USER_CREATED', targetId: user.id }
  });
});
```

### Connection Pooling

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add connection limit for serverless
  // ?connection_limit=5
}
```

```typescript
// lib/prisma.ts - Singleton pattern (avoid multiple instances)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## Authentication & Authorization

### NextAuth v5 Configuration

**Current Setup** (`src/auth.ts`):
- **Provider**: Credentials (email + password with bcrypt)
- **Strategy**: JWT (no database sessions)
- **Session**: 30-day expiry
- **Roles**: ADMIN, EDITOR, MEMBER (from `UserRole` enum)

### Role-Based Access Control

```tsx
// 1. Server-side protection in Server Actions
"use server";
import { auth } from '@/auth';

export async function adminOnlyAction() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  
  // Proceed with admin logic
}

// 2. Page-level protection
// src/app/[locale]/admin/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await auth();
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }
  
  return <AdminDashboard />;
}

// 3. Client-side UI hiding (NOT security, just UX)
"use client";
import { useSession } from 'next-auth/react';

export function Navbar() {
  const { data: session } = useSession();
  
  return (
    <nav>
      {session?.user.role === 'ADMIN' && (
        <Link href="/admin">Admin Panel</Link>
      )}
    </nav>
  );
}
```

### Security Best Practices

1. **Never trust client-side checks** - Always validate on server
2. **Hash passwords with bcrypt** (already implemented in seed.ts)
3. **Use HTTPS in production** (Vercel default)
4. **Set secure session cookies**:
   ```ts
   // src/auth.ts
   session: { 
     strategy: "jwt",
     maxAge: 30 * 24 * 60 * 60, // 30 days
   }
   ```
5. **Validate all inputs** with Zod before database operations

---

## Internationalization (i18n)

### next-intl 4.x Setup

**Supported Locales**: `en` (English), `bn` (Bengali)  
**Default Locale**: `en`  
**Routing**: Prefix-based (`/en/about`, `/bn/about`)

### Message Management

```json
// src/messages/en.json
{
  "HomePage": {
    "title": "Build Barguna Co-operative",
    "subtitle": "Together Capital, Together Development"
  },
  "MemberForm": {
    "nameLabel": "Full Name",
    "submitButton": "Apply for Membership",
    "successMessage": "Application submitted successfully!"
  }
}
```

```json
// src/messages/bn.json
{
  "HomePage": {
    "title": "বিল্ড বরগুনা কো-অপারেটিভ",
    "subtitle": "একসাথে মূলধন, একসাথে উন্নয়ন"
  },
  "MemberForm": {
    "nameLabel": "পূর্ণ নাম",
    "submitButton": "সদস্যপদের জন্য আবেদন করুন",
    "successMessage": "আবেদন সফলভাবে জমা হয়েছে!"
  }
}
```

### Usage Patterns

```tsx
// 1. Server Components
import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('AboutPage');
  
  return <h1>{t('title')}</h1>;
}

// 2. Client Components
"use client";
import { useTranslations } from 'next-intl';

export function ContactForm() {
  const t = useTranslations('ContactForm');
  
  return (
    <form>
      <label>{t('emailLabel')}</label>
      <button>{t('submitButton')}</button>
    </form>
  );
}

// 3. Server Actions with localized validation errors
"use server";
import { getTranslations } from 'next-intl/server';

export async function createUser(formData: FormData) {
  const t = await getTranslations('Validation');
  
  const result = schema.safeParse(data, {
    errorMap: (issue) => ({
      message: t(issue.path.join('.'))
    })
  });
  
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }
}
```

### Bilingual Content in Database

**All user-facing models have EN + BN fields**:
```prisma
model Course {
  titleEn       String
  titleBn       String
  descriptionEn String
  descriptionBn String
}

model Brand {
  nameEn        String
  nameBn        String
  descriptionEn String
  descriptionBn String
}
```

**Display Logic**:
```tsx
import { getLocale } from 'next-intl/server';

export async function CoursePage({ params }: { params: { id: string } }) {
  const locale = await getLocale();
  const course = await prisma.course.findUnique({ where: { id: params.id } });
  
  const title = locale === 'bn' ? course.titleBn : course.titleEn;
  const description = locale === 'bn' ? course.descriptionBn : course.descriptionEn;
  
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
```

### Critical i18n Rules

1. **Always update both `en.json` AND `bn.json`** when adding keys
2. **Use nested namespaces** for organization (`HomePage.hero.title`)
3. **Validate translation keys** exist before deployment
4. **Use ICU message format** for plurals and interpolation:
   ```json
   {
     "itemCount": "{count, plural, =0 {No items} =1 {One item} other {# items}}"
   }
   ```

---

## Server Actions & Forms

### Form Submission Pattern (Progressive Enhancement)

```tsx
// 1. Define Server Action
// src/lib/actions/contact.actions.ts
"use server";
import { z } from 'zod';

const contactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10)
});

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Honeypot spam check
  if (formData.get('honeypot')) {
    return { success: false, message: 'Spam detected' };
  }
  
  // Validate
  const validated = contactSchema.safeParse({
    email: formData.get('email'),
    message: formData.get('message')
  });
  
  if (!validated.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validated.error.flatten().fieldErrors
    };
  }
  
  try {
    await prisma.contact.create({ data: validated.data });
    return { success: true, message: 'Message sent!' };
  } catch (error) {
    console.error('Contact form error:', error);
    return { success: false, message: 'Failed to send message' };
  }
}

// 2. Client Component with useActionState
"use client";
import { useActionState } from 'react';
import { submitContactForm } from '@/lib/actions/contact.actions';

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    { success: false, message: '' }
  );
  
  return (
    <form action={formAction}>
      {/* Honeypot field (hidden) */}
      <input type="text" name="honeypot" style={{ display: 'none' }} />
      
      <input name="email" type="email" required />
      {state.errors?.email && <p className="text-red-500">{state.errors.email[0]}</p>}
      
      <textarea name="message" required />
      {state.errors?.message && <p className="text-red-500">{state.errors.message[0]}</p>}
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Message'}
      </button>
      
      {state.message && (
        <p className={state.success ? 'text-green-500' : 'text-red-500'}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

### File Upload with Vercel Blob

```tsx
"use server";
import { put } from '@vercel/blob';
import { auth } from '@/auth';

export async function uploadFile(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  
  const file = formData.get('file') as File;
  
  // Validate file
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    return { error: 'File too large (max 5MB)' };
  }
  
  // Upload to Vercel Blob
  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true
  });
  
  return { url: blob.url };
}
```

### Revalidation Strategies

```tsx
import { revalidatePath, revalidateTag } from 'next/cache';

// After mutation, revalidate affected routes
revalidatePath('/admin/members');          // Specific route
revalidatePath('/admin/members', 'layout'); // Layout only
revalidatePath('/admin', 'page');           // All /admin pages

// For tagged cache (advanced)
revalidateTag('members-list');
```

---

## Error Handling & Validation

### Zod Validation Patterns

```typescript
// src/lib/schemas.ts
import { z } from 'zod';

// Bangladesh-specific phone validation
const bdPhoneRegex = /^01[3-9]\d{8}$/;

export const joinMemberSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  nationalId: z.string().min(10, 'National ID must be at least 10 characters'),
  phone: z.string().regex(bdPhoneRegex, 'Invalid Bangladeshi phone number'),
  email: z.string().email('Invalid email address'),
  policyConsent: z.boolean().refine(val => val === true, {
    message: 'You must agree to terms and conditions'
  })
}).refine(data => data.phone !== data.nomineePhone, {
  message: 'Nominee phone must be different',
  path: ['nomineePhone']
});

// File validation
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export const fileSchema = z.object({
  leanCanvas: z
    .any()
    .optional()
    .refine(file => !file || file.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
    .refine(
      file => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      '.pdf, .jpg, and .png files are accepted'
    )
});
```

### Error Handling in Server Actions

```tsx
"use server";

export async function riskyAction(data: unknown) {
  try {
    // 1. Validate input
    const validated = schema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors
      };
    }
    
    // 2. Perform operation
    const result = await prisma.user.create({ data: validated.data });
    
    // 3. Log success (optional)
    await prisma.auditLog.create({
      data: { action: 'USER_CREATED', targetId: result.id }
    });
    
    return { success: true, data: result };
    
  } catch (error) {
    // 4. Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, message: 'A user with this email already exists' };
      }
    }
    
    // 5. Log unexpected errors
    console.error('Unexpected error in riskyAction:', error);
    
    // 6. Return generic user message (don't leak details)
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}
```

### Client-Side Error Display

```tsx
"use client";

export function FormWithErrors({ action }: { action: any }) {
  const [state, formAction, isPending] = useActionState(action, null);
  
  return (
    <form action={formAction}>
      <input name="email" />
      
      {/* Field-level errors */}
      {state?.errors?.email && (
        <p className="text-sm text-red-600">{state.errors.email[0]}</p>
      )}
      
      {/* Global form error */}
      {state?.message && !state.success && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">{state.message}</p>
        </div>
      )}
      
      {/* Success message */}
      {state?.message && state.success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">{state.message}</p>
        </div>
      )}
      
      <button disabled={isPending}>Submit</button>
    </form>
  );
}
```

---

## Security Guidelines

### Input Validation & Sanitization

1. **Always validate on server** (never trust client)
   ```tsx
   "use server";
   export async function createUser(formData: FormData) {
     // ✅ Validate with Zod
     const validated = schema.safeParse(data);
     if (!validated.success) return { error: 'Invalid input' };
     
     // ✅ Use validated data
     await prisma.user.create({ data: validated.data });
   }
   ```

2. **Prevent SQL Injection** (Prisma handles this automatically)
   ```tsx
   // ✅ Safe (parameterized)
   await prisma.user.findMany({ where: { email: userInput } });
   
   // ❌ Never use raw SQL with user input
   await prisma.$queryRaw`SELECT * FROM User WHERE email = ${userInput}`;
   ```

3. **Honeypot for spam protection**
   ```tsx
   // In form
   <input type="text" name="honeypot" style={{ display: 'none' }} />
   
   // In server action
   if (formData.get('honeypot')) {
     return { success: false, message: 'Spam detected' };
   }
   ```

### Environment Variable Security

```bash
# .env.local (NEVER commit)
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret-key-here"
RESEND_API_KEY="re_..."
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# .env.example (safe to commit)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
RESEND_API_KEY="your-resend-api-key"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

**Access in code**:
```tsx
// ✅ Server-side only
export async function serverAction() {
  const apiKey = process.env.RESEND_API_KEY;
}

// ❌ Never expose secrets to client
"use client";
export function ClientComponent() {
  const secret = process.env.AUTH_SECRET; // Won't work (undefined)
}
```

### CSRF Protection

NextAuth and Server Actions have built-in CSRF protection via:
- Same-origin policy enforcement
- POST-only mutations
- Token validation

**Manual CSRF token** (if needed):
```tsx
import { headers } from 'next/headers';

export async function protectedAction() {
  const headersList = await headers();
  const origin = headersList.get('origin');
  
  // Validate origin matches your domain
  if (!origin || !origin.startsWith('https://buildbarguna.com')) {
    throw new Error('Invalid origin');
  }
}
```

### Rate Limiting (Recommended for Production)

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}

// Usage in Server Action
export async function publicAction(formData: FormData) {
  const ip = headers().get('x-forwarded-for') || 'anonymous';
  
  if (!await checkRateLimit(ip)) {
    return { error: 'Too many requests. Please try again later.' };
  }
  
  // Proceed with action
}
```

---

## Coding Standards

### TypeScript Best Practices

**Type Safety**:
```typescript
// ✅ Explicit return types for public functions
export async function getMembers(): Promise<User[]> {
  return await prisma.user.findMany();
}

// ✅ Use Prisma-generated types
import { User, UserRole } from '@prisma/client';

// ✅ Define form state types
export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// ❌ Avoid 'any'
function processData(data: any) { } // Bad

// ✅ Use proper types or 'unknown'
function processData(data: unknown) {
  if (typeof data === 'string') {
    // TypeScript knows data is string here
  }
}
```

**Naming Conventions**:
```typescript
// PascalCase: Components, Interfaces, Types, Enums
export function MemberCard() { }
export interface UserProfile { }
export type FormState = { };
export enum UserRole { ADMIN, MEMBER }

// camelCase: Variables, functions, parameters
const totalMembers = 42;
export async function getMemberProfile(userId: string) { }

// SCREAMING_SNAKE_CASE: Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const API_BASE_URL = 'https://api.example.com';

// kebab-case: File names
// member-card.tsx
// get-member-profile.ts
```

### File Organization

```
src/components/forms/
├── ContactForm.tsx           # Main component
├── ContactForm.test.tsx      # Tests (if any)
└── ContactForm.types.ts      # Complex types only (optional)

src/lib/actions/
├── member.actions.ts         # Member-related actions
├── venture.actions.ts        # Venture-related actions
└── admin.actions.ts          # Admin-specific actions
```

### Code Style

**Indentation**: 2 spaces (enforced by ESLint)

**Semicolons**: Required (enforced by ESLint)

**Imports**: Group and order logically
```typescript
// 1. React/Next.js
import { useState } from 'react';
import { redirect } from 'next/navigation';

// 2. Third-party libraries
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// 3. Internal modules
import { Button } from '@/components/ui/button';
import { joinMemberSchema } from '@/lib/schemas';

// 4. Types
import type { User } from '@prisma/client';
```

**Component Structure**:
```tsx
"use client"; // If needed

// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface MemberCardProps {
  member: User;
  onApprove: (id: string) => void;
}

// 3. Component
export function MemberCard({ member, onApprove }: MemberCardProps) {
  // 3a. Hooks
  const [isLoading, setIsLoading] = useState(false);
  
  // 3b. Handlers
  const handleApprove = () => {
    setIsLoading(true);
    onApprove(member.id);
  };
  
  // 3c. Render
  return (
    <div className="border rounded-lg p-4">
      <h3>{member.name}</h3>
      <Button onClick={handleApprove} disabled={isLoading}>
        Approve
      </Button>
    </div>
  );
}
```

### Tailwind CSS Conventions

**Follow shadcn/ui patterns**:
```tsx
// ✅ Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "rounded-lg border p-4",
  isActive && "bg-blue-50 border-blue-200",
  isDisabled && "opacity-50 cursor-not-allowed"
)} />

// ✅ Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />

// ✅ Dark mode support (future)
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />

// ❌ Avoid inline styles
<div style={{ padding: '16px' }} /> // Bad

// ✅ Use Tailwind classes
<div className="p-4" /> // Good
```

**Class Ordering** (recommended):
1. Layout (display, position, grid, flex)
2. Box model (width, height, padding, margin)
3. Typography (font, text)
4. Visual (background, border, shadow)
5. Interactivity (cursor, pointer-events)

```tsx
<button className="
  flex items-center justify-center     // Layout
  w-full px-4 py-2                    // Box model
  text-sm font-medium                 // Typography
  bg-blue-600 border rounded-lg       // Visual
  hover:bg-blue-700 cursor-pointer    // Interactivity
" />
```

---

## Common Workflows

### 1. Adding a New Feature (Full Flow)

**Example: Add "Course Review" feature**

```bash
# Step 1: Update Prisma schema
# Edit prisma/schema.prisma

model CourseReview {
  id        String   @id @default(cuid())
  courseId  String
  userId    String
  rating    Int      @db.SmallInt
  comment   String?
  createdAt DateTime @default(now())
  
  course Course @relation(fields: [courseId], references: [id])
  user   User   @relation(fields: [userId], references: [id])
  
  @@unique([userId, courseId])
}

model Course {
  // ... existing fields
  reviews CourseReview[]
}

model User {
  // ... existing fields
  courseReviews CourseReview[]
}

# Step 2: Create migration
npx prisma migrate dev --name add_course_reviews

# Step 3: Create Zod schema
# Edit src/lib/schemas.ts

export const courseReviewSchema = z.object({
  courseId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional()
});

# Step 4: Create Server Action
# Create src/lib/actions/review.actions.ts

"use server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { courseReviewSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function submitReview(formData: FormData) {
  const session = await auth();
  if (!session) return { error: 'Unauthorized' };
  
  const validated = courseReviewSchema.safeParse({
    courseId: formData.get('courseId'),
    rating: Number(formData.get('rating')),
    comment: formData.get('comment')
  });
  
  if (!validated.success) {
    return { error: 'Invalid input', errors: validated.error.flatten() };
  }
  
  await prisma.courseReview.create({
    data: { ...validated.data, userId: session.user.id }
  });
  
  revalidatePath(`/programs/courses/${validated.data.courseId}`);
  return { success: true };
}

# Step 5: Create UI component
# Create src/components/forms/CourseReviewForm.tsx

"use client";
import { useActionState } from 'react';
import { submitReview } from '@/lib/actions/review.actions';

export function CourseReviewForm({ courseId }: { courseId: string }) {
  const [state, action, isPending] = useActionState(submitReview, null);
  
  return (
    <form action={action}>
      <input type="hidden" name="courseId" value={courseId} />
      {/* Rating stars */}
      {/* Comment textarea */}
      <button disabled={isPending}>Submit Review</button>
    </form>
  );
}

# Step 6: Add i18n messages
# Edit src/messages/en.json and bn.json

{
  "CourseReview": {
    "title": "Write a Review",
    "ratingLabel": "Rating",
    "commentLabel": "Your review (optional)",
    "submitButton": "Submit Review"
  }
}

# Step 7: Test
npm run lint
npm run build
npm run dev

# Step 8: Commit
git add .
git commit -m "feat(courses): add course review system"
```

### 2. Member Approval Workflow

```typescript
// Backend flow (already implemented in admin.actions.ts)

// 1. User submits KYC form → joinMemberAction()
//    - Creates User with role=MEMBER
//    - Creates MemberProfile with isApproved=false
//    - Sends email notification to admin

// 2. Admin views pending applications → getMemberApplications()
//    - Fetches users where role=MEMBER and memberProfile.isApproved=false

// 3. Admin approves → approveMemberApplication(userId)
//    - Updates memberProfile.isApproved=true
//    - Revalidates /admin cache

// 4. Admin rejects → rejectMemberApplication(userId)
//    - Deletes user and associated profile (cascade)
```

### 3. Venture Proposal Workflow

```typescript
// 1. Member proposes venture → proposeVentureAction()
//    - Validates: user is authenticated MEMBER
//    - Uploads lean canvas PDF to Vercel Blob
//    - Creates Venture with status="PROPOSED"
//    - Redirects to success page

// 2. Admin reviews ventures → getVentureProposals()
//    - Fetches all ventures with proposer info

// 3. Admin updates status → updateVentureStatus(id, status)
//    - Updates venture.status ("PROPOSED" → "APPROVED" / "REJECTED")
//    - Revalidates cache
```

### 4. Bilingual Content Creation

```typescript
// For any new user-facing model:

// 1. Add *En and *Bn fields in schema
model NewModel {
  titleEn       String
  titleBn       String
  descriptionEn String
  descriptionBn String
}

// 2. Update forms to collect both
<input name="titleEn" placeholder="Title (English)" />
<input name="titleBn" placeholder="শিরোনাম (বাংলা)" />

// 3. Display based on locale
const locale = await getLocale();
const title = locale === 'bn' ? item.titleBn : item.titleEn;
```

---

## Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Authentication (NextAuth.js v5)
AUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"  # Production: https://yourdomain.com

# Email (Resend)
RESEND_API_KEY="re_..."

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS="G-XXXXXXXXXX"
```

### Environment-Specific Settings

**Development** (`.env.local`):
```bash
DATABASE_URL="postgresql://localhost:5432/buildbarguna_dev"
AUTH_SECRET="dev-secret-key-not-for-production"
NEXTAUTH_URL="http://localhost:3000"
```

**Production** (Vercel):
```bash
# Set via Vercel Dashboard → Settings → Environment Variables
DATABASE_URL="<Neon/Supabase connection string>"
AUTH_SECRET="<strong random key>"
NEXTAUTH_URL="https://buildbarguna.com"
```

### Accessing Environment Variables

```typescript
// ✅ Server-side (Server Components, Server Actions, API Routes)
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.RESEND_API_KEY;

// ✅ Client-side (ONLY with NEXT_PUBLIC_ prefix)
const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

// ❌ Client-side secrets (won't work, undefined)
const secret = process.env.AUTH_SECRET; // undefined in browser
```

### Database Connection Pooling

**Recommended for serverless** (Neon, Supabase, PlanetScale):
```bash
# Add connection_limit to DATABASE_URL
DATABASE_URL="postgresql://...?connection_limit=5"

# Or use Prisma Accelerate for connection pooling
# https://www.prisma.io/docs/accelerate
```

---

## Context7 Configuration

This project is optimized for AI agent understanding via Context7.

**Configuration** (`context7.json`):
```json
{
  "$schema": "https://context7.com/schema/context7.json",
  "projectTitle": "Build Barguna",
  "description": "Co-operative Website Platform",
  "folders": ["src", "prisma", "public"],
  "excludeFolders": ["node_modules", ".next", ".git", "tmp"],
  "excludeFiles": ["package-lock.json"],
  "rules": [
    "Always validate user input using Zod",
    "Use TypeScript strict mode",
    "Prefer Server Components where possible",
    "Follow shadcn/ui component patterns"
  ]
}
```

### Agent Guidelines

1. **Check excluded folders** before extensive searches
2. **Follow project-specific rules** defined in context7.json
3. **Respect bilingual requirements** (EN + BN)
4. **Use Prisma** for all database operations (no raw SQL)
5. **Validate inputs** with Zod schemas before mutations

---

## Commit & Pull Request Guidelines

### Conventional Commits

**Format**: `<type>(<scope>): <subject>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (deps, config)

**Examples**:
```bash
feat(members): add nominee information to KYC form
fix(auth): resolve JWT expiration issue
docs(readme): update setup instructions for M1 Macs
refactor(forms): extract validation logic to schemas
perf(db): add index on user.email for faster lookups
chore(deps): upgrade Next.js to 16.1.5
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Added X feature
- Fixed Y bug
- Refactored Z component

## Database Changes
- [ ] Schema changes (include migration name)
- [ ] Seed data updates
- [ ] No database changes

## Environment Variables
- [ ] Added new variables (document in .env.example)
- [ ] Modified existing variables
- [ ] No changes

## Testing
- [ ] Tested in EN locale
- [ ] Tested in BN locale
- [ ] npm run lint passes
- [ ] npm run build succeeds

## Screenshots (if UI changes)
[Attach screenshots]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Added/updated comments for complex logic
- [ ] Updated documentation (if needed)
- [ ] No console.log statements left in production code
```

### Code Review Checklist

**Reviewers should verify**:
1. ✅ TypeScript types are explicit (no implicit `any`)
2. ✅ Server Actions have proper auth checks
3. ✅ All user inputs validated with Zod
4. ✅ Both EN and BN translations updated
5. ✅ Database queries use Prisma (no raw SQL)
6. ✅ No secrets in code (use env variables)
7. ✅ Error handling implemented
8. ✅ Proper loading states for async operations
9. ✅ Responsive design (mobile-first)
10. ✅ Accessibility (semantic HTML, ARIA labels)

---

## Testing Guidelines

### Unit Testing (Not yet implemented, but recommended)

```bash
# Install dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Test file naming
src/components/forms/ContactForm.tsx
src/components/forms/ContactForm.test.tsx
```

**Example test**:
```tsx
// src/lib/schemas.test.ts
import { describe, it, expect } from '@jest/globals';
import { joinMemberSchema } from './schemas';

describe('joinMemberSchema', () => {
  it('should validate correct member data', () => {
    const result = joinMemberSchema.safeParse({
      name: 'John Doe',
      nationalId: '1234567890',
      phone: '01712345678',
      email: 'john@example.com',
      address: '123 Main St, Dhaka',
      nomineeName: 'Jane Doe',
      nomineePhone: '01898765432',
      nomineeNationalId: '0987654321',
      nomineeRelation: 'Spouse',
      policyConsent: true
    });
    
    expect(result.success).toBe(true);
  });
  
  it('should reject invalid phone number', () => {
    const result = joinMemberSchema.safeParse({
      // ... other fields
      phone: '123456' // Invalid
    });
    
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].path).toEqual(['phone']);
  });
});
```

### Manual Testing Checklist

**Before each release**:
- [ ] Test all forms in EN and BN
- [ ] Verify admin authentication (ADMIN, EDITOR, MEMBER roles)
- [ ] Test file uploads (max size, file types)
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Verify email notifications work
- [ ] Test pagination on large datasets
- [ ] Check error messages are user-friendly
- [ ] Verify database migrations applied successfully

---

## Performance Optimization

### Next.js Optimizations

```tsx
// 1. Image Optimization
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Build Barguna"
  width={200}
  height={50}
  priority // Above-the-fold images
/>

// 2. Font Optimization
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// 3. Dynamic Imports (code splitting)
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('@/components/admin/Dashboard'), {
  loading: () => <p>Loading...</p>,
  ssr: false // Client-only component
});

// 4. Static Generation (when possible)
export async function generateStaticParams() {
  const brands = await prisma.brand.findMany();
  return brands.map(brand => ({ slug: brand.slug }));
}
```

### Database Query Optimization

```tsx
// ✅ Select only needed fields
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true }
});

// ✅ Paginate large datasets
const ITEMS_PER_PAGE = 20;
const page = 1;

const users = await prisma.user.findMany({
  take: ITEMS_PER_PAGE,
  skip: (page - 1) * ITEMS_PER_PAGE,
  orderBy: { createdAt: 'desc' }
});

// ✅ Use indexes (defined in schema.prisma)
model User {
  email String @unique
  
  @@index([email])
  @@index([role, createdAt])
}

// ✅ Avoid N+1 queries
// Bad:
const courses = await prisma.course.findMany();
for (const course of courses) {
  const applications = await prisma.courseApplication.findMany({
    where: { courseId: course.id }
  });
}

// Good:
const courses = await prisma.course.findMany({
  include: { applications: true }
});
```

---

## Troubleshooting Guide

### Common Issues

**1. "Prisma Client not generated"**
```bash
# Solution
npx prisma generate
# Or reinstall dependencies
npm install
```

**2. "Module not found: Can't resolve '@/...'**
```bash
# Check tsconfig.json has path mappings
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**3. "NextAuth session is undefined"**
```tsx
// Ensure SessionProvider wraps your app
// src/app/layout.tsx
import { SessionProvider } from '@/components/providers/SessionProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

**4. "Translation key missing"**
```bash
# Verify key exists in both en.json and bn.json
# Use dot notation: HomePage.hero.title
```

**5. "Database connection timeout"**
```bash
# Add connection pooling to DATABASE_URL
postgresql://...?connection_limit=5&pool_timeout=0
```

---

## Additional Resources

### Official Documentation
- [Next.js 16](https://nextjs.org/docs)
- [React 19](https://react.dev/)
- [Prisma 6](https://www.prisma.io/docs)
- [NextAuth v5](https://next-auth.js.org/)
- [next-intl](https://next-intl-docs.vercel.app/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)

### Project-Specific Guides
- `README.md` - Initial setup instructions
- `ADMIN_SETUP_GUIDE.md` - Admin user creation
- `EMAIL_SETUP_GUIDE.md` - Resend email configuration
- `SETUP_MAGIC_LINKS.md` - Magic link authentication (deprecated)

### Internal Team Contacts
- **Technical Lead**: [Contact info]
- **Database Admin**: [Contact info]
- **Deployment Manager**: [Contact info]

---

## Version History

- **v1.0** (2026-02-04): Initial comprehensive AI agent guidelines
  - Added Context7 research-based best practices
  - Documented Next.js 16, Prisma 6, NextAuth v5 patterns
  - Included bilingual i18n workflows
  - Added security guidelines and common workflows

---

**Last Updated**: February 4, 2026  
**Maintained By**: AI Agent (Rovo Dev) + Human Team  
**License**: Internal Use Only
