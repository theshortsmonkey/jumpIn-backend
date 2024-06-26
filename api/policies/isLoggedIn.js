module.exports = async function (req, res, proceed) {

  // If `req.me` is set, then we know that this request originated
  // from a logged-in user.  So we can safely proceed to the next policy--
  // or, if this is the last policy, the relevant action.
  // > For more about where `req.me` comes from, check out this app's
  // > custom hook (`api/hooks/custom/index.js`).
  console.log('User ID -> ', req.session.userId)
  console.log(req.method,' --> ',req.url)
  if (req.session.userId) {
    return proceed();
  }

  //--•
  // Otherwise, this request did not come from a logged-in user.
  return res.forbidden();

};