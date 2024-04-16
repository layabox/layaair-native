import * as fs from 'fs';
import * as path from 'path';
import * as JSON5 from 'json5';
import { AppCommand, NATIVE_STAND_ALONE_URL } from './appCommand';
import { FileUtils } from './FileUtils';
export abstract class BaseTools {
    abstract excuteCreateApp(folder: string, sdk: string, platform: string, type: number, url: string, name: string, app_name: string, package_name: string, outputPath: string): boolean;

    abstract excuteRefreshRes(folder: string, url: string, appPath:string): boolean
    checkURL(url: string): boolean {
        return true;
    }

    readJSONSync(file: string): any {
        if (!fs.existsSync(file)) {
            console.log('错误: 找不到文件 ' + file);
            return null;
        }
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }

    writeJSONSync(file: string, data: any, spaces: number): void {
        fs.writeFileSync(file, JSON.stringify(data, null, spaces));
    }

    readJSON5Sync(file: string): any {
        if (!fs.existsSync(file)) {
            console.log('错误: 找不到文件 ' + file);
            return null;
        }
        return JSON5.parse(fs.readFileSync(file, 'utf-8'));
    }

    writeJSON5Sync(file: string, data: any, spaces: number): void {
        fs.writeFileSync(file, JSON5.stringify(data, null, spaces));
    }

    get standAloneUrl(): string {
        return NATIVE_STAND_ALONE_URL
    }


}

export class OhosTools extends BaseTools {

    /**缓存目录 */
    static Cache_Path = 'entry/src/main/resources/rawfile/cache';
    /**入口文件 */
    static Enter_Source_File = 'entry/src/main/ets/MainAbility/MainAbility.ts';
    /**入口正则表达式 */
    static indexJS: RegExp = new RegExp("(?<=laya\\.ConchNAPI_configSetURL\\(\\s*\\')(.*)(?=\\'\\))");
    /**本地化正则表达式 */
    static localizable:RegExp=new RegExp("(?<=ConchNAPI_setLocalizable\\(\\s*)true(?=\\s*\\))");


    checkURL(url: string): boolean {
        return true;
    }
    /**
     * 
     * @param folder 项目目录  type为0时无效
     * @param sdk  本地sdk目录 模板目录
     * @param platform 平台 ohos
     * @param type type为2是单机包，为1是网络包
     * @param url 项目地址
     * @param name 导出目录名称
     * @param app_name app名称
     * @param package_name 包名
     * @param outputPath 导出项目存储路径
     * @returns 
     */
    public excuteCreateApp(folder: string, sdk: string, platform: string, type: number, url: string, name: string, app_name: string, package_name: string, outputPath: string): boolean {
        if (type !== 2 && !this.checkURL(url)) {
            return false;
        }

        if (type > 0 && !fs.existsSync(folder)) {
            console.log('错误: 找不到目录 ' + folder);
            return false;
        }

        let appPath = AppCommand.getAppPath(AppCommand.getNativePath(path.join(outputPath, name)), platform);
        let srcPath = path.join(sdk, platform);

        FileUtils.copyFolderRecursiveSync(srcPath, path.dirname(appPath));
        if (type > 0) {
            FileUtils.processDcc({
                res: {
                    path: OhosTools.Cache_Path,
                }
            }, folder, url, appPath);
        }
        this.replaceUrl(url, appPath,type);

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
        appScopeStringJSON.string.find((item: any) => item.name === 'app_name').value = app_name;
        this.writeJSONSync(appScopeStringJSONPath, appScopeStringJSON, 2);

        const stringJSONPath = path.join(appPath, 'entry/src/main/resources/base/element/string.json');
        const stringJSON = this.readJSONSync(stringJSONPath);
        stringJSON.string.find((item: any) => item.name === 'MainAbility_label').value = app_name;
        this.writeJSONSync(stringJSONPath, stringJSON, 2);

        let nativeJSONPath = AppCommand.getNativeJSONPath(path.join(outputPath, name));
        let nativeJSON = { h5: folder ? folder : ''};
        FileUtils.mkdirsSync( path.dirname(nativeJSONPath));
        fs.writeFileSync( nativeJSONPath, JSON.stringify(nativeJSON));
        return true;
    } 
    
    excuteRefreshRes(folder: string, url: string, appPath: string): boolean {
        FileUtils.processDcc({
            res: {
                path: OhosTools.Cache_Path,
            }
        }, folder, url, appPath);
        return true;
    }
    /**
     * 替换项目URL
     * @param url 
     * @param appPath 
     * @param type 
     */
    private replaceUrl(url: string, appPath: string,type:number): void {
        let enterSourceFile = path.join(appPath, OhosTools.Enter_Source_File);
        let standAlone = type === 2 ? true : false;
        if(standAlone){
            url = this.standAloneUrl;
        }
        let rs = fs.readFileSync(enterSourceFile, 'utf-8');
        rs = rs.replace(OhosTools.indexJS, url);
        rs =rs.replace(OhosTools.localizable,standAlone?'true':'false');
        fs.writeFileSync(enterSourceFile, rs);
    }
}