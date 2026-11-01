FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.13.0 --activate
WORKDIR /app
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile
COPY packages/shared packages/shared
RUN pnpm --filter @smartwaste/shared build
COPY apps/api apps/api
RUN pnpm --filter @smartwaste/api exec prisma generate && pnpm --filter @smartwaste/api build

EXPOSE 4000
CMD ["node", "apps/api/dist/index.js"]
