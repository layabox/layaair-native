import * as fs from 'fs';
import * as path from 'path';

export interface OptionsWindows {
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
  }

export class ArchiveWindowsCommand {
    constructor() {
    }
    public static archive(options: OptionsWindows): boolean {
        return true;
    }
}


