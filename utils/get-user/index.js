const getUser = function(bot, user) {
  return new Promise(function(resolve, reject) {
    bot.api.users.info({ user }, (err, response) => {
      if (err) {
        reject(err);
        return;
      }

      const {
        id,
        real_name: name,
        name: handle,
        tz,
        profile: { email, image_512: avatar }
      } = response.user;

      resolve({ id, name, handle, email, avatar, tz });
    });
  });
};

module.exports = getUser;
