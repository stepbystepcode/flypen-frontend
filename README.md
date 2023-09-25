<p align="center">
<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/57084184/270096729-18a461fc-e7ed-4bda-881d-da808878d525.svg"/>
</p>
<h2 align="center">Flypen Frontend</h2>
<p align="center">
  <a href="https://github.com/stepbystepcode/flypen-frontend/actions"><img src="https://github.com/stepbystepcode/flypen-frontend/actions/workflows/main.yml/badge.svg" alt="Build Status"></a>
  <a href="https://raw.githubusercontent.com/stepbystepcode/flypen-frontend/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="LICENSE"></a>
  <a href="https://github.com/topics/cpp"><img src="https://img.shields.io/badge/language-Vue.js-41B883?logo=vue.js" alt="languange"></a>
</p>

*Read this in other languages: [English](README.md), [简体中文](README.zh_Hans.md).*

## C++ Course Design


This is a cross-platform multi-end application built with Vue 3 and Quasar framework. It supports web, Android, iOS, Windows, Linux and macOS.

## Features
- Cross-platform support for Web and Android (iOS and other platforms coming soon)
- Real-time chat and messaging
- Friend management
- Team collaboration
- Cloud file management
- Markdown-powered team wiki
- Theming customization
- User profile and account management
- Login and registration

## Tech Stack
- Vue 3
- Quasar
- Node.js
- Pinia

## Develop from source 
*node version v18.18.0*
```shell
git clone https://github.com/stepbystepcode/flypen-frontend.git
cd flypen-frontend
npm i
npm i -g @quasar/cli
quasar dev
```

## Build apk file from source 
*node version v18.18.0*
```shell
git clone https://github.com/stepbystepcode/flypen-frontend.git
cd flypen-frontend
npm i
npm i -g @quasar/cli @quasar/icongenie #if network error in China, use cnpm install instead.
sudo apt-get install -y zsh openjdk-8-jdk openjdk-17-jdk
//install Android Studio from https://developer.android.com/studio
echo "org.flypen.app" | quasar mode add capacitor
jq 'del(.server)' ./src-capacitor/capacitor.config.json > ./src-capacitor/edit.json && mv ./src-capacitor/edit.json ./src-capacitor/capacitor.config.json
export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
quasar build -m capacitor -T android
icongenie generate -m capacitor -i ./icon.png
quasar build -m capacitor -T android
wget https://github.com/patrickfav/uber-apk-signer/releases/download/v1.3.0/uber-apk-signer-1.3.0.jar
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
java -jar uber-apk-signer-1.3.0.jar -a ./dist/capacitor/android/apk/release/app-release-unsigned.apk --out signed
```
you will find apk file in ```./signed/app-release-aligned-debugSigned.apk```

## Get Started
### Download the app
[Download Flypen App](https://github.com/stepbystepcode/flypen-frontend/releases/download/latests/app.apk)

The GitHub release apk is automatically deployed via GitHub Actions on push to main branch.

## About
This project was bootstrapped with Quasar Framework. It's designed to be an enterprise team collaboration and communication app with features including chat, cloud file management, and markdown wiki.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact
For any questions, please reach out at 202202501110@email.sxu.edu.cn
