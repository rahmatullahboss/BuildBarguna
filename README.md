# Build Barguna Initiative Website

This is the official website for **Build Barguna**, a primary, non-credit community initiative. Our mission is to build transparent foundations for community-based fair economy through community participation and pilot-first approach.

**Tagline:** Together Capital, Together Development

## Tech Stack

This project is a modern, production-grade website built with the latest technologies (as of Nov 2025 specs):

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions, PPR)
- **Language:** [TypeScript 5.9](https://www.typescriptlang.org/)
- **UI:** [React 19](https://react.dev/) + [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Component Library:** [shadcn/ui](https://ui.shadcn.com/) + [Radix Primitives](https://www.radix-ui.com/)
- **ORM:** [Prisma 6.x](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Designed for Neon/Supabase)
- **Authentication:** [NextAuth.js (Auth.js) v5](https://next-auth.js.org/)
- **Internationalization (i18n):** [next-intl 4.x](https://next-intl-docs.vercel.app/) (EN ↔ BN)
- **Validation:** [Zod](https://zod.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v22 LTS or later)
- [npm](https://www.npmjs.com/) (v10 or later)
- A PostgreSQL database (e.g., from [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or a local instance)

### 2. Clone the Repository

```bash
git clone https://github.com/your-repo/build-barguna-website.git
cd build-barguna-website
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Environment Variables

You need to create a `.env` file in the root of the project to store your secret keys and database connection string.

1.  **Copy the example file:**

    ```bash
    cp .env.example .env
    ```

2.  **Edit the `.env` file** and add your specific credentials for the following:
    - `DATABASE_URL`: Your full PostgreSQL connection string.
    - `AUTH_SECRET`: A secret key for NextAuth.js. You can generate one with `openssl rand -base64 32`.
    - `EMAIL_SERVER_*` and `EMAIL_FROM`: Credentials for your email provider (e.g., Resend) for magic link authentication.

### 5. Set Up the Database

You need to apply the database schema and populate it with the initial seed data.

1.  **Run the database migrations:**
    *(Note: Since this is the first migration, `migrate dev` will create the initial schema.)*

    ```bash
    npx prisma migrate dev --name "initial-setup"
    ```

2.  **Seed the database with placeholder content:**
    This script will populate the database with sample courses, brands, stories, users, etc.

    ```bash
    npm run prisma:seed
    ```

### 6. Run the Development Server

You are now ready to start the development server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The site supports English (`/en`) and Bengali (`/bn`) locales.

---

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Runs the ESLint linter.
- `npm run prisma:seed`: Populates the database with the seed data from `prisma/seed.ts`.
