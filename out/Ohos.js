"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OhosTools = exports.BaseTools = void 0;
const fs = require("fs");
const path = require("path");
const JSON5 = require("json5");
const appCommand_1 = require("./appCommand");
const FileUtils_1 = require("./FileUtils");
class BaseTools {
    checkURL(url) {
        return true;
    }
    readJSONSync(file) {
        if (!fs.existsSync(file)) {
            console.log('错误: 找不到文件 ' + file);
            return null;
        }
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
    writeJSONSync(file, data, spaces) {
        fs.writeFileSync(file, JSON.stringify(data, null, spaces));
    }
    readJSON5Sync(file) {
        if (!fs.existsSync(file)) {
            console.log('错误: 找不到文件 ' + file);
            return null;
        }
        return JSON5.parse(fs.readFileSync(file, 'utf-8'));
    }
    writeJSON5Sync(file, data, spaces) {
        fs.writeFileSync(file, JSON5.stringify(data, null, spaces));
    }
    get standAloneUrl() {
        return appCommand_1.NATIVE_STAND_ALONE_URL;
    }
}
exports.BaseTools = BaseTools;
class OhosTools extends BaseTools {
    checkURL(url) {
        return true;
    }
    excuteCreateApp(folder, sdk, platform, type, url, name, app_name, package_name, outputPath) {
        if (type !== 2 && !this.checkURL(url)) {
            return false;
        }
        if (type > 0 && !fs.existsSync(folder)) {
            console.log('错误: 找不到目录 ' + folder);
            return false;
        }
        let appPath = appCommand_1.AppCommand.getAppPath(appCommand_1.AppCommand.getNativePath(path.join(outputPath, name)), platform);
        let srcPath = path.join(sdk, platform);
        FileUtils_1.FileUtils.copyFolderRecursiveSync(srcPath, path.dirname(appPath));
        if (type > 0) {
            FileUtils_1.FileUtils.processDcc({
                res: {
                    path: OhosTools.Cache_Path,
                }
            }, folder, url, appPath);
        }
        this.replaceUrl(url, appPath, type);
        const cfgFile = path.join(appPath, 'AppScope/app.json5');
        let configJSON = this.readJSON5Sync(cfgFile);
        configJSON.app.bundleName = package_name;
        this.writeJSONSync(cfgFile, configJSON, 4);
        const packageJsonPath = path.join(appPath, 'oh-package.json5');
        const packageJson = this.readJSONSync(packageJsonPath);
        packageJson.name = app_name;
        this.writeJSONSync(packageJsonPath, packageJson, 4);
        const appScopeStringJSONPath = path.join(appPath, 'AppScope/resources/base/element/string.json');
        const appScopeStringJSON = this.readJSONSync(appScopeStringJSONPath);
        appScopeStringJSON.string.find((item) => item.name === 'app_name').value = app_name;
        this.writeJSONSync(appScopeStringJSONPath, appScopeStringJSON, 2);
        const stringJSONPath = path.join(appPath, 'entry/src/main/resources/base/element/string.json');
        const stringJSON = this.readJSONSync(stringJSONPath);
        stringJSON.string.find((item) => item.name === 'MainAbility_label').value = app_name;
        this.writeJSONSync(stringJSONPath, stringJSON, 2);
        let nativeJSONPath = appCommand_1.AppCommand.getNativeJSONPath(path.join(outputPath, name));
        let nativeJSON = { h5: folder ? folder : '' };
        FileUtils_1.FileUtils.mkdirsSync(path.dirname(nativeJSONPath));
        fs.writeFileSync(nativeJSONPath, JSON.stringify(nativeJSON));
        return true;
    }
    excuteRefreshRes(folder, url, appPath) {
        FileUtils_1.FileUtils.processDcc({
            res: {
                path: OhosTools.Cache_Path,
            }
        }, folder, url, appPath);
        return true;
    }
    replaceUrl(url, appPath, type) {
        let enterSourceFile = path.join(appPath, OhosTools.Enter_Source_File);
        let standAlone = type === 2 ? true : false;
        if (standAlone) {
            url = this.standAloneUrl;
        }
        let rs = fs.readFileSync(enterSourceFile, 'utf-8');
        rs = rs.replace(OhosTools.indexJS, url);
        rs = rs.replace(OhosTools.localizable, standAlone ? 'true' : 'false');
        fs.writeFileSync(enterSourceFile, rs);
    }
}
exports.OhosTools = OhosTools;
OhosTools.Cache_Path = 'entry/src/main/resources/rawfile/cache';
OhosTools.Enter_Source_File = 'entry/src/main/ets/MainAbility/MainAbility.ts';
OhosTools.indexJS = new RegExp("(?<=laya\\.ConchNAPI_configSetURL\\(\\s*\\')(.*)(?=\\'\\))");
OhosTools.localizable = new RegExp("(?<=ConchNAPI_setLocalizable\\(\\s*)true(?=\\s*\\))");
