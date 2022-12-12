const {Strategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const SECRET = process.env.APP_SECRET;
const User = require('../Models/User');

// pour choisir format token
var options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
};

passport.use(
    new Strategy(options, async ({ id }, done) => { // req={id} , res=done
 // console.log('Now in middleware');
 try {
    const user = await User.findById(id).populate('orders'); //accée sur la base de donne avec id
    if (!user) {
        //done(null, "User not found")
        throw new Error('User not found. ');
    }
    done(null, user);
    /* done.status(200).json({
        msg: "user",
        data: user
    }) */
 } catch (error) {
    done(null, error.message);
 }   
})
);

