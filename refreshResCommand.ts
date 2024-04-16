import * as AppCommand from './appCommand';
import * as fs from 'fs';
import * as path from 'path';


exports.command = 'refreshres';
exports.describe = '刷新app项目资源'
exports.builder = {
  platform:
  {
    alias: 'p',
    default: AppCommand.PLATFORM_ALL,
    choices: [AppCommand.PLATFORM_ALL, , AppCommand.PLATFORM_IOS_WKWEBVIEW, AppCommand.PLATFORM_IOS, AppCommand.PLATFORM_ANDROID_ECLIPSE, AppCommand.PLATFORM_ANDROID_STUDIO, AppCommand.PLATFORM_OHOS],
    required: false,
    requiresArg: true,
    description: '项目平台'
  },
  path: {
    default: '.',
    required: false,
    requiresArg: true,
    description: 'native项目路径'
  },
  url:
  {
    alias: 'u',
    required: false,
    requiresArg: true,
    description: '游戏地址'
  }
}

exports.handler = function (argv) {
  try {
    let cmd = new AppCommand.AppCommand();

    let nativeJSONPath = null;
    let nativePath = null;
    nativePath = AppCommand.AppCommand.getNativePath(argv.path);
    nativeJSONPath = AppCommand.AppCommand.getNativeJSONPath(argv.path);

    if (!fs.existsSync(nativePath)) {
      console.log('错误: 找不到目录 ' + nativePath);
      return;
    }

    if (!fs.existsSync(nativeJSONPath)) {
      console.log('错误: 找不到文件 ' + nativeJSONPath + "，无效的native项目路径");
      return;
    }

    let nativeJSON =  JSON.parse( fs.readFileSync(nativeJSONPath,'utf8'));

    if (!nativeJSON) {
      console.log('错误: 文件 ' + nativeJSONPath + ' 无效');
      return;
    }

    if (nativeJSON.h5 === '') {
      console.log('错误: 资源目录为空，刷新失败');
      return;
    }

    let folder = nativeJSON.h5;

    if (argv.platform === AppCommand.PLATFORM_ALL) {
      cmd.excuteRefreshRes(folder, argv.url, nativePath,AppCommand.PLATFORM_IOS);
      cmd.excuteRefreshRes(folder, argv.url, nativePath, AppCommand.PLATFORM_ANDROID_ECLIPSE);
      cmd.excuteRefreshRes(folder, argv.url, nativePath, AppCommand.PLATFORM_ANDROID_STUDIO);
      cmd.excuteRefreshRes(folder, argv.url, nativePath, AppCommand.PLATFORM_OHOS);
    }
    else {
      cmd.excuteRefreshRes(folder, argv.url, nativePath, argv.platform);
    }
    console.log('请继续......');
  }
  catch (error) {
    console.log();
    if (error.code === 'EPERM') {
      console.log('错误：文件已经被使用或被其他程序打开');
    }
    console.log(error.name);
    console.log(error.message);
  }
}