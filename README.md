# KAI Prevention Web Client

## Login Page Implementation

The login page has been implemented according to the design mockup. The page features:

- Split screen layout with background image and login form
- Custom styling using Tailwind CSS and custom CSS
- Form validation using Zod
- Integration with NextAuth.js for authentication
- Responsive design for all device sizes

## Getting Started

1. Add your own image to `public/login-background.jpg` - the current file is just a placeholder
2. Configure authentication providers in `src/app/auth/providers`
3. Customize text content and translations as needed

## Dependencies

- Next.js
- NextAuth.js
- Material UI
- Tailwind CSS
- Zod form validation

## Notes

- The login page is responsive and will adjust to different screen sizes
- The form includes validation for email and password
- Password visibility can be toggled
- The page is set up to redirect to the dashboard after successful login

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
