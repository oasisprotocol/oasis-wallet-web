# Mobile app development

## Convert Android App Bundle (AAB) to Android Package (APK)

Our GitHub workflows create signed AAB and APK files.
We use AAB to upload to Google Play Store and APK for testing.
In case of testing AAB locally follow steps below to convert bundle to APK:

- Download [bundletool] from the official GitHub repository
- Generate APK files

<!-- markdownlint-disable MD013 -->

```
java -jar bundletool-all-<VERSION>.jar build-apks --bundle=app-release-signed.aab --output=app-release-signed.apks --mode=universal
```

<!-- markdownlint-enable MD013 -->

- Extract the APK

```
  unzip app-release-signed.apks -d extracted-apks
```

- Install the APK on your device

```
adb -s <DEVICE_SERIAL_NUMBER> install extracted-apks/universal.apk
```

## Capacitor assets

- Create `assets` folder with source images

```
assets/
├── icon-only.png
├── icon-foreground.png
├── icon-background.png
├── splash.png
└── splash-dark.png
```

- Run a generator for a target platform:

```
npx @capacitor/assets generate --android
npx @capacitor/assets generate --ios
```

- Validate new assets in `resource` folder.
  Due to cropping and scaling issues update incorrect images manually
- Use image compression web app or CLI
- Additional information are available in [Capacitor Assets docs]

[Capacitor Assets docs]: https://github.com/ionic-team/capacitor-assets#usage---custom-mode
[bundletool]: https://github.com/google/bundletool/releases
