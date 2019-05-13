exports.config = {
    seleniumAddress: "http://localhost:4444/wd/hub",
    chromeOnly: true,
    capabilities: {
        'browserName': 'phantomjs',
    },
    specs: [
        'educationsCenters/TC01-loadData.js'
    ]
};