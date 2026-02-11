# Task Size Voting

Simple real-time app for teams to vote task sizes using T-shirt estimatives (PP, P, M, G, GG).

## What it does

- Team members enter a name and send one estimative.
- Votes are synced in real time.
- A facilitator can reveal results.
- The room can be cleared for a new round.

## Architecture (simple)

- **Frontend (Next.js App Router):**
  - Main page UI and interaction flow in `src/app/page.tsx`
  - UI components in `src/components/*`
- **Real-time transport (Pusher):**
  - Client subscription in `src/libs/pusher/client/index.ts`
  - Server trigger/auth handlers in `src/app/api/pusher/*`
- **State flow:**
  1. User sends vote from UI
  2. Frontend calls `/api/pusher/trigger`
  3. Pusher broadcasts events (`estimative`, `show`, `clear`)
  4. Connected clients update screen instantly

## Technologies

- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- Pusher (real-time events)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env
```

3. Start development server:

```bash
npm run dev
```

4. Open:

`http://localhost:3000`

## Environment variables

Use these keys in `.env`:

```env
PUSHER_APP_ID=your_pusher_app_id
PUSHER_SECRET=your_pusher_secret
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
```

## Scripts

- `npm run dev` - run in development
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint code
