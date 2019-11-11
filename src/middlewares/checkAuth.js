module.exports = function (req, res, next) {
  // console.log('member: ', req.session.member);
  if (req.session.member == undefined) {
    req.session.message = 'Auth failed :( => Jn 10:1';
    return res.redirect('/login');
  } else {
    next();
  }

}