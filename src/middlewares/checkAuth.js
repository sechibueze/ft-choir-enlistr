module.exports = function (req, res, next) {
  // console.log('member: ', req.session.member);
  if (req.session.member == undefined) {
    return res.redirect('/login');
  } else {
    next();
  }

}