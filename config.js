const fs = require('fs');

let config = { 
    apiKey: undefined,  // set in override
    clientID: undefined,  // set in override
    clientSecret: undefined,  // set in override
    callbackURL: "http://localhost:3000/auth"
};
// console.log("config:" + config);

const overrideFile = './config-override.js';
if (fs.existsSync(overrideFile)) {
    // console.log(overrideFile + " exists");
    const overrideConfig = require(overrideFile);
    // console.log("overrideConfig:", overrideConfig);
    config = {...config, ...overrideConfig };  // merge the configs
}

console.log("config:", config);

module.exports = config;
