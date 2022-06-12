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

After installation, log in to your Cloudflare account from the CLI.

```sh
wrangler login
```

Let's install the dependencies.

```sh
npm install
```

Now we can set up the project.

```sh
npm run setup
```

The setup script will ask for your worker's name. It can be any name. And then, we also need to add the Account ID, which you can find by visiting the Cloudflare [Dashboard](https://dash.cloudflare.com).

You can add the Worker name and the Account ID later to the [`wrangler.toml](packages/worker/wrangler.toml).

That's all we're ready to push to prod! 🚀

Before pushing to the worker via GitHub action, we have to configure the `CF_API_TOKEN` secret in GitHub. We can generate an API Token from [here](https://dash.cloudflare.com/profile/api-tokens). When presented with the list of templates to choose from, select the "Edit Cloudflare Workers" option. This template should have the necessary permissions to push a Worker from GitHub. Now we can commit the changes made to `wrangler.toml` and push the changes.

```sh
git commit -am "<message>"
git push
```

### Recap 🌀

```sh
npm install @cloudflare/wrangler -g
wrangler login
npm install
npm run setup
# configure CF_API_TOKEN action secret
git add -A -m "<message>"
git push
```

## Durable Objects 🔥

Durable Objects are only available with a Workers paid subscription. However, you can upgrade to the paid plan from the [Dashboard](https://dash.cloudflare.com).

This starter template comes with a simple DO implementation to keep track of the number of times the root loader is invoked.

If you're starting with DO and not sure what it is, go through the official docs on [Durable Objects](https://developers.cloudflare.com/workers/runtime-apis/durable-objects/) will be a good start! And checkout [using durable objects](https://developers.cloudflare.com/workers/learning/using-durable-objects/) for more applications of DO.

### Defining a Durable Object

This template comes with a script to create the boilerplate for a new Durable Object class.

```sh
npm run new:do
```

The script will have instructions to initialise the DO with the worker. Don't forget to follow them!

#### More information on DO

> You can skip this section if you have used the script to generate the DO class. Continue for more information on DO :)

To define a DO class, check out the [docs](https://developers.cloudflare.com/workers/runtime-apis/durable-objects/#durable-object-class-definition).

To include the DO class into the worker, we have to add the new DO package as a `dependendency` of the [`worker`](packages/worker/package.json). Then we need to create a binding for the DO in the configuration file [`wrangler.toml`](packages/worker/wrangler.toml).

```toml
[durable_objects]
bindings = [
  {name = "<DO_BINDING_NAME>", class_name = "<DO_CLASS_NAME>"},
]
```

For development add the following to [`wrangler.dev.toml`](packages/worker/wrangler.dev.toml)

```toml
[env.dev.durable_objects]
bindings = [
  {name = "<DO_BINDING_NAME>", class_name = "<DO_CLASS_NAME>"},
]
```

We must create a [migration](https://developers.cloudflare.com/workers/learning/using-durable-objects/#durable-object-migrations-in-wranglertoml) to register the DO in the configuration file.

```toml
[[migrations]]
tag = "v<RUNNING_TAG_ID>"
new_classes = ["<DO_CLASS_NAME>"]
```

More info about uploading a DO [here](https://developers.cloudflare.com/workers/learning/using-durable-objects/#uploading-a-durable-object-worker).

The DO binding will be available in the data functions (`loader`/`action`) through the `context` argument. Types for the `context` can be added at [cloudflare-env](./config/cloudflare-env/index.d.ts). To add a type for a newly created DO, we have to add the following to the `.d.ts` file

```ts
<DO_BINDING_NAME>: DurableObjectNamespace
```

Now we can access the DO binding from the data function through the `context`.

```ts
export let loader: LoaderFunction = ({ context }) => {
  context.MY_DO
  //        ^ Will have proper type definitions
  return null
}
```

### Deleting a DO

It requires a migration to delete a DO. More info [here](https://developers.cloudflare.com/workers/learning/using-durable-objects/#durable-object-migrations-in-wranglertoml)

## Worker KV 📒

- [KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Wrangler KV CLI](https://developers.cloudflare.com/workers/wrangler/workers-kv/)

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

We must add this above the `[site]` block in the `wrangler.toml` file.

We have added the KV namespace binding for the production environment, but we also need a namespace for `dev`. We can do that by creating a new namespace for `dev`.

```sh
wrangler kv:namespace create "MY_KV" --preview
```

This will generate a namespace for the `dev` environment, and we must add this below the `[env.dev]` block in the dev configuration file `wrangler.dev.toml`.

```toml
[env.dev]
kv_namespaces = [
  { binding = "MY_KV", id = "xxxx", preview_id = "xxxx" }
]
```

**Note**: We need to add the `preview_id` key to the configuration file along with the `id` key with the same value (ref: [stackoverflow](https://stackoverflow.com/a/71898353/17459282)).

The bounded KV will be available in the `loader`/`action` via the `context` argument passed to the functions. We define types for the `context` at [cloudflare-env](./config/cloudflare-env/index.d.ts). To add types for a newly bounded KV, we have to add the following to the `.d.ts` file

```ts
MY_KV: KVNamespace
```

Now we can access the KV namespace from the data function through the `context`.

```ts
export let loader: LoaderFunction = ({ context }) => {
  context.MY_KV
  //        ^ Will have proper type definitions
  return null
}
```

## Environment Variables (Secrets) 🔐

### Adding Worker Environment Variables

You must run `wrangler` commands from a directory which contains the `wrangler.toml` file. Either we can `cd` into the worker directory present at `packages/worker`, or we can specify the path to the configuration file in the CLI.

To set a worker `secret`, we can

```sh
cd packages/worker
wrangler secret put <SECRET_NAME>
```

or,

```sh
wrangler secret -c packages/worker/wrangler.toml
```

Like DO/KV binding, the Env variables will be passed to the data functions via the `context` argument. But we have only configured the production worker with the secret. So let's configure the local environment with the secret.

When we ran `npm run setup`, the CLI would have created `packages/worker/wrangler.dev.toml`. And the configuration file should have a `vars` key under the `[env.dev]` table. So we can add the new secret there.

```toml
[env.dev]
vars = {SECRET_KEY = "<value>"}
```

One last thing to do is add the type definition for the Env var at `config/cloudflare-env/index.d.ts`.

```ts
SECRET_KEY: string
```

Now, we can access SESSION_SECRET via `context.env.SESSION_SECRET` in the data functions inside our Remix app.

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
- [Usage and Practical applications of DO](https://developers.cloudflare.com/workers/learning/using-durable-objects/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- [Wrangler Configuration file reference](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Wrangler KV](https://developers.cloudflare.com/workers/wrangler/workers-kv/)

### Turborepo

Learn more about the power of Turborepo:

- [Pipelines](https://turborepo.org/docs/core-concepts/pipelines)
- [Caching](https://turborepo.org/docs/core-concepts/caching)
- [Remote Caching (Beta)](https://turborepo.org/docs/core-concepts/remote-caching)
- [Scoped Tasks](https://turborepo.org/docs/core-concepts/scopes)
- [Configuration Options](https://turborepo.org/docs/reference/configuration)
- [CLI Usage](https://turborepo.org/docs/reference/command-line-reference)
