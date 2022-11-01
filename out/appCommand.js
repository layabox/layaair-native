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
exports.isStandAloneUrl = exports.getStandAloneUrl = exports.checkURL = exports.unzipAsync = exports.unzip = exports.download = exports.getServerJSONConfig = exports.AppCommand = exports.CODE_DIR_NAME = exports.H5_PROJECT_CONFIG_FILE = exports.PLATFORM_ANDROID_STUDIO = exports.PLATFORM_IOS = exports.PLATFORM_ALL = exports.NATIVE_JSON_FILE_NAME = exports.DEFAULT_TYPE = exports.DEFAULT_PACKAGE_NAME = exports.DEFAULT_APP_NAME = exports.DEFAULT_NAME = exports.VERSION_CONFIG_URL = exports.NATIVE_STAND_ALONE_URL = void 0;
const fs = require("fs");
const path = require("path");
const gen_dcc = require("layadcc");
const request = require("request");
const child_process = require("child_process");
const xmldom = require("xmldom");
const ProgressBar = require("progress");
exports.NATIVE_STAND_ALONE_URL = 'http://stand.alone.version/index.js';
exports.VERSION_CONFIG_URL = 'https://www.layabox.com/layanative3.0/layanativeRes/versionconfig.json';
exports.DEFAULT_NAME = 'LayaBox';
exports.DEFAULT_APP_NAME = 'LayaBox';
exports.DEFAULT_PACKAGE_NAME = 'com.layabox.conch';
exports.DEFAULT_TYPE = 0;
exports.NATIVE_JSON_FILE_NAME = 'native.json';
exports.PLATFORM_ALL = 'all';
exports.PLATFORM_IOS = 'ios';
exports.PLATFORM_ANDROID_STUDIO = 'android';
exports.H5_PROJECT_CONFIG_FILE = 'config.json';
exports.CODE_DIR_NAME = 'Conch';
function mkdirsSync(dirname, mode) {
    if (fs.existsSync(dirname)) {
        return true;
    }
    else {
        if (mkdirsSync(path.dirname(dirname), mode)) {
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
    return false;
}
function copyFileSync(source, target) {
    var targetFile = target;
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}
function copyFolderRecursiveSync(source, target) {
    var files = [];
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        mkdirsSync(targetFolder);
    }
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            }
            else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}
