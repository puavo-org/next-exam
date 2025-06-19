import fs from 'fs';
import yaml from 'yaml';
import dotenv from 'dotenv';

// Lade die env Datei
dotenv.config({ path: 'electron-builder.env' });



// 1. Update config.js
const configJsPath = './packages/main/config.js';
const isDevelopment = process.env.DEVELOPMENT === 'true';
const bipIntegration = process.env.BIP_INTEGRATION === 'true';

let configJsContent = `
/**
 * DO NOT EDIT - this file is written by prebuild.js via electron-builder.env - edit vars in electron-builder.env file!
 */

const config = {
    development: ${isDevelopment},  // disable kiosk mode on exam mode and other stuff (autofill input fields)
    showdevtools: ${isDevelopment},
    bipIntegration: ${bipIntegration},

    workdirectory : "",   // (desktop path + examdir)
    tempdirectory : "",   // (desktop path + 'tmp')
    homedirectory : "",   // set in main.ts
    examdirectory : "",    // set after registering in ipcHandler
    clientdirectory: '${process.env.CLIENT_DIRECTORY}',

    serverApiPort: ${process.env.SERVER_API_PORT},  // this is needed to be reachable on the teachers pc for basic functionality
    multicastClientPort: ${process.env.MULTICAST_CLIENT_PORT},  // only needed for exam autodiscovery

    multicastServerAdrr: '239.255.255.250',
    hostip: "",       // server.js
    gateway: true,
    electron: false,
    virtualized: false,
    version: '${process.env.VERSION}-${process.env.BUILD_NUMBER}',
    variant: '${process.env.VARIANT}',
    info: '${isDevelopment ? 'DEV' : 'LTS'}'
}
export default config;
`;

// Schreibe die aktualisierte config.js
fs.writeFileSync(configJsPath, configJsContent);















// 2. Update electron-builder.yml
const builderConfigPath = './electron-builder.yml';
const builderConfig = yaml.parse(fs.readFileSync(builderConfigPath, 'utf8'));

let buildVersion = process.env.VERSION + '.' + process.env.BUILD_NUMBER;

// Erstelle Datums-String
const now = new Date();
const buildDate = now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')

const artifactNamePattern = `\${productName}_\${env.VERSION}.\${env.BUILD_NUMBER}_${buildDate}_\${arch}.\${ext}`;
const buildNumber = process.env.BUILD_NUMBER;
const filename = `${process.env.PRODUCT_NAME}_${process.env.VERSION}.${process.env.BUILD_NUMBER}_${buildDate}`;




// Setze die Werte aus der env
builderConfig.buildNumber = process.env.BUILD_NUMBER;
builderConfig.buildVersion = buildVersion;
builderConfig.productName = process.env.PRODUCT_NAME;

// Windows
if (builderConfig.win) {    builderConfig.win.artifactName = artifactNamePattern;}
// Mac
if (builderConfig.mac) {    builderConfig.mac.artifactName = artifactNamePattern;}
// Linux
if (builderConfig.linux) {    builderConfig.linux.artifactName = artifactNamePattern;}

// Setze das Output-Verzeichnis
builderConfig.directories = builderConfig.directories || {};
builderConfig.directories.output = `../release/student/${process.env.VERSION}.${process.env.BUILD_NUMBER}_${buildDate}`;



// Schreibe die aktualisierte yml
fs.writeFileSync(builderConfigPath, yaml.stringify(builderConfig));




// 3. Update package.json
const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Setze die Werte in package.json
packageJson.version = process.env.VERSION;
packageJson.buildNumber = process.env.BUILD_NUMBER;
packageJson.buildVersion = buildVersion;
// Schreibe die aktualisierte package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ Versionen aktualisiert:');
console.log(`Version: ${process.env.VERSION}`);
console.log(`Build Number: ${process.env.BUILD_NUMBER}`);
console.log(`Build Version: ${buildVersion}`);
console.log(`Build Date: ${buildDate}`);
console.log(`FileName: ${filename}`);
console.log(`Development: ${process.env.DEVELOPMENT}`);
console.log(`__________________________________________________________________`);
