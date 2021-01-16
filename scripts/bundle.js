const { join } = require('path')
const AdmZip = require('adm-zip')
const fs = require('fs-extra')
const { promisify } = require('util')

function generateInfo() {
  return {
    identifier: 'dev.royli.bob-plugin-deepl-translate',
    category: 'translate',
    name: 'DeepL Translate',
    summary: '',
    icon: '115',
    author: 'Roy Li',
    homepage: 'https://github.com/geekdada/bob-plugin-deepl-translate.git',
    appcast:
      'https://github.com/geekdada/bob-plugin-deepl-translate/raw/master/appcast.json',
    minBobVersion: '0.5.0',
    options: [
      {
        identifier: 'token',
        type: 'text',
        title: 'Token',
        defaultValue: 'Custom server may do not need',
      },
      {
        identifier: 'custom_provider',
        type: 'text',
        title: 'Custom server',
        defaultValue: 'http://127.0.0.1:1337',
      },
      {
        identifier: 'provider',
        type: 'menu',
        title: 'API',
        defaultValue: 'custom',
        menuValues: [
          {
            title: 'DeepL',
            value: 'deepl',
          },
          {
            title: 'A Translator',
            value: 'a-translator',
          },
          {
            title: 'A Translator (Global)',
            value: 'a-translator-cf',
          },
          {
            title: 'Custom Server',
            value: 'custom',
          },
          ...(process.env.NODE_ENV === 'development'
            ? [
                {
                  title: 'Local',
                  value: 'local',
                },
              ]
            : []),
        ],
      },
      {
        identifier: 'formality',
        type: 'menu',
        title: 'Formality',
        defaultValue: 'default',
        menuValues: [
          {
            title: 'Default',
            value: 'default',
          },
          {
            title: 'More formal',
            value: 'more',
          },
          {
            title: 'More informal',
            value: 'less',
          },
        ],
      },
    ],
  }
}

async function main() {
  const pkgName = 'bob-plugin-deepl-translate'
  const version = require('../package.json').version
  const buildDir = join(__dirname, '../build')
  const releaseDir = join(__dirname, '../release')
  const pkg = join(releaseDir, `${pkgName}.bobplugin`)
  const info = {
    ...generateInfo(),
    version,
  }

  await fs.writeJson(join(buildDir, 'info.json'), info)

  const zip = new AdmZip()
  zip.addLocalFolder(buildDir)
  await promisify(zip.writeZip)(pkg)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
