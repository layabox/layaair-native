import * as fs from 'fs';
import * as path from 'path';
import * as JSON5 from 'json5';
import gen_dcc = require('layadcc');
export class FileUtils {
    /**
     * Creates directories recursively synchronously.
     * @param dirname - The directory path to create.
     * @param mode - Optional. The permissions to set for the created directories.
     * @returns A boolean indicating whether the directories were created successfully.
     */
    static mkdirsSync(dirname: string, mode?: number): boolean {
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
    /**
     * Copies a file synchronously from the source path to the target path.
     * If the target path is a directory, a new file with the same name will be created in that directory.
     * @param source The path of the source file.
     * @param target The path of the target file or directory.
     */
    static copyFileSync(source: string, target: string): void {
        var targetFile = target;
        //if target is a directory a new file with the same name will be created
        if (fs.existsSync(target)) {
            if (fs.lstatSync(target).isDirectory()) {
                targetFile = path.join(target, path.basename(source));
            }
        }
        fs.writeFileSync(targetFile, fs.readFileSync(source));
    }

    /**
     * Recursively copies a folder from the source path to the target path.
     * @param source - The path of the source folder.
     * @param target - The path of the target folder.
     */
    static copyFolderRecursiveSync(source: string, target: string) {
        var files = [];
        //check if folder needs to be created or integrated
        var targetFolder = path.join(target, path.basename(source));
        if (!fs.existsSync(targetFolder)) {
            FileUtils.mkdirsSync(targetFolder);
        }

        //copy
        if (fs.lstatSync(source).isDirectory()) {
            files = fs.readdirSync(source);
            files.forEach(function (file) {
                var curSource = path.join(source, file);
                if (fs.lstatSync(curSource).isDirectory()) {
                    FileUtils.copyFolderRecursiveSync(curSource, targetFolder);
                } else {
                    FileUtils.copyFileSync(curSource, targetFolder);
                }
            });
        }
    }

    /**
     * Removes a directory and all its contents synchronously.
     * @param dir - The path of the directory to remove.
     */
    static rmdirSync(dir: string) {
        /**
         * Recursively iterates through the directory and its subdirectories.
         * @param url - The current path being iterated.
         * @param dirs - An array to collect directories.
         */
        function iterator(url: string, dirs: string[]) {
            var stat = fs.statSync(url);
            if (stat.isDirectory()) {
                dirs.unshift(url); // Collect directories
                inner(url, dirs);
            } else if (stat.isFile()) {
                fs.unlinkSync(url); // Delete files directly
            }
        }

        /**
         * Recursively iterates through the subdirectories of a directory.
         * @param path - The path of the directory to iterate.
         * @param dirs - An array to collect directories.
         */
        function inner(path, dirs) {
            var arr = fs.readdirSync(path);
            for (var i = 0, el; el = arr[i++];) {
                iterator(path + "/" + el, dirs);
            }
        }

        var dirs: string[] = [];
        try {
            iterator(dir, dirs);
            dirs.forEach((v) => { fs.rmdirSync(v) });
        } catch (e) {
            // If the file or directory does not exist, fs.statSync will throw an error,
            // but we still treat it as if no exception occurred.
        }
    };


    static processDcc(config: any, folder: string, url: string, appPath: string) {
        let res_path = folder;//获取资源目录
        //资源打包路径
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
                //console.log('REPLACE mkdir7', outpath);
                FileUtils.mkdirsSync(outpath);
                //fs_extra.mkdirsSync(outpath);
            }
            console.log('正在执行LayaDcc...');
            gen_dcc.gendcc(res_path, outpath, true, false);

        }
    }

    static readJSONSync(file: string): any {
        if (!fs.existsSync(file)) {
            console.log('错误: 找不到文件 ' + file);
            return null;
        }
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }

    static writeJSONSync(file: string, data: any, spaces: number): void {
        fs.writeFileSync(file, JSON.stringify(data, null, spaces));
    }

    static readJSON5Sync(file: string): any {
        if (!fs.existsSync(file)) {
            console.log('错误: 找不到文件 ' + file);
            return null;
        }
        return JSON5.parse(fs.readFileSync(file, 'utf-8'));
    }

    static writeJSON5Sync(file: string, data: any, spaces: number): void {
        fs.writeFileSync(file, JSON5.stringify(data, null, spaces));
    }

}