const GhReleases = require('electron-gh-releases');
const { dialog, app } = require('electron');

const dialogOpts = {
  type: 'info',
  buttons: ['Restart', 'Later'],
  title: 'Headset Update',
  message: 'New Version is Available for Headset!',
  detail: 'Restart the application to apply the updates.',
};

class AutoUpdater {
  constructor(options = {}) {
    this.options = options;
    this.updater = new GhReleases({
      repo: 'headsetapp/headset-electron',
      currentVersion: `v${app.getVersion()}`,
    });

    this.updater.on('update-downloaded', () => this.updateDownloaded());

    this.checkForUpdates();

    setInterval(() => {
      this.checkForUpdates();
    }, 3600000);
  }

  updateDownloaded() {
    dialog.showMessageBox(dialogOpts, (response) => {
      if (this.options.onBeforeQuit) this.options.onBeforeQuit();

      // Restart the app and install the update
      if (response === 0) this.updater.install();
    });
  }

  checkForUpdates() {
    this.updater.check((err, status) => {
      if (!err && status) {
        // Download the update
        this.updater.download();
      }
    });
  }
}

module.exports = AutoUpdater;
