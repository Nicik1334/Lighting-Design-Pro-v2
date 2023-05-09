// 全局配置
const GlobalConfig = {
  IsDark: false,
  AppName: 'Lighting Admin',
  // Api: '/kg10000',
  Api: process.env.NODE_ENV === 'development' ? '/api' : '/area',
  Context: '/',
  UploadUrl: ``,
  DownloadUrl: '',
};

export default GlobalConfig;
