This is a [Next.js](https://nextjs.org) project bootstrapped with [`nextvault`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
# NexusVault - Secure Password Manager 🔒

A privacy-first password manager built with Next.js featuring client-side encryption. Your data is encrypted before it leaves your device, ensuring maximum security and privacy.

## Features ✨

- 🔒 **Client-Side Encryption** - Your data is encrypted locally before storage
- 🛡️ **Secure Password Storage** - Military-grade AES-256-GCM encryption
- 🔑 **Master Password Protection** - Single master password to access all your data
- 🎯 **Strong Password Generator** - Create secure, customizable passwords
- 🔍 **Search Functionality** - Quickly find your stored credentials
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- ⚡ **Fast & Lightweight** - Built with Next.js 15 for optimal performance
- 🔄 **Real-time Updates** - Instant sync across your vault

## Tech Stack 🛠️

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Encryption**: AES-256-GCM with bcryptjs
- **Deployment**: Vercel

## Getting Started 🚀

### Prerequisites

- Node.js 18.0 or higher
- MongoDB Atlas account or local MongoDB instance
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Codewithashish14/nextvault.git
   cd nextvault
   ```