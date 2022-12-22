"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const createAppCommand_1 = require("./createAppCommand");
const AppCommand = require("./appCommand");
const path = require("path");
module.exports = {
    createapp: (folder, sdk, version, platform, type, url, name, app_name, package_name, path) => {
        var args = {
            folder: folder,
            sdk: sdk,
            version: version,
            platform: platform,
            type: type,
            url: url,
            name: name,
            app_name: app_name,
            package_name: package_name,
            path: path
        };
        return (0, createAppCommand_1.handler)(args);
    },
    refreshres: (platform, path, url) => {
        var args = {
            platform: platform,
            path: path,
            url: url
        };
        (0, createAppCommand_1.handler)(args);
    },
    removeres: (path) => {
        var args = {
            path: path
        };
        (0, createAppCommand_1.handler)(args);
    },
    listversions: AppCommand.getServerJSONConfig,
    downloadsdk: (ver) => {
        let zip = path.join(AppCommand.AppCommand.getSDKRootPath(), ver + '.zip');
    },
    isSDKExist: (ver) => __awaiter(void 0, void 0, void 0, function* () {
        let sdkVersionConfig = yield AppCommand.getServerJSONConfig(AppCommand.VERSION_CONFIG_URL + '?' + Math.random());
        if (!sdkVersionConfig) {
            return false;
        }
        let found = false;
        let index;
        for (let i = 0; i < sdkVersionConfig.versionList.length; i++) {
            if (sdkVersionConfig.versionList[i].version === ver) {
                found = true;
                index = i;
                break;
            }
        }
        if (!found) {
            return false;
        }
        return AppCommand.AppCommand.isSDKExists(ver, sdkVersionConfig.versionList[index].md5);
    }),
    getSDKRootPath: () => {
        return AppCommand.AppCommand.getSDKRootPath();
    },
    unzipAsync: (zipfile, outfile, cb) => {
        AppCommand.unzipAsync(zipfile, outfile, cb);
    }
};
