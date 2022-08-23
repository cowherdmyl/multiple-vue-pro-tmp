#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const shell = require('shelljs')
const inquirer = require('inquirer')
const program = require('commander')
const logger = require('./utils/logger')

// src所在绝对路径
const srcDir = path.resolve(shell.pwd().toString(), './src')

program
  .version('0.1.0')
  .option('--projectName <projectName>', 'Create a new project', 'none')
  .parse(process.argv)

const { projectName } = program
const srcList = shell.ls('./src')
if (srcList.includes(projectName)) {
  logger.error(`目录已存在：${path.resolve(srcDir, projectName)}`)
  return shell.exit(0)
}
inquirer.prompt([
  {
    type: 'input',
    name: 'activityName',
    message: '请输入活动名称',
    validate: value => value.trim() !== ''
  },
  {
    type: 'input',
    name: 'description',
    message: '请输入活动描述',
    validate: value => value.trim() !== ''
  },
  {
    type: 'input',
    name: 'PM',
    message: '请输入产品经理（如有多个逗号隔开）',
    validate: value => value.trim() !== ''
  },
  {
    type: 'input',
    name: 'developer',
    message: '请输入开发人员（如有多个逗号隔开）',
    validate: value => value.trim() !== ''
  },
  {
    type: 'list',
    name: 'cssUnit',
    message: 'css适配方案',
    default: 'vw',
    choices: ['vw', 'rem', 'none']
  }
])
  .then(args => {
    const { activityName, description, PM, developer, cssUnit } = args
    // 处理多个开发者
    const developers = developer.replace(/[,，|]/g, '|').split('|').join('\n+ ').trim()
    // 处理多个产品经理
    const PMs = PM.replace(/[,，|]/g, '|').split('|').join('\n+ ').trim()
    // 目标路径
    const targetPath = path.resolve(srcDir, projectName)
    // 复制整个文件夹
    shell.cp('-R', 'scripts/template', targetPath)

    // 修改package.json
    let data = fs
      .readFileSync(`${targetPath}/package.json`)
      .toString()
      .replace('__PROJECT_NAME__', projectName)
      .replace('__DESCRIPTION__', description)
    fs.writeFile(`${targetPath}/package.json`, data)

    // 修改main.js
    data = fs
      .readFileSync(`${targetPath}/main.js`)
      .toString()
      .replace('__USE_REM__\n', cssUnit === 'rem' ? `import 'amfe-flexible'\n` : '')
    fs.writeFile(`${targetPath}/main.js`, data)

    // 修改README.md
    data = fs
      .readFileSync(`${targetPath}/README.md`)
      .toString()
      .replace('__ACTIVITY_NAME__', activityName)
      .replace('__DEVELOPER__', developers)
      .replace('__PM__', PMs)
      .replace('__DESCRIPTION__', description)
    fs.writeFile(`${targetPath}/README.md`, data)

    // 修改project.config.js
    data = fs
      .readFileSync(`${targetPath}/project.config.js`)
      .toString()
      .replace('__CSS_UNIT__', cssUnit)
    fs.writeFile(`${targetPath}/project.config.js`, data)

    logger.done('项目创建成功')
  })
