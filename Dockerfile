# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.16.0

# Base stage
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

# Dependencies stage
FROM base as deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Build stage
FROM deps as build
COPY . .
RUN npm ci
RUN npm run build

# Final stage
FROM base as final
ENV NODE_ENV production

# Ensure permissions
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/package.json /usr/src/app/package.json
COPY tsconfig.json tsconfig.json

RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000
CMD ["npm", "run", "start"]
