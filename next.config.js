/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,

  // Prisma must stay external (native binaries can't be bundled)
  // so Next.js leaves @prisma/client and prisma as runtime requires.
  serverExternalPackages: ['@prisma/client', 'prisma'],

  // Ensure Prisma schema, migrations, and engine binaries are included
  // inside the standalone output that Docker copies.
  outputFileTracingIncludes: {
    '/api/**/*': [
      './prisma/**/*',
      './lib/generated/prisma/**/*',
      './node_modules/.prisma/**/*',
      './node_modules/@prisma/**/*',
    ],
  },
};

module.exports = nextConfig;