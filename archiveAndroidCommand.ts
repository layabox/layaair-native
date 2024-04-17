import * as fs from 'fs';
import * as path from 'path';
import rcedit = require('rcedit');
import * as AppCommand from './appCommand';
import child_process = require('child_process');


export enum AndroidArchitectures {
    ARMV7 = 1,
    ARM64 = 2,
    X86 = 4,
    X86_64 = 8,
  }

  export enum AndroidArchiveType {
    APK,
    AAB,
  }

export interface OptionsAndroid {
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
    java_home?: string;//Open JDK home
    android_home?: string;//Android SDK home
    archive_type: AndroidArchiveType;
    release_key_alias: string;
    release_key_password: string;
    release_store_file: string;
    release_store_password: string;
    debug_key_alias: string;
    debug_key_password: string;
    debug_store_file: string;
    debug_store_password: string;
    min_sdk_version: number;//整数
    target_sdk_version: number;//整数
    version_code: number;
    version_name: string;
    architectures: AndroidArchitectures;
  }

export class ArchiveAndroidCommand {
    constructor() {
    }
    public static archive(options: OptionsAndroid): boolean {
        let appcmd = new AppCommand.AppCommand();
        let ok = appcmd.excuteCreateApp(options.folder, options.sdk, AppCommand.PLATFORM_ANDROID_STUDIO, options.type, options.url, options.name, options.app_name, options.package_name, options.path);
        if (!ok) {
            //return false;
        }
        if (options.java_home) {
            process.env.JAVA_HOME = options.java_home;
        }
        if (options.android_home) {
            process.env.ANDROID_HOME = options.android_home;
        }
        const currentDirectory = process.cwd();
        console.log('当前目录是:', currentDirectory);
        let buildPath = path.join(options.path, options.name, "android_studio");
        ArchiveAndroidCommand.writeFileLocalProperties(buildPath, options);
        process.chdir(buildPath);
        if (options.archive_type == AndroidArchiveType.APK) {
            let cmd = "gradlew.bat assembleRelease";
            child_process.execSync(cmd);
        }
        else if (options.archive_type == AndroidArchiveType.AAB) {
            let cmd = "gradlew.bat bundleRelease";
            child_process.execSync(cmd);
        }
        else {
            console.log('unkonw archive_type: ', options.archive_type);
            return false;
        }
        process.chdir(currentDirectory);
        console.log('当前目录是:', currentDirectory);
        return true;
    }
    private static writeFileLocalProperties(projectRootPath:string, options: OptionsAndroid) {
        let localPropertiesPath = path.join(projectRootPath, "gradle.properties");
        if (fs.existsSync(localPropertiesPath)) {
            let fileContent = fs.readFileSync(localPropertiesPath,'utf8');
            if (options.release_key_alias) {
                const regex = /RELEASE_KEY_ALIAS=[^\n]*/g;
                fileContent = fileContent.replace(regex, `RELEASE_KEY_ALIAS=${options.release_key_alias}`);
            }
            if (options.release_key_password) {
                const regex = /RELEASE_KEY_PASSWORD=[^\n]*/g;
                fileContent = fileContent.replace(regex, `RELEASE_KEY_PASSWORD=${options.release_key_password}`);
            }
            if (options.release_store_password) {
                const regex = /RELEASE_STORE_PASSWORD=[^\n]*/g;
                fileContent = fileContent.replace(regex, `RELEASE_STORE_PASSWORD=${options.release_store_password}`);
            }
            if (options.release_store_file) {
                const regex = /RELEASE_STORE_FILE=[^\n]*/g;
                fileContent = fileContent.replace(regex, `RELEASE_STORE_FILE=${options.release_store_file}`);
            }

            if (options.debug_key_alias) {
                const regex = /DEBUG_KEY_ALIAS=[^\n]*/g;
                fileContent = fileContent.replace(regex, `DEBUG_KEY_ALIAS=${options.debug_key_alias}`);
            }
            if (options.debug_key_password) {
                const regex = /DEBUG_KEY_PASSWORD=[^\n]*/g;
                fileContent = fileContent.replace(regex, `DEBUG_KEY_PASSWORD=${options.debug_key_password}`);
            }

            if (options.debug_store_file) {
                const regex = /DEBUG_STORE_FILE=[^\n]*/g;
                fileContent = fileContent.replace(regex, `DEBUG_STORE_FILE=${options.debug_store_file}`);
            }
            if (options.debug_store_password) {
                const regex = /DEBUG_STORE_PASSWORD=[^\n]*/g;
                fileContent = fileContent.replace(regex, `DEBUG_STORE_PASSWORD=${options.debug_store_password}`);
            }
            //
            if (options.min_sdk_version) {
                const regex = /MIN_SDK_VERSION=[^\n]*/g;
                fileContent = fileContent.replace(regex, `MIN_SDK_VERSION=${options.min_sdk_version}`);
            }
            if (options.target_sdk_version) {
                const regex = /TARGET_SDK_VERSION=[^\n]*/g;
                fileContent = fileContent.replace(regex, `TARGET_SDK_VERSION=${options.target_sdk_version}`);
            }

            if (options.version_code) {
                const regex = /VERSION_CODE=[^\n]*/g;
                fileContent = fileContent.replace(regex, `VERSION_CODE=${options.version_code}`);
            }

            if (options.version_name) {
                const regex = /VERSION_NAME=[^\n]*/g;
                fileContent = fileContent.replace(regex, `VERSION_NAME=${options.version_name}`);
            }

            let architectures = "";
            if (options.architectures & AndroidArchitectures.ARMV7) {
                architectures += "armeabi-v7a";
            }
            if (options.architectures & AndroidArchitectures.ARM64) {
                if (architectures.length != 0) {
                    architectures += ",arm64-v8a";
                }
                else {
                    architectures += "arm64-v8a";
                }
            }

            if (options.architectures & AndroidArchitectures.X86) {
                if (architectures.length != 0) {
                    architectures += ",x86";
                }
                else {
                    architectures += "x86";
                }
            }

            if (options.architectures & AndroidArchitectures.X86_64) {
                if (architectures.length != 0) {
                    architectures += ",x86_64";
                }
                else {
                    architectures += "x86_64";
                }
            }

            if (architectures.length != 0) {
                const regex = /ABI_FILETERS=[^\n]*/g;
                fileContent = fileContent.replace(regex, `ABI_FILETERS=${architectures}`);
            }

            fs.writeFileSync(localPropertiesPath, fileContent);
        }
    }
    
    /*private static writeFileLocalProperties(projectRootPath:string) {
        let localPropertiesPath = path.join(projectRootPath, "local.properties");
        if (fs.existsSync(localPropertiesPath)) {
            let fileContent = fs.readFileSync(localPropertiesPath,'utf8');
            fileContent = fileContent.replace("http://", "");
            const regex = new RegExp(`sdk.dir=${originalString}`, 'g');

            const result = input.replace(regex, `sdk.dir=${newString}`);

        }
    }*/
}


