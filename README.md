# Thorium Kiosk

A kiosk for running Thorium

Note: To make shutdown work on Linux and macOS devices, you have to do the following:

Run this command:

```
sudo visudo
```

Add one of these lines to the end of the file:

```
your-username ALL=NOPASSWD: /sbin/shutdown       # OS X and Linux
your-username ALL=NOPASSWD: /usr/sbin/pm-suspend # Linux only
```

### Things it needs
* Enable/Disable kiosk mode via keystroke 
* Add a programming password prompt to access the dev tools
* Test on linux
* Test on windows
* Logging errors to the filesystem