function rmdirSync(dir) {
    function iterator(url, dirs) {
        var stat = fs.statSync(url);
        if (stat.isDirectory()) {
            dirs.unshift(url);
            inner(url, dirs);
        }
        else if (stat.isFile()) {
            fs.unlinkSync(url);
        }
    }
    function inner(path, dirs) {
        var arr = fs.readdirSync(path);
        for (var i = 0, el; el = arr[i++];) {
            iterator(path + "/" + el, dirs);
        }
    }
    var dirs = [];
    try {
        iterator(dir, dirs);
        dirs.forEach((v) => { fs.rmdirSync(v); });
    }
    catch (e) {
    }
}
;
class AppCommand {
    constructor() {
    }
    excuteRefreshRes(folder, url, appPath) {
        if (!fs.existsSync(folder)) {
            console.log('错误: 找不到目录 ' + folder);
            return false;
        }
        var me = this;
        if (!fs.existsSync(appPath)) {
            console.log("警告: 找不到目录 " + appPath);
            return false;
        }
        let configPath = path.join(appPath, "config.json");
        if (!fs.existsSync(configPath)) {
            console.log('错误: 找不到文件 ' + configPath);
            return false;
        }
        let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (!config) {
            console.log('错误: 读取文件 ' + configPath + ' 失败');
            return false;
        }
        if (fs.existsSync(path.join(appPath, config["res"]["path"], 'stand.alone.version'))) {
            if (url === '' || url === undefined) {
                url = config["platform"] ? getStandAloneUrl(config["platform"]) : exports.NATIVE_STAND_ALONE_URL;
                console.log('您正在打包单机版...');
            }
            else {
                if (isStandAloneUrl(url)) {
                    console.log('您正在打包单机版...');
                }
                else {
                    console.log('您正在从单机版地址切换到网络版,请注意修改相关代码...');
                }
            }
        }
        else {
            if (url === '' || url === undefined) {
                console.log('错误: 缺少参数url，请重新输入 ');
                return false;
            }
            else {
                if (isStandAloneUrl(url)) {
                    console.log('您正在从网络版地址切换到单机版,请注意修改相关代码...');
                }
                else {
                    console.log('您正在打包网络版...');
                }
            }
        }
        console.log("REPLACE rmdir1 " + path.join(appPath, config["res"]["path"]));
        rmdirSync(path.join(appPath, config["res"]["path"]));
        this.processDcc(config, folder, url, appPath);
        return true;
    }
    excuteRemoveRes(appPath) {
        let configPath = path.join(appPath, "config.json");
        if (!fs.existsSync(appPath)) {
            console.log("警告: 找不到目录 " + appPath);
            return false;
        }
        if (!fs.existsSync(configPath)) {
            console.log('错误: 找不到文件 ' + configPath);
            return false;
        }
        console.log('REPLACE readjson2 ' + configPath);
        let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (!config) {
            console.log('错误: 读取文件 ' + configPath + ' 失败');
            return false;
        }
        let dir = path.join(appPath, config["res"]["path"]);
        console.log('正在删除 ' + dir + ' ...');
        console.log('REPLACE emptydir1 ' + dir);
        rmdirSync(dir);
        mkdirsSync(dir);
        return true;
    }
    excuteCreateApp(folder, sdk, platform, type, url, name, app_name, package_name, outputPath) {
        if (type !== 2 && !checkURL(url, platform)) {
            return false;
        }
        if (type > 0 && !fs.existsSync(folder)) {
            console.log('错误: 找不到目录 ' + folder);
            return false;
        }
        var me = this;
        let srcCodePath = path.join(sdk, exports.CODE_DIR_NAME);
        let appPath = AppCommand.getAppPath(AppCommand.getNativePath(path.join(outputPath, name)), platform);
        let absCfgPath = path.join(path.join(sdk, platform), "config.json");
        let relCfgPath = path.join(path.join(process.cwd(), sdk, platform), "config.json");
        let configPath = path.isAbsolute(sdk) ? absCfgPath : relCfgPath;
        if (!fs.existsSync(configPath)) {
            console.log('错误: 找不到文件 ' + configPath + '。不是有效的SDK目录');
            return false;
        }
        console.log('REPLACE  readjson2', configPath);
        let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (!config) {
            console.log('错误: 读取文件 ' + configPath + ' 失败');
            return false;
        }
        if (fs.existsSync(appPath)) {
            console.log("错误： 项目 " + appPath + " 已经存在");
            return false;
        }
        let destCodePath = path.join(appPath, exports.CODE_DIR_NAME);
        if (fs.existsSync(destCodePath)) {
        }
        else {
            console.log('copydir ', srcCodePath, path.dirname(appPath));
            copyFolderRecursiveSync(srcCodePath, path.dirname(appPath));
        }
        let srcPath = path.join(sdk, platform);
        console.log('REPLACE copydir1 ', srcPath, path.dirname(appPath));
        copyFolderRecursiveSync(srcPath, path.dirname(appPath));
        if (type === 2) {
            url = getStandAloneUrl(platform);
        }
        this.processUrl(config, type, url, appPath);
        this.processPackageName(config, package_name, appPath);
        if (type > 0) {
            this.processDcc(config, folder, url, appPath);
        }
        this.processDisplayName(config, platform, app_name, appPath);
        this.processName(config, name, appPath);
        let newConfigPath = path.join(appPath, "config.json");
        config["res"]["path"] = config["res"]["path"].replace(config["template"]["name"], name);
        console.log('REPLACE  writejson3 ', newConfigPath);
        var p1 = path.dirname(newConfigPath);
        mkdirsSync(p1);
        fs.writeFileSync(newConfigPath, JSON.stringify(config));
        let nativeJSONPath = AppCommand.getNativeJSONPath(path.join(outputPath, name));
        let nativeJSON = { h5: folder ? folder : '' };
        console.log('REPLACE writeJSON4', nativeJSONPath);
        p1 = path.dirname(nativeJSONPath);
        mkdirsSync(p1);
        fs.writeFileSync(nativeJSONPath, JSON.stringify(nativeJSON));
        return true;
    }
    processUrl(config, type, url, appPath) {
        var me = this;
        if (type === 2) {
            if (config.localize && config.localize.replace) {
                config.localize.replace.forEach((v, i, arr) => {
                    var p = path.join(appPath, v);
                    var s = me.read(p);
                    s = s.replace(new RegExp(config.localize.src, 'g'), config.localize.des);
                    var p1 = path.dirname(p);
                    mkdirsSync(p1);
                    fs.writeFileSync(p, s);
                });
            }
        }
        if (url && url != "") {
            config["url"]["replace"].forEach(function (file) {
                var srcPath = path.join(appPath, file);
                var str = me.read(srcPath);
                str = str.replace(new RegExp(config["url"]["src"]), config["url"]["des"].replace("${url}", url));
                console.log('REPLACE outputfile5', srcPath);
                var p = path.dirname(srcPath);
                mkdirsSync(p);
                fs.writeFileSync(srcPath, str);
            });
        }
    }
    processPackageName(config, package_name, appPath) {
        var me = this;
        if (package_name && package_name != "") {
            config["package"]["replace"].forEach(function (file) {
                var destPath = path.join(appPath, file);
                var str = me.read(destPath);
                str = str.replace(new RegExp(config["package"]["name"], "g"), package_name);
                console.log('REPLACE outfile6', destPath);
                var p = path.dirname(destPath);
                mkdirsSync(p);
                fs.writeFileSync(destPath, str);
            });
        }
    }
    processDcc(config, folder, url, appPath) {
        let res_path = folder;
        if (res_path && res_path != "" && fs.existsSync(res_path)) {
            var outpath = url;
            var index = outpath.indexOf('?');
            if (index > 0) {
                outpath = outpath.substring(0, index);
            }
            index = outpath.lastIndexOf('/');
            if (index > 0) {
                outpath = outpath.substring(0, index);
            }
            outpath = outpath.replace("http://", "");
            outpath = outpath.replace(/:/g, '.');
            outpath = outpath.replace(/\\/g, '_');
            outpath = outpath.replace(/\//g, '_');
            outpath = path.join(config["res"]["path"], outpath);
            outpath = path.join(appPath, outpath);
            if (!fs.existsSync(outpath)) {
                mkdirsSync(outpath);
            }
            console.log('正在执行LayaDcc...');
            gen_dcc.gendcc(res_path, outpath, true, false);
        }
    }
    processDisplayName(config, platform, app_name, appPath) {
        let file = path.join(appPath, config["template"]["display"]);
        let xml = this.read(file);
        let doc = new xmldom.DOMParser().parseFromString(xml);
        if (platform === exports.PLATFORM_IOS) {
            let dictNode = doc.getElementsByTagName('dict')[0];
            let keyNode = doc.createElement("key");
            let keyTextNode = doc.createTextNode("CFBundleDisplayName");
            keyNode.appendChild(keyTextNode);
            dictNode.appendChild(keyNode);
            let stringNode = doc.createElement("string");
            let stringTextNode = doc.createTextNode(app_name);
            stringNode.appendChild(stringTextNode);
            dictNode.appendChild(stringNode);
            dictNode.appendChild(stringNode);
        }
        else {
            let stringNodes = doc.getElementsByTagName('string');
            for (let i = 0; i < stringNodes.length; i++) {
                if (stringNodes[i].attributes.getNamedItem("name").value === "app_name") {
                    stringNodes[i].replaceChild(doc.createTextNode(app_name), stringNodes[i].childNodes[0]);
                    break;
                }
            }
        }
        console.log('REPLACE  outputfile8', file);
        var p1 = path.dirname(file);
        mkdirsSync(p1);
        fs.writeFileSync(file, doc.toString());
    }
    processName(config, name, appPath) {
        var me = this;
        config["template"]["replace"].forEach(function (file) {
            var srcPath = path.join(appPath, file);
            var str = me.read(srcPath);
            str = str.replace(new RegExp(config["template"]["name"], "g"), name);
            console.log('REPLACE outputfile9 ' + srcPath);
            var p = path.dirname(srcPath);
            mkdirsSync(p);
            fs.writeFileSync(srcPath, str);
        });
        config["template"]["rename"].forEach(function (file) {
            var oldPath = path.join(appPath, file);
            var newPath = path.join(appPath, file);
            var dir_name = path.dirname(newPath);
            var base_name = path.basename(newPath);
            var new_base_name = base_name.replace(config["template"]["name"], name);
            newPath = path.join(dir_name, new_base_name);
            fs.renameSync(oldPath, newPath);
        });
    }
    static getAppPath(dir, platform) {
        if (path.isAbsolute(dir))
            return path.join(dir, platform);
        return path.join(process.cwd(), dir, platform);
    }
    static getNativeJSONPath(dir) {
        return path.join(this.getNativePath(dir), exports.NATIVE_JSON_FILE_NAME);
    }
    static getNativePath(dir) {
        if (path.isAbsolute(dir))
            return dir;
        return path.join(process.cwd(), dir);
    }
    static getAppDataPath() {
        let dataPath;
        if (process.platform === 'darwin') {
            let home = process.env.HOME || ("/Users/" + (process.env.NAME || process.env.LOGNAME));
            dataPath = home + "/Library/Application Support/Laya/NativeTools3/template/";
        }
        else {
            var appdata = process.env.AppData || process.env.USERPROFILE + "/AppData/Roaming/";
            dataPath = appdata + "/Laya/layanative3/template/";
        }
        if (!fs.existsSync(dataPath)) {
            console.log('REPLACE: mkdir11 ' + dataPath);
            mkdirsSync(dataPath);
        }
        return dataPath;
    }
    static getSDKRootPath() {
        return AppCommand.getAppDataPath();
    }
    static getSDKPath(version) {
        return path.join(AppCommand.getAppDataPath(), version);
    }
    static isSDKExists(version) {
        return fs.existsSync(path.join(AppCommand.getAppDataPath(), version));
    }
    static getLocalJSONConfigPath() {
        return path.join(AppCommand.getAppDataPath(), "versionconfig.json");
    }
    read(path) {
        try {
            var text = fs.readFileSync(path, "utf-8");
            text = text.replace(/^\uFEFF/, '');
        }
        catch (err0) {
            return "";
        }
        return text;
    }
}
exports.AppCommand = AppCommand;
function getServerJSONConfig(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!url)
            url = exports.VERSION_CONFIG_URL + '?' + Math.random();
        return new Promise(function (res, rej) {
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    fs.writeFileSync(AppCommand.getLocalJSONConfigPath(), body);
                    res(JSON.parse(body));
                }
                else {
                    console.log('错误: 网络连接异常，下载 ' + url + '失败');
                    if (fs.existsSync(AppCommand.getLocalJSONConfigPath())) {
                        console.log('读取本地 ' + AppCommand.getLocalJSONConfigPath() + '成功');
                        let config = fs.readFileSync(AppCommand.getLocalJSONConfigPath(), 'utf8');
                        res(JSON.parse(config));
                    }
                    else {
                        console.log('读取本地 ' + AppCommand.getLocalJSONConfigPath() + '失败');
                        res(null);
                    }
                }
            });
        });
    });
}
exports.getServerJSONConfig = getServerJSONConfig;
function download(url, file, callBack) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (res, rej) {
            let stream = fs.createWriteStream(file);
            let layaresponse;
            var bar;
            request(url).on('response', function (response) {
                layaresponse = response;
                var len = parseInt(layaresponse.headers['content-length'], 10);
                bar = new ProgressBar('  下载 [:bar] :rate/bps :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: len
                });
            }).on('data', function (chunk) {
                bar.tick(chunk.length);
            }).pipe(stream).on('close', function () {
                if (layaresponse.statusCode === 200) {
                    callBack();
                    res(true);
                }
                else {
                    console.log('错误: 网络连接异常，下载 ' + url + '失败');
                    res(false);
                }
            }).on('end', function () {
                console.log('\n');
            });
        });
    });
}
exports.download = download;
function unzip(unzipurl, filepath, callbackHandler) {
    console.log('正在解压 ' + unzipurl + ' 到 ' + filepath + ' ...');
    if (process.platform === 'darwin') {
        var cmd = "unzip -oq \"" + unzipurl + "\" -d \"" + filepath + "\"";
        child_process.execSync(cmd);
    }
    else {
        var unzipexepath = path.join(__dirname, '..', 'tools', 'unzip.exe');
        var cmd = "\"" + unzipexepath + "\" -oq \"" + unzipurl + "\" -d \"" + filepath + "\"";
        child_process.execSync(cmd);
    }
}
exports.unzip = unzip;
function unzipAsync(unzipurl, filepath, cb) {
    console.log('正在解压 ' + unzipurl + ' 到 ' + filepath + ' ...');
    if (process.platform === 'darwin') {
        var cmd = "unzip -oq \"" + unzipurl + "\" -d \"" + filepath + "\"";
        child_process.exec(cmd, { maxBuffer: 1024 * 1024 }, cb);
    }
    else {
        var unzipexepath = path.join(__dirname, '..', 'tools', 'unzip.exe');
        var cmd = "\"" + unzipexepath + "\" -oq \"" + unzipurl + "\" -d \"" + filepath + "\"";
        child_process.exec(cmd, { maxBuffer: 1024 * 1024 }, cb);
    }
}
exports.unzipAsync = unzipAsync;
function checkURL(url, platform) {
    if (url && url.indexOf('.html') !== -1) {
        console.log('错误：LayaNative项目URL不支持.html文件，请使用.json文件或.js文件');
        return false;
    }
    return true;
}
exports.checkURL = checkURL;
function getStandAloneUrl(platform) {
    return exports.NATIVE_STAND_ALONE_URL;
}
exports.getStandAloneUrl = getStandAloneUrl;
function isStandAloneUrl(url) {
    if (url === exports.NATIVE_STAND_ALONE_URL) {
        return true;
    }
    return false;
}
exports.isStandAloneUrl = isStandAloneUrl;
