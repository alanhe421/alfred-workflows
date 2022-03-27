const [, , query] = process.argv;
const { createHttpClient } = require('./axios');
const { utils } = require('@stacker/alfred-utils');
const [type, value, value2] = utils.splitMultiArgStr(query);

const instance = createHttpClient(process.env.HTTP_API);
function handleDo() {
  if (type === 'systemproxy') {
    return instance.post('/v1/features/system_proxy', {
      enabled: value === 'true'
    });
  } else if (type === 'enhancedmode') {
    return instance.post('/v1/features/enhanced_mode', {
      enabled: value === 'true'
    });
  } else if (type === 'mitm') {
    return instance.post('/v1/features/mitm', {
      enabled: value === 'true'
    });
  } else if (type === 'capture') {
    return instance.post('/v1/features/capture', {
      enabled: value === 'true'
    });
  } else if (type === 'rewrite') {
    return instance.post('/v1/features/rewrite', {
      enabled: value === 'true'
    });
  } else if (type === 'scripting') {
    return instance.post('/v1/features/scripting', {
      enabled: value === 'true'
    });
  } else if (type === 'reloadProfile') {
    return instance.post('/v1/profiles/reload');
  } else if (type === 'switchProfile') {
    return instance.post('/v1/profiles/switch', {
      name: value
    });
  } else if (type === 'module') {
    return instance.post('/v1/modules', {
      [value]: value2 === 'true'
    });
  } else if (type === 'selectPolicyGroup') {
    return instance.post('/v1/policy_groups/select', {
      group_name: value,
      policy: value2
    });
  } else if (type === 'log') {
    return instance.post('/v1/log/level', {
      level: value
    });
  } else if (type === 'rules') {
    return instance.get('/v1/rules');
  }
}

handleDo().then(() => console.log('ok'));
