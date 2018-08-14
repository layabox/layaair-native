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
    isSDKExist:(ver:string)=>{
        return AppCommand.AppCommand.isSDKExists(ver);
    },
    getSDKRootPath:()=>{
        return AppCommand.AppCommand.getSDKRootPath();
    },
    unzipAsync:(zipfile: string, outfile: string, cb:(error:Error, stdout:string, stderror:string)=>void)=>{
        AppCommand.unzipAsync(zipfile, outfile, cb);
    }
}