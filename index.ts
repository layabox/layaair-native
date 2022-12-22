import { handler } from './createAppCommand';
import * as AppCommand from './appCommand';
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request';

module.exports = {
    createapp: (folder: string, sdk: string, version: string, platform: string, type: number, url: string, name: string, app_name: string, package_name: string, path: string) => {
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
        return handler(args);
    },
    refreshres: (platform: string, path: string, url: string) => {
        var args = {
            platform: platform,
            path: path,
            url: url
        };
        handler(args);
    },
    removeres: (path: string) => {
        var args = {
            path: path
        };
        handler(args);
    },
    listversions: AppCommand.getServerJSONConfig,
    /**
     * 如果不存在就下载并且解压，否则就什么都不做。
     * @param ver {string} 版本号， 例如 v0.9.5，就是取的json中的version信息。
     */
    downloadsdk:(ver:string)=>{
        let zip = path.join(AppCommand.AppCommand.getSDKRootPath(), ver+'.zip');
    },
    isSDKExist:async (ver:string)=>{
        let sdkVersionConfig = await AppCommand.getServerJSONConfig(AppCommand.VERSION_CONFIG_URL + '?' + Math.random());
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
    },
    getSDKRootPath:()=>{
        return AppCommand.AppCommand.getSDKRootPath();
    },
    unzipAsync:(zipfile: string, outfile: string, cb:(error:Error, stdout:string, stderror:string)=>void)=>{
        AppCommand.unzipAsync(zipfile, outfile, cb);
    }
}