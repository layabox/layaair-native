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
const AppCommand = require("./appCommand");
exports.command = 'listversions';
exports.describe = '列出所有SDK版本';
exports.handler = function (argv) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let sdkVersionConfig = yield AppCommand.getServerJSONConfig(AppCommand.VERSION_CONFIG_URL + '?' + Math.random());
            if (!sdkVersionConfig) {
                return;
            }
            console.log();
            for (let i = 0; i < sdkVersionConfig.versionList.length; i++) {
                console.log(' ' + sdkVersionConfig.versionList[i].version);
            }
            console.debug('请继续......');
        }
        catch (error) {
            console.error();
            console.error(error.name);
            console.error(error.message);
        }
    });
};
