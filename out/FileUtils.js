"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtils = void 0;
const fs = require("fs");
const path = require("path");
const JSON5 = require("json5");
const gen_dcc = require("layadcc");
class FileUtils {
    static mkdirsSync(dirname, mode) {
        if (fs.existsSync(dirname)) {
            return true;
        }
        else {
            if (FileUtils.mkdirsSync(path.dirname(dirname), mode)) {
                fs.mkdirSync(dirname, mode);
                return true;
            }
        }
        return false;
    }
    static copyFileSync(source, target) {
        var targetFile = target;
        if (fs.existsSync(target)) {
            if (fs.lstatSync(target).isDirectory()) {
                targetFile = path.join(target, path.basename(source));
            }
        }
        fs.writeFileSync(targetFile, fs.readFileSync(source));
    }
    static copyFolderRecursiveSync(source, target) {
        var files = [];
        var targetFolder = path.join(target, path.basename(source));
        if (!fs.existsSync(targetFolder)) {
            FileUtils.mkdirsSync(targetFolder);
        }
        if (fs.lstatSync(source).isDirectory()) {
            files = fs.readdirSync(source);
            files.forEach(function (file) {
                var curSource = path.join(source, file);
                if (fs.lstatSync(curSource).isDirectory()) {
                    FileUtils.copyFolderRecursiveSync(curSource, targetFolder);
                }
                else {
                    FileUtils.copyFileSync(curSource, targetFolder);
                }
            });
        }
    }
    static rmdirSync(dir) {
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
    static processDcc(config, folder, url, appPath) {
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
                FileUtils.mkdirsSync(outpath);
            }
            console.log('正在执行LayaDcc...');
            gen_dcc.gendcc(res_path, outpath, true, false);
        }
    }
    static readJSONSync(file) {
        if (!fs.existsSync(file)) {
            console.log('错误: 找不到文件 ' + file);
            return null;
        }
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
    static writeJSONSync(file, data, spaces) {
        fs.writeFileSync(file, JSON.stringify(data, null, spaces));
    }
    static readJSON5Sync(file) {
        if (!fs.existsSync(file)) {
            console.log('错误: 找不到文件 ' + file);
            return null;
        }
        return JSON5.parse(fs.readFileSync(file, 'utf-8'));
    }
    static writeJSON5Sync(file, data, spaces) {
        fs.writeFileSync(file, JSON5.stringify(data, null, spaces));
    }
}
exports.FileUtils = FileUtils;
