import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.security = {
    // 关闭 csrf 在开发阶段的校验
    csrf: {
      enable: false
    }
  }

  return config;
};
