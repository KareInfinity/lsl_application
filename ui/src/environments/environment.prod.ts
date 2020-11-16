var base_url = "https://icumed.eazysaas.com/lifeshield";
export const environment = {
  production: true,
  base_url,
  global_base_url: `${base_url}/global`,
  auth_base_url: `${base_url}/auth`,
  gateway_base_url: `${base_url}/lifeshield`,
  alarm_base_url: `${base_url}/alarm`,
  license_manager_url: `https://icumed.eazysaas.com/pluginstandalone/licensemanager`,
  asset_base_url: `${base_url}/assets` /* for hosting ui inside node server */,
};
