module.exports = {

  webdriver: {},

  test_settings: {

    seleniumDocker: {
      launch_url: "localhost",
      selenium_port: 4444,
      selenium_host: "selenium-server",
      silent: true,
      desiredCapabilities: {
          browserName: "chrome",
          marionette: true
      }
    }
  }
};
