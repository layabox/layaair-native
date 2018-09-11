"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppCommand = require("./appCommand");
const fs = require("fs");
exports.command = 'removeres';
exports.describe = '删除app缓存资源';
exports.builder = {
    path: {
        default: '.',
        required: false,
        requiresArg: true,
        description: 'native项目路径'
    }
};
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
        let appPath = AppCommand.AppCommand.getAppPath(nativePath, AppCommand.PLATFORM_IOS);
        if (fs.existsSync(appPath)) {
            cmd.excuteRemoveRes(appPath);
        }
        appPath = AppCommand.AppCommand.getAppPath(nativePath, AppCommand.PLATFORM_IOS_WKWEBVIEW);
        if (fs.existsSync(appPath)) {
            cmd.excuteRemoveRes(appPath);
        }
        appPath = AppCommand.AppCommand.getAppPath(nativePath, AppCommand.PLATFORM_ANDROID_ECLIPSE);
        if (fs.existsSync(appPath)) {
            cmd.excuteRemoveRes(appPath);
        }
        appPath = AppCommand.AppCommand.getAppPath(nativePath, AppCommand.PLATFORM_ANDROID_STUDIO);
        if (fs.existsSync(appPath)) {
            cmd.excuteRemoveRes(appPath);
        }
        console.log('请继续......');
    }
    catch (error) {
        if (error.code === 'EPERM') {
            console.log('错误：文件已经被使用或被其他程序打开');
        }
        console.log();
        console.log(error.name);
        console.log(error.message);
    }
};
