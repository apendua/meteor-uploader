
Npm.depends({
  'connect' : '2.7.10',
});

Package.describe({
  summary: "Allows file uploads to Meteor server.",
});

Package.on_use(function (api, where) {
  api.use(['livedata', 'webapp', 'random'], 'server');
  api.use('insecure', { weak: true });

  // common
  api.add_files('common.js', ['client', 'server']);

  // server
  api.add_files([
    'server.js',
    'secure.js',
  ], 'server');

  // client only
  api.add_files('client.js', 'client');

  if (api.export !== undefined)
    api.export('Upload');
});
