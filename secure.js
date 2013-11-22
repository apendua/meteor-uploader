
// TODO: make the tokens expire after some time
// TODO: use database, since otherwise the tokens can die to eraly :/
Upload.__token2user__ = {};
Upload.__user2token__ = {};

var allow = [];
var deny  = [];

Upload.allow = function (callback) {
  if (!_.isFunction(callback))
    throw new Error('callback must be a function, not ' + typeof(callback));

  allow.push(callback);
}

Upload.deny = function (callback) {
  if (!_.isFunction(callback))
    throw new Error('callback must be a function, not ' + typeof(callback));

  deny.push(callback);
}

Meteor.methods({
  __get_upload_token__: function () {

    var userId = Meteor.userId();

    // there already exist a token for this userId
    if (_.has(Upload.__user2token__, userId))
      return Upload.__user2token__[userId];

    var token = Random.id();

    if (isInsecure()) {
      Upload.__token2user__[token] = null;
      return token;
    }

    var args = _.toArray(arguments);
    args.unshift(userId);

    // TODO: what context should we use?
    if (userId && someAllow({}, args) && !someDeny({}, args)) {
      Upload.__token2user__[token] = userId;
      Upload.__user2token__[userId] = token;
      return token;
    }

    throw Meteor.Error(403);
  },
});

// helpers

var isInsecure = function () {
  return !!Package.insecure;
}

var someAllow = function (self, args) {
  return _.some(allow, function (callback) {
    return callback.apply(self, args);
  });
}

var someDeny = function (self, args) {
  return _.some(deny, function (callback) {
    return callback.apply(self, args);
  });
}
