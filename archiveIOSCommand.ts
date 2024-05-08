import * as fs from 'fs';
import * as path from 'path';
import * as AppCommand from './appCommand';
import * as plist from 'plist';
import { Orientation } from './appCommand';
import child_process = require('child_process');


export enum SigningStyle {
    manual,
    automatic,
}
export enum ExportMethod {
    app_store_connect, //deprecated app-store
    release_testing,//deprecated  ad-hoc
    enterprise,
    debugging//deprecated development
}

//根据unity猜测
export enum ProfileType {   
    Automatic,
    Development,
    Distribution,
}

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
    team_id: string;
    signing_style: SigningStyle;
    is_debug: boolean;
    is_simulator: boolean;
    export_method: ExportMethod;
    profile_id?: string;
    profile_type?: ProfileType;
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
        let pbxprojPath = path.join(appPath, options.name, options.name + '.xcodeproj', "project.pbxproj");
        var pbxprojContent = fs.readFileSync(pbxprojPath, 'utf8');
        if (options.version_code != null) {
            //version
            pbxprojContent = pbxprojContent.replace(/(CURRENT_PROJECT_VERSION\s*=\s*)\d+;/g, `$1${options.version_code};`);
        }
        if (options.version_name != null) {
            //build
            pbxprojContent = pbxprojContent.replace(/(MARKETING_VERSION\s*=\s*)[^;]+;/g, `$1${options.version_name};`);
        }
        fs.writeFileSync(pbxprojPath, pbxprojContent);
        
        
        let archive_export_path = path.join(options.path,'export');
        let archive_path = path.join(options.path,'temp');
        fs.mkdirSync(archive_path);
        if (process.platform === 'darwin') {
            let projPath = path.join(appPath, options.name, options.name + '.xcodeproj');
            let configuration = options.is_debug ? "Debug" : "Release";
            let sdk = options.is_simulator ? "iphonesimulator" : "iphoneos";

            let destination = options.is_simulator ? "generic/platform=iOS Simulator" : "generic/platform=iOS";
            
            //工程清理
            let cmd =`xcodebuild clean -project ${projPath} -scheme ${options.name} -configuration ${configuration}`;
            child_process.execSync(cmd);
            //通过xcodeproj 方式打包
            cmd =`xcodebuild archive -project ${projPath} -scheme ${options.name} -configuration ${configuration} -archivePath ${archive_path} -sdk ${sdk} -destination ${destination} -allowProvisioningUpdates`;
            child_process.execSync(cmd);
            let exportOptions: any = {};
            if (options.team_id != null) {
                exportOptions.teamID = options.team_id;
            }

            if (options.export_method != null) {
                switch(options.export_method) {
                    case ExportMethod.app_store_connect:
                        exportOptions.method = 'app-store-connect';
                        break;
                    case ExportMethod.debugging:
                        exportOptions.method = 'debugging';
                        break;
                    case ExportMethod.enterprise:
                        exportOptions.method = 'enterprise';
                        break;
                    case ExportMethod.release_testing:
                        exportOptions.method = 'release-testing';
                        break;
                }
            }

            if (options.signing_style != null) {
                if (options.signing_style == SigningStyle.automatic) {
                    exportOptions.signingStyle = 'automatic';
                }
                else if (options.signing_style == SigningStyle.manual) {
                    exportOptions.signingStyle = 'manual';
                    //signingCertificate : String
                    //For manual signing only. Provide a certificate name, SHA-1 hash, or automatic selector to use for signing. Automatic selectors allow Xcode to pick the newest installed certificate of a particular type. 
                    //The available automatic selectors are "Mac App Distribution", "iOS Distribution", "iOS Developer", "Developer ID Application", "Apple Distribution", "Mac Developer", and "Apple Development". 
                    //Defaults to an automatic certificate selector matching the current distribution method.
            
                    if (options.profile_type != null) {
                        switch(options.profile_type) {
                            case ProfileType.Automatic:
                                break;
                            case ProfileType.Development:
                                exportOptions.signingCertificate = 'iOS Developer';
                                break;
                            case ProfileType.Distribution:
                                exportOptions.signingCertificate = 'iOS Distribution';
                                break;
                        }
                    }
                    //provisioningProfiles : Dictionary

                    //For manual signing only. Specify the provisioning profile to use for each executable in your app. 
                    //Keys in this dictionary are the bundle identifiers of executables; values are the provisioning profile name or UUID to use.

                    if (options.profile_id && options.package_name) {
                            exportOptions.provisioningProfiles = { [options.package_name]: options.profile_id };

                        exportOptions.signingStyle = 'manual';
                    }
                }
            }
            let exportOptionsPlist = plist.build(exportOptions);
            let exportOptionsPath = path.join(archive_path, 'exportOptions.plist');
            fs.writeFileSync(exportOptionsPath, exportOptionsPlist);  

            cmd =`xcodebuild -exportArchive -archivePath '${archive_path}.xcarchive' -exportPath ${archive_export_path} -exportOptionsPlist ${exportOptionsPath}`;


            child_process.execSync(cmd);
        }
        return true;
    }
}


