"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppCommand = require("./appCommand");
const path = require("path");
exports.command = 'createapp';
exports.describe = '创建app项目';
exports.builder = {
    folder: {
        alias: 'f',
        required: false,
        requiresArg: true,
        description: '资源路径：把游戏资源打包进客户端以减少网络下载,选择本地\n的游戏目录，例如启动index在d:/game/index.html下,那资源路径就是d:/game。t为0时可不填'
    },
    path: {
        default: '.',
        required: false,
        requiresArg: true,
        description: 'native项目输出路径'
    },
    version: {
        alias: 'v',
        required: false,
        requiresArg: true,
        description: 'SDK版本：自动使用特定版本的SDK，系统会从服务器下载SDK并存放在特定位置。--version和--sdk互相矛盾不能同时指定，都不指定时默认使用最新版本的SDK'
    },
    platform: {
        alias: 'p',
        default: AppCommand.PLATFORM_ALL,
        choices: [AppCommand.PLATFORM_ALL, AppCommand.PLATFORM_IOS_WKWEBVIEW, AppCommand.PLATFORM_IOS, AppCommand.PLATFORM_ANDROID_ECLIPSE, AppCommand.PLATFORM_ANDROID_STUDIO],
        required: false,
        requiresArg: true,
        description: '项目平台'
    },
    type: {
        alias: 't',
        default: 0,
        choices: [0, 1, 2],
        required: false,
        requiresArg: true,
        description: '创建类型：0: 不打资源包 1: 打资源包 2: 单机版本'
    },
    url: {
        alias: 'u',
        required: false,
        requiresArg: true,
        description: '游戏地址：当t为0或者1的时候，必须填，当t为2的时候，不用填写'
    },
    name: {
        alias: 'n',
        default: 'LayaBox',
        required: false,
        requiresArg: true,
        description: '项目名称：native项目的名称'
    },
    app_name: {
        alias: 'a',
        default: 'LayaBox',
        required: false,
        requiresArg: true,
        description: '应用名称：app安装到手机后显示的名称'
    },
    package_name: {
        default: 'com.layabox.game',
        required: false,
        requiresArg: true,
        description: '包名'
    },
    sdk: {
        alias: 's',
        required: false,
        requiresArg: true,
        description: 'SDK本地目录：自定义的SDK目录，可选参数。一般情况下建议使用参数—version。'
    }
};
exports.handler = function (argv) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let cmd = new AppCommand.AppCommand();
            if (argv.type > 0 && !argv.folder) {
                console.log('错误：缺少参数-f');
                return;
            }
            let folder = argv.folder ? (path.isAbsolute(argv.folder) ? argv.folder : path.join(process.cwd(), argv.folder)) : argv.folder;
            let sdk;
            if (argv.sdk && argv.version) {
                console.log('错误：参数 --sdk 和 --version 不能同时指定两个');
                return;
            }
            else if (argv.sdk) {
                sdk = argv.sdk;
            }
            else {
                let sdkVersionConfig = yield AppCommand.getServerJSONConfig(AppCommand.VERSION_CONFIG_URL + '?' + Math.random());
                if (!sdkVersionConfig) {
                    return;
                }
                if (!argv.sdk && !argv.version) {
                    if (!AppCommand.AppCommand.isSDKExists(sdkVersionConfig.versionList[0].version)) {
                        let zip = path.join(AppCommand.AppCommand.getSDKRootPath(), path.basename(sdkVersionConfig.versionList[0].url));
                        yield AppCommand.download(sdkVersionConfig.versionList[0].url, zip, function () {
                            AppCommand.unzip(zip, path.dirname(zip), function (error, stdout, stderr) {
                                if (error) {
                                    console.log(error.name);
                                    console.log(error.message);
                                    console.log(error.stack);
                                }
                            });
                        });
                    }
                    sdk = AppCommand.AppCommand.getSDKPath(sdkVersionConfig.versionList[0].version);
                }
                else {
                    let found = false;
                    let index;
                    for (let i = 0; i < sdkVersionConfig.versionList.length; i++) {
                        if (sdkVersionConfig.versionList[i].version === argv.version) {
                            found = true;
                            index = i;
                            break;
                        }
                    }
                    if (!found) {
                        console.log('错误：版本 ' + argv.version + ' 服务器找不到');
                        return;
                    }
                    if (!AppCommand.AppCommand.isSDKExists(argv.version)) {
                        let zip = path.join(AppCommand.AppCommand.getSDKRootPath(), path.basename(sdkVersionConfig.versionList[index].url));
                        yield AppCommand.download(sdkVersionConfig.versionList[index].url, zip, function () {
                            AppCommand.unzip(zip, path.dirname(zip), function (error, stdout, stderr) {
                                if (error) {
                                    console.log(error.name);
                                    console.log(error.message);
                                    console.log(error.stack);
                                }
                            });
                        });
                    }
                    sdk = AppCommand.AppCommand.getSDKPath(argv.version);
                }
            }
            if (argv.type === 2 && argv.url) {
                console.log("警告： 单机版不需要参数url");
            }
            if (argv.type === 0 || argv.type === 1) {
                if (!argv.url || argv.url === '') {
                    console.log('错误：缺少参数--url');
                    return;
                }
                if (argv.url === AppCommand.STAND_ALONE_URL) {
                    console.log('错误：请提供有效参数--url');
                    return;
                }
            }
            if (argv.url.indexOf('.html') != -1) {
                console.log('错误：URL不支持.html文件，请使用.json文件或.js文件');
                return;
            }
            if (argv.platform === AppCommand.PLATFORM_ALL) {
                cmd.excuteCreateApp(folder, sdk, AppCommand.PLATFORM_IOS, argv.type, argv.url, argv.name, argv.app_name, argv.package_name, argv.path);
                cmd.excuteCreateApp(folder, sdk, AppCommand.PLATFORM_IOS_WKWEBVIEW, argv.type, argv.url, argv.name, argv.app_name, argv.package_name, argv.path);
                cmd.excuteCreateApp(folder, sdk, AppCommand.PLATFORM_ANDROID_ECLIPSE, argv.type, argv.url, argv.name, argv.app_name, argv.package_name, argv.path);
                cmd.excuteCreateApp(folder, sdk, AppCommand.PLATFORM_ANDROID_STUDIO, argv.type, argv.url, argv.name, argv.app_name, argv.package_name, argv.path);
            }
            else {
                cmd.excuteCreateApp(folder, sdk, argv.platform, argv.type, argv.url, argv.name, argv.app_name, argv.package_name, argv.path);
            }
            console.log('请继续......');
        }
        catch (error) {
            console.log();
            if (error.code === 'ETIMEDOUT') {
                console.log('错误：网络连接超时');
            }
            console.log(error.name);
            console.log(error.message);
        }
    });
};
