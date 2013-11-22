
Upload.files = function (listOfFiles, options) {
  // callbacks
  var onProgress = options.progress || function () {};
  var onLoad     = options.load     || function () {};
  var onError    = options.error    || function () {};

  Meteor.call('__get_upload_token__', function (err, res) {

    if (err) {
      onError(err);
      return;
    }

    for (var i = 0; i < listOfFiles.length; i++) {

      (function () {
        var xhr = new XMLHttpRequest(),
            formData = new FormData(),
            index = i,
            token = res;

        console.log('using token', token);

        formData.append('uploadToken', token);
        formData.append('fileToUpload', listOfFiles[i]);

        // TODO: put encrypted token in URL rather then in form data
        xhr.open("POST", "/upload");
        xhr.setRequestHeader('upload-secret', token);
        
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            onProgress(event.loaded / event.total, index);
          }
          // else: size is unknown
        }
        xhr.onload = function (e) {
          var json = JSON.parse(e.target.response);
          if (_.isArray(json))
            json = json[0];
          if (json.error)
            onError(json);
          else
            onLoad(json);
        }
        xhr.onerror = function (e) {
          // TODO: find out more details
          onError({
            error: e.target.status
          });
        }
        xhr.send(formData);
      })();

    }

  });
}
