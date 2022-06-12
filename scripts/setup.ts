import fs from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'
import { parse, stringify } from '@ltd/j-toml'

async function run() {
  let workerDir = path.resolve(process.cwd(), 'packages/worker')
  let exampleWorkerConfig = path.resolve(workerDir, 'wrangler.example.toml')
  let devWorkerConfig = path.resolve(workerDir, 'wrangler.dev.toml')
  let prodWorkerConfig = path.resolve(workerDir, 'wrangler.toml')

  if (fs.existsSync(devWorkerConfig)) {
    let answer = await inquirer.prompt<{ continue: string }>([
      {
        name: 'continue',
        type: 'confirm',
        default: 'n',
        message:
          '🔴 Project is already configured. Do you want to run setup again? This will overwrite the existing config file.',
      },
    ])
    if (answer.continue === 'no') {
      return
    }
    console.error("\n🚨 Overwriting 'wrangler.dev.toml'")
  }

  console.error("\n🔨 Copying 'wrangler.example.toml' to 'wrangler.dev.toml'\n")
  await fs.copyFile(exampleWorkerConfig, devWorkerConfig)

  let answer = await inquirer.prompt<{ workerName: string; accountId: string }>(
    [
      {
        name: 'workerName',
        message: 'What is the name of your worker?',
        type: 'input',
        default: 'my-worker',
        validate: (input: string) => {
          if (input.length === 0) {
            return 'Please enter a name for your worker.'
          }
          return true
        },
      },
      {
        name: 'accountId',
        message:
          'What is your Cloudflare account ID? (You can find this at https://dash.cloudflare.com)',
        type: 'input',
        validate: (input: string) => {
          if (input.length === 0) {
            return 'Please enter your Cloudflare account ID.'
          }
          return true
        },
      },
    ],
  )

  console.error('\n🔨 Updating wrangler.toml')
  let parsedConfig = parse(fs.readFileSync(prodWorkerConfig, 'utf8'), '1.0')
  parsedConfig.name = answer.workerName
  parsedConfig.account_id = answer.accountId

  console.error('🔨 Writing wrangler.toml')
  await fs.writeFile(
    prodWorkerConfig,
    // @ts-ignore
    stringify(parsedConfig, { newline: '\n' }),
  )

  console.error('\n🎉 Done!')

  console.error('\nAvailable commands:')
  console.error('npm run dev - Starts the development server')
  console.error('npm run build - Builds the monorepo')
  console.error('npm run lint - Lints the monorepo')
  console.error('npm run format - Formats the monorepo')
  console.error('npm run typecheck - Typechecks the monorepo')
  console.error('npm run new:do - Creates a new Durable Object class file')
}

run().catch(e => {
  console.error(e)
  process.exit(1)
})

export {}
