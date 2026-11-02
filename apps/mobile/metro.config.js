// SDK 52+ mendeteksi monorepo (watchFolders dan nodeModulesPaths) secara otomatis.
const { getDefaultConfig } = require('expo/metro-config');
module.exports = getDefaultConfig(__dirname);
