
import { archiveAndroid, archiveIOS } from ".";
import { Orientation } from "./appCommand";
import { AndroidArchitectures, AndroidArchiveType, AndroidIconsType, OptionsAndroid } from "./archiveAndroidCommand";
import { OptionsIOS } from "./archiveIOSCommand";



debugger

let iconTypeToPath = new Map<AndroidIconsType, string>([
    [AndroidIconsType.adaptive_xxxhdpi_432X432px_background, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.adaptive_xxxhdpi_432X432px_foreground, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.adaptive_xxhdpi_324X324px_background, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.adaptive_xxhdpi_324X324px_foreground, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.adaptive_xhdpi_216X216px_background, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.adaptive_xhdpi_216X216px_foreground, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.adaptive_hdpi_162X162px_background, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.adaptive_hdpi_162X162px_foreground, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.adaptive_mdpi_108X108px_background, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.adaptive_mdpi_108X108px_foreground, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.round_xxxhdpi_192X192px, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.round_xxhdpi_144X144px, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.round_xhdpi_96X96px, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.round_hdpi_72X72px, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.round_mdpi_48X48px, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.legacy_xxxhdpi_192X192px, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.legacy_xxhdpi_144X144px, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.legacy_xhdpi_96X96px, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.legacy_hdpi_72X72px, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
    [AndroidIconsType.legacy_mdpi_48X48px, 'F:/Ohayoo-native/LayaNative3.0-22/LayaNative3.0//publish//nativetools//template//android_studio/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png']
]);


const options:OptionsAndroid = {
 folder: "E://out1//EngineTest//release//android//resource",
sdk: "C://Users//lvfulong//AppData//Roaming//Laya//layanative3//template//release-v3.1.2",
version: null,
platform: "android_studio",
type: 0,
url: "http://10.10.20.77:13999/index.js",
name: "LayaAir-API-Demo",
app_name: "myGame",
package_name: "com.layabox.game",
path: "E://out1//EngineTest//release//android",
java_home: "C://Users//lvfulong//.jdks//jbrsdk-17.0.6-windows-x64-b829.9//jbrsdk-17.0.6-windows-x64-b829.9",
android_home: "D://Program Files//androidStudioSDK",
archive_type: AndroidArchiveType.APK,
release_key_alias: "androiddebugkey",
release_key_password: "android",
release_store_file: "../debug.keystore",
release_store_password: "android",
debug_key_alias: "androiddebugkey",
debug_key_password:"android",
debug_store_file: "../debug.keystore",
debug_store_password: "android",
min_sdk_version: 19,
target_sdk_version: 29,
version_code: 3,
version_name: "release-3",
architectures: AndroidArchitectures.X86 | AndroidArchitectures.X86_64 | AndroidArchitectures.ARMV7 | AndroidArchitectures.ARM64,
orientation: Orientation.Sensor,
icons: iconTypeToPath,
};
//"C://Users//lvfulong//AppData//Roaming//Laya//layanative3//template//release-v3.1.2",//
const optionsIOS:OptionsIOS = {
    folder: "E://out1//EngineTest//release//android//resource",
   sdk: "F://Ohayoo-native//LayaNative3.0-22//LayaNative3.0//publish//nativetools//template",
   version: null,
   platform: "ios",
   type: 0,
   url: "http://10.10.20.77:13999/index.js",
   name: "LayaAir-API-Demo",
   app_name: "myGame",
   package_name: "com.layabox.game",
   path: "E://out1//c",
   orientation: Orientation.Landscape,
   version_code: 3,
    version_name: "release-3",      
   };
//let c = archiveAndroid(options);
let c = archiveIOS(optionsIOS);
//Utildds.archiveWindows()