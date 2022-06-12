import fs from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'

function format(str: string) {
  let lowercase = str.toLowerCase()
  let uppercase = str.toUpperCase()

  return {
    capitalize: lowercase.charAt(0).toUpperCase() + lowercase.slice(1),
    lowercase,
    uppercase,
  }
}

async function run() {
  let answer = await inquirer.prompt<{ name: string }>([
    {
      name: 'name',
      type: 'input',
      message: 'What is the name of the Durable Object?',
      validate: (input: string) => {
        if (input.length === 0) {
          return 'Please enter a name for the Durable Object.'
        }
        return true
      },
    },
  ])
  let { capitalize, lowercase, uppercase } = format(answer.name)
  let projectName = `${lowercase}-do`
  let outputDir = path.join(process.cwd(), `packages/${projectName}`)
  if (fs.existsSync(outputDir)) {
    console.error(`\n🚨 Directory '${outputDir}' already exists.\n`)
    throw new Error(`Directory ${outputDir} already exists.`)
  }
  await fs.mkdirp(outputDir)

  let baseDir = path.join(process.cwd(), 'scripts/new-do')
  let [eslintrc, packageJson, tsconfig] = await Promise.all([
    fs.readFile(path.join(baseDir, 'tmp-eslintrc.js'), 'utf8'),
    fs.readFile(path.join(baseDir, 'tmp-package.json'), 'utf8'),
    fs.readFile(path.join(baseDir, 'tmp-tsconfig.json'), 'utf8'),
  ])
  let parsedPackageJson = JSON.parse(packageJson)
  parsedPackageJson.name = projectName
  let index = `export default class ${capitalize}DurableObject {
  constructor(private state: DurableObjectState) {}
}
  `
  await Promise.all([
    fs.writeFile(path.join(outputDir, '.eslintrc.js'), eslintrc),
    fs.writeFile(
      path.join(outputDir, 'package.json'),
      JSON.stringify(parsedPackageJson, null, 2),
    ),
    fs.writeFile(path.join(outputDir, 'tsconfig.json'), tsconfig),
    fs.writeFile(path.join(outputDir, 'index.ts'), index),
  ])

  console.error(`\n🔨 Created ${projectName} package.\n
Now we need to add the Durable Objects bindings to your worker configuration file.
1. Open 'package.json' of 'packages/worker', and add the following to the 'dependencies' section:\n
  "${projectName}": "*"\n
2. Open 'packages/worker/wrangler.toml' and add the following to the 'durable_objects' section:\n
  {name = "${uppercase}", class_name = "${capitalize}DurableObject"}\n
3. Open 'packages/worker/wrangler.dev.toml' and add the following to the 'durable_objects' section:\n
  {name = "${uppercase}", class_name = "${capitalize}DurableObject"}\n
4. We also need to add a migration for the Durable Object in the 'migrations' section of 'packages/worker/wrangler.toml' and as well as 'packages/worker/wrangler.dev.toml'.\n
  [[migrations]]
    tag = "vx"
    new_classes = ["${capitalize}DurableObject"]\n
5. Now, open 'packages/worker/src/index.ts' and add the following export at the top of the file.\n
  export { default as ${capitalize}DurableObject } from '${projectName}'\n
6. Great, just one last thing. Open 'config/cloudflare-env/index.d.ts' and add the following for types\n
  ${uppercase}: DurableObjectNamespace\n
6. Now from the project root run 'npm install'
`)

  console.error(
    `\n🚨 Be sure to checkout the instructions specified above\n🎉  Successfully created "${projectName}"`,
  )

  console.error(
    `\ncd ${path.relative(
      process.cwd(),
      path.join(outputDir, 'index.ts'),
    )} and create awsome things!\n`,
  )
  console.error(
    'Visit https://developers.cloudflare.com/workers/learning/using-durable-objects/ for more information.',
  )
}

run().catch(e => {
  console.error(e)
  process.exit(1)
})

export {}
