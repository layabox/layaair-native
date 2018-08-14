#!/usr/bin/env node
if (process.argv.length === 2) {
  console.log();
  console.log('用法：');
  console.log('   layanative createapp [OPTIONS]');
  console.log('   layanative refreshres [OPTIONS]');
  console.log('   layanative removeres [OPTIONS]');
  console.log('   layanative listversions');
  console.log('描述：');
  console.log('   createapp');
  console.log('       创建一个runtime项目。');
  console.log('       具体帮助信息用 layanative createapp --help 查看。');
  console.log('   refreshres');
  console.log('       刷新当前目录对应的项目的资源。');
  console.log('       具体帮助信息用 layanative refreshres --help 查看。');
  console.log('   removeres');
  console.log('       删除当前目录对应的项目的资源。');
  console.log('       具体帮助信息用 layanative removeres --help 查看。');
  console.log('   listversions');
  console.log('       列出所有可用SDK版本。');
  console.log('       具体帮助信息用 layanative listversions --help 查看。');
  return;
}
if (process.argv.length > 2 && process.argv[2] !== 'createapp' &&　process.argv[2] !== 'refreshres'　&& process.argv[2] !== 'removeres' && process.argv[2] !== 'listversions'){
  console.log('错误： 命令 ' + process.argv[2] + ' 不存在，请重新输入');
}
require('yargs')
  .command(require('./createAppCommand'))
  .command(require('./refreshResCommand'))
  .command(require('./removeResCommand'))
  .command(require('./listVersionsCommand'))
  .locale('zh_CN')
  .help()
  .argv
