
var Fiber = Npm.require('fibers');
var connect = Npm.require('connect');
var connectHandlers = WebApp.connectHandlers;

var forbidden = function (res) {
  res.statusCode = 403;
  res.setHeader("Content-Type", "application/json; character=utf-8");
  res.end(JSON.stringify({
    error   : 403,
    reason  : "access denied",
    details : "you have no permissions to upload files",
  }));
}

connectHandlers
  .use(connect.query())
  .use(function (req, res, next) {
    if (req.url === "/upload") {
      console.log(req.headers);
    }
    next();
  })
  .use(connect.multipart({}))
  .use(function (req, res, next) {
    
    //TODO: learn how to use deffer mode

    if (req.url === "/upload") {

      var token = req.body.uploadToken;

      if (!_.has(Upload.__token2user__, token)) {
        forbidden(res);
        return;
      }

      Fiber(function () {
        var jsonData = [];
        _.each(req.files, function (file) {
          //console.log('UPLOADED FILE', file.name, 'OF TYPE', file.type);
          //console.log('TO PATH:', file.path);

          jsonData.push({
            path: file.path,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        });

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json; character=utf-8");

        res.end(JSON.stringify(jsonData));
      }).run();

    } else
      next();
  });
