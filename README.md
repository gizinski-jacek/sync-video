# SyncVideo Client

SyncVideo allows you to watch the same videos with your friends over internet. Fully synchronized and with chat support.

## Table of contents

- [SyncVideo](#syncvideo-client)
  - [Table of contents](#table-of-contents)
- [Github \& Live](#github--live)
  - [Getting Started](#getting-started)
  - [Learn More](#learn-more)
  - [Deploy](#deploy)
  - [Features](#features)
  - [Status](#status)
  - [Contact](#contact)

# Github & Live

Github repo can be found [here](https://github.com/gizinski-jacek/sync-video).

Backend API can be found [here](https://github.com/gizinski-jacek/sync-video-api).

Live demo can be found on [Vercel](https://multi-viewer-one.vercel.app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

Don't forget to add **.env** file with these environment variables for the app:

```
NEXT_PUBLIC_API_URI
YOUTUBE_API_KEY
TWITCH_CLIENT_ID
TWITCH_CLIENT_SECRET
VIMEO_ACCESS_TOKEN
```

## Features

- Support for different video/livestreaming sites
- Search and add videos to playlist
- Synchronized video in real time
  - Join at any moment and let app sync you to currently watched timestamp in the video
  - Room owner can seek currently played video
- Live chat for interacting with users present in the room
- Playlist showing next videos on the list
  - Ability to reorder or remove each media
- Responsive and adjustable UI

## Status

Project status: **_FINISHED_**

## Contact

Feel free to contact me at:

```
gizinski.jacek.tr@gmail.com
```
