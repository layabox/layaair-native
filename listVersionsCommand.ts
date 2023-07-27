import * as AppCommand from './appCommand';
import * as fs from 'fs';
exports.command = 'listversions'
exports.describe = '列出所有SDK版本'

exports.handler = async function (argv) {
  try {
    let sdkVersionConfig = await AppCommand.getServerJSONConfig(AppCommand.VERSION_CONFIG_URL + '?' + Math.random());
    if (!sdkVersionConfig) {
      return;
    }
    console.log();
    for (let i = 0; i < sdkVersionConfig.versionList.length; i++) {
      console.log(' ' + sdkVersionConfig.versionList[i].version);
    }
    console.debug('请继续......');
  }
  catch (error) {
    console.error();
    console.error(error.name);
    console.error(error.message);
  }
}