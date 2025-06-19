
/**
 * DO NOT EDIT - this file is written by prebuild.js via electron-builder.env - edit vars in electron-builder.env file!
 */

const config = {
    development: false,  // disable kiosk mode on exam mode and other stuff (autofill input fields)
    showdevtools: false,
    
    bipIntegration: false,

    workdirectory : "",   // (desktop path + examdir)
    tempdirectory : "",   // (desktop path + 'tmp')
    serverdirectory: 'EXAM-TEACHER',

    serverApiPort: 22422,  // this is needed to be reachable on the teachers pc for basic functionality
    multicastClientPort: 6034,  // only needed for exam autodiscovery
    multicastServerClientPort: 6035,   // needed to find other exams in the network with the same name and prevent using the same exam name twice (confusion alert)

    multicastServerAdrr: '239.255.255.250',
    hostip: "0.0.0.0",       // server.js
    gateway: true,
    examServerList: {},
    accessToken: false,

    version: '1.0.2-1',
    variant: 'puavo',
    buildforWEB: false,
    info: 'LTS'
}
export default config;
