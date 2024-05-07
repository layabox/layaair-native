import * as fs from 'fs';
import * as path from 'path';
import * as AppCommand from './appCommand';
import * as plist from 'plist';
import { Orientation } from './appCommand';
import child_process = require('child_process');

export interface OptionsIOS {
    folder: string;
    sdk: string;
    version: string;
    platform: string;
    type: number;
    url: string;
    name: string;
    app_name: string;
    package_name: string;
    path: string;
    orientation?: Orientation;
    version_code?: number;
    version_name?: string;
}

export class ArchiveIOSCommand {
    constructor() {
    }
    public static archive(options: OptionsIOS): boolean {
        let appcmd = new AppCommand.AppCommand();
        let ok = appcmd.excuteCreateApp(options.folder, options.sdk, AppCommand.PLATFORM_IOS, options.type, options.url, options.name, options.app_name, options.package_name, options.path);
        if (!ok) {
            //return false;
        }

        let appPath = AppCommand.AppCommand.getAppPath(AppCommand.AppCommand.getNativePath(path.join(options.path, options.name)), options.platform);
        {
            let plistPath = path.join(appPath, options.name, options.name, "Info.plist");
            var plistJson = plist.parse(fs.readFileSync(plistPath, 'utf8'));
            console.log(JSON.stringify(plistJson));
            let orientations = [];
            if (options.orientation != null) {
                switch (options.orientation) {
                    case Orientation.Landscape:
                        orientations.push("UIInterfaceOrientationLandscapeLeft");
                        break;
                    case Orientation.Portrait:
                        orientations.push("UIInterfaceOrientationPortrait");
                        break;
                    case Orientation.ReverseLandscape:
                        orientations.push("UIInterfaceOrientationLandscapeRight");
                        break;
                    case Orientation.ReversePortrait:
                        orientations.push("UIInterfaceOrientationPortraitUpsideDown");
                        break;
                    case Orientation.SensorLandscape:
                        orientations.push("UIInterfaceOrientationLandscapeLeft");
                        orientations.push("UIInterfaceOrientationLandscapeRight");
                        break;
                    case Orientation.SensorPortrait:
                        orientations.push("UIInterfaceOrientationPortrait");
                        orientations.push("UIInterfaceOrientationPortraitUpsideDown");
                        break;
                    case Orientation.Sensor:
                        orientations.push("UIInterfaceOrientationLandscapeLeft");
                        orientations.push("UIInterfaceOrientationLandscapeRight");
                        orientations.push("UIInterfaceOrientationPortrait");
                        orientations.push("UIInterfaceOrientationPortraitUpsideDown");
                        break;
                }
                if (plistJson['UISupportedInterfaceOrientations'] != null) {
                    plistJson['UISupportedInterfaceOrientations'] = orientations;
                }
                if (plistJson['UISupportedInterfaceOrientations~ipad'] != null) {
                    plistJson['UISupportedInterfaceOrientations~ipad'] = orientations;
                }
                fs.writeFileSync(plistPath, plist.build(plistJson));  
            }
        }
        debugger
        let pbxprojPath = path.join(appPath, options.name, options.name + '.xcodeproj', "project.pbxproj");
        var pbxprojContent = fs.readFileSync(pbxprojPath, 'utf8');
        if (options.version_code != null) {
            //version
            pbxprojContent = pbxprojContent.replace(/(CURRENT_PROJECT_VERSION\s*=\s*)\d+;/g, `$1${options.version_code};`);
        }
        if (options.version_name != null) {
            //build
            // 使用正则表达式匹配并替换字符串
            // 此正则表达式匹配 "MARKETING_VERSION = " 后面的任意字符串，直到遇到分号
            pbxprojContent = pbxprojContent.replace(/(MARKETING_VERSION\s*=\s*)[^;]+;/g, `$1${options.version_name};`);
        }
        fs.writeFileSync(pbxprojPath, pbxprojContent);
        
        
        let archive_path = path.join(options.path,'temp');
        fs.mkdirSync(archive_path);
        if (process.platform === 'darwin') {

            let configuration = "Release";
            //通过xcodeproj 方式打包
            var cmd = " xcodebuild archive -sdk 'iphoneos' -project ${pbxprojPath} -scheme ${options.name} -configuration ${configuration} -archivePath ${archive_path}";
            child_process.execSync(cmd);
        }
        return true;
    }
}


