"use strict";
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
        return createAppCommand_1.handler(args);
    },
    refreshres: (platform, path, url) => {
        var args = {
            platform: platform,
            path: path,
            url: url
        };
        createAppCommand_1.handler(args);
    },
    removeres: (path) => {
        var args = {
            path: path
        };
        createAppCommand_1.handler(args);
    },
    listversions: AppCommand.getServerJSONConfig,
    downloadsdk: (ver) => {
        let zip = path.join(AppCommand.AppCommand.getSDKRootPath(), ver + '.zip');
    },
    isSDKExist: (ver) => {
        return AppCommand.AppCommand.isSDKExists(ver);
    },
    getSDKRootPath: () => {
        return AppCommand.AppCommand.getSDKRootPath();
    },
    unzipAsync: (zipfile, outfile, cb) => {
        AppCommand.unzipAsync(zipfile, outfile, cb);
    }
};
