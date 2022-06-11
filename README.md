# Remix + Cloudflare Workers starter with Turborepo 🚀

Starter to get going with Remix and Cloudflare Workers.

This template is based on the starter created by [Jacob](https://github.com/jacob-ebey)([remix-cloudflare-worker-template](https://github.com/jacob-ebey/remix-cloudflare-worker-template/)).

## What's inside? 👀

This turborepo uses [npm](https://www.npmjs.com/) as a package manager. It includes the following packages/apps:

### Apps and Packages 📦

- `counter-do`: a [Durable Object](https://developers.cloudflare.com/workers/runtime-apis/durable-objects) class for managing the count state
- `remix-app`: a [Remix](https://remix.run) app (with Tailwind)
- `worker`: a [Worker](https://developers.cloudflare.com/workers) handler function
- `cloudflare-env`: types for Cloudflare environement variables
- `eslint-config-custom`: `eslint` configurations (includes `@remix-run/eslint-config` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json` used throughout the monorepo

## Getting Started 🪄

Let's setup `wrangler` CLI [instalation](https://github.com/cloudflare/wrangler#installation) (wrangler requires a minimum Node version of `16`)

```sh
npm i @cloudflare/wrangler -g
```

After installation, log in to our Cloudflare account from the CLI.

```sh
wrangler login
```

Next, we have to add Cloudflare Account ID in the [`wrangler.toml`](./packages/worker/wrangler.toml). You can get the Account ID by visiting the [`Workers` Dashboard](https://dash.cloudflare.com).

```toml
account_id = "xxx"
```

Also, remember to change the worker's name while we're here.

```toml
name = "remix-worker" # can be any name
```

That's all we're ready to push to prod! 🚀

Before pushing to the worker via GitHub action, we have to configure the `CF_API_TOKEN` secret in GitHub. We can generate an API Token from [here](https://dash.cloudflare.com/profile/api-tokens). When presented with the list of templates to choose from, select the "Edit Cloudflare Workers" option. This template should have the necessary permissions to push a Worker from GitHub. Now we can commit the changes made to `wrangler.toml` and push the changes.

```sh
git commit -am "<message>"
git push
```

### Recap 🌀

```sh
npm i @cloudflare/wrangler -g
wrangler login
# update wrangler.toml with the Account ID
# update Worker name
# configure CF_API_TOKEN action secret
git add -A -m "<message>"
git push
```

## Durable Objects 🔥

Durable Objects are only available with a Workers paid subscription. However, you can upgrade to the paid plan from the [Dashboard](https://dash.cloudflare.com).

This starter template comes with a simple DO implementation to keep track of the number of times the root loader is invoked.

If you're starting with DO and not sure what it is, go through the official docs on [Durable Objects](https://remix.run/docs/en/v1/api/conventions#page-context-in-meta-function) will be a good start!

## Worker KV 📒

KV [docs](https://developers.cloudflare.com/workers/runtime-apis/kv/).
Wrangler KV CLI [docs](https://developers.cloudflare.com/workers/wrangler/workers-kv/)

This template does not come with a KV namespace attached to it. However, you can create one using the Wrangler CLI.

```sh
wrangler kv:namespace create "MY_KV"
```

The above command will create a KV namespace. Now we need to bind the created namespace with the worker. When we run the create command, the CLI will print the binding configuration we need to add to our `wrangler.toml` configuration file. It will look like

```toml
kv_namespaces = [
  { binding = "MY_KV", id = "xxxx" }
]
```

We must add this above the `[site]` block in the `toml` file. We have added the KV namespace binding for the production environment, but we also need a namespace for `dev`. We can do that by running.

```sh
wrangler kv:namespace create "MY_KV" --preview
```

This will generate a namespace for the `dev` environment, and we must add this below the `[env.dev]` block in the configuration file.

```toml
[env.dev]
kv_namespaces = [
  { binding = "MY_KV", id = "xxxx", preview_id = "xxxx" }
]
```

**Note**: We need to add the `preview_id` key to the configuration file along with the `id` key with the same value.

## Turbo Setup ✨

This repository is used in the `npx create-turbo@latest` command and selected when choosing which package manager you wish to use with your monorepo (npm).

### Build 🛠

To build all apps and packages, run the following command:

```sh
npm run build
```

### Develop 💻

To develop all apps and packages, run the following command:

```sh
npm run dev
```

### Remote Caching 💽

Turborepo can use a technique known as [Remote Caching (Beta)](https://turborepo.org/docs/core-concepts/remote-caching) to share cache artefacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching (Beta), you will need an account with Vercel. If you don't have an account, you can [create one](https://vercel.com/signup), then enter the following commands:

```sh
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your turborepo:

```sh
npx turbo link
```

## Useful Links 🔗

### Remix + Cloudflare

- [Remix](https://remix.run/docs/en/v1)
- [Cloudflare](https://www.cloudflare.com)
- [Workers](https://developers.cloudflare.com/workers/)
- [KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Durable Objects](https://developers.cloudflare.com/workers/runtime-apis/durable-objects/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- [Wrangler KV](https://developers.cloudflare.com/workers/wrangler/workers-kv/)

### Turborepo

Learn more about the power of Turborepo:

- [Pipelines](https://turborepo.org/docs/core-concepts/pipelines)
- [Caching](https://turborepo.org/docs/core-concepts/caching)
- [Remote Caching (Beta)](https://turborepo.org/docs/core-concepts/remote-caching)
- [Scoped Tasks](https://turborepo.org/docs/core-concepts/scopes)
- [Configuration Options](https://turborepo.org/docs/reference/configuration)
- [CLI Usage](https://turborepo.org/docs/reference/command-line-reference)
