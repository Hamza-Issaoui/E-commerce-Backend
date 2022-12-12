const Admin = require("../Models/Admin");
const User = require("../Models/User");
const Customer = require("../Models/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { randomBytes, verify } = require("crypto");
const { join } = require("path");
const { use } = require("../Routes/authRouter");
const consola = require("consola");
const DOMAIN = process.env.APP_DOMAIN;
const SECRET = process.env.APP_SECRET;
const FRONT = process.env.FRONT_URL;

var RefreshTokens = [];

// transport nodemailer avec service mailtrap
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io", // Simple Mail Transfer Protocol
  port: 2525,
  auth: {
    user: process.env.APP_USER_TRANSPORT,
    pass: process.env.APP_PASS_TRANSPORT,
  },
});

module.exports = {
  registerAdmin: async (req, res) => {
    try {
      req.body["picture"] = !req.file ? "avatar.png" : req.file.filename;
      const password = bcrypt.hashSync(req.body.password, 10);

      const newAdmin = new Admin({ ...req.body, password, verified: true }); // instance
      await newAdmin.save(); // execution du requete dans db

      res.status(201).json({ msg: "Admin registred !", data: newAdmin });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  registerCustomer: async (req, res) => {
    console.log(req.body["picture"], "body");
    try {
      req.body["picture"] = !req.file ? "avatar.png" : req.file.filename;
      const password = bcrypt.hashSync(req.body.password, 10); // cryptage 10 fois du password
      const newCustomer = new Customer({
        ...req.body,
        password,
        verificationCode: randomBytes(6).toString("hex"), // cnvertir le code de verification en hexadecimal
      });
      await newCustomer.save();
      res.status(201).json({ msg: "Customer registred !", data: newCustomer });
      // transport nodemailer avec service google
      transport.sendMail(
        {
          to: newCustomer.email,
          subject: "Welcome " + newCustomer.fullname,
          text: "hello ",
          html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <h1>Hello ${newCustomer.fullname}!</h1>
        <p> We are glad to have you at our site .</p>
        <p>Please click the following link to verify your account</p>
        <a href="${DOMAIN}/verify-now/${newCustomer.verificationCode}">Verify Email</a>
    </div>
</body>
</html>
        `,
        },
        // verifier l'erreur send mail
        (err, info) => {
          if (err) {
            console.log("error : ", err.message);
          } else {
            console.log("Email sent : ", info.response);
          }
        }
      );
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  /*
   * @description to verify a new User's account via email
   * @access /verify-now/: verificationCode
   * @ api Public <only via email
   * @type Get
   */
  GetAllCustomers: async (req, res) => {
    try {
      const listeCustomers = await Customer.find();
      res.status(200).json({
        msg: "read all Users",
        data: listeCustomers,
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetUserById: async (req, res) => {
    try {
      const User = await Customer.findById({
        _id: req.params.id,
      });
      res.status(200).json({
        msg: "User found by id",
        data: User,
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetUserByName: async (req, res) => {
    try {
      const customer = await Customer.find({ name: req.query.name });
      res.status(200).json({
        msg: "User founded",
        status: 200,
        data: customer,
      });
    } catch (error) {
      res.status(406).json({ status: 406, message: error.message });
    }
  },
  UserByName: async (req, res, next) => {
    let { q } = req.query;

    let data = await Customer.find({
      $or: [
        { fullname: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
      ],
    });
    res.status(201).json(data);
  },
  deleteUser: async (req, res) => {
    try {
      await Customer.deleteOne({
        _id: req.params.id,
      });
      res.status(200).json({
        msg: "User deleted",
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const user = await User.findOne({
        verificationCode: req.params.verificationCode,
      });
      user.verified = true;
      user.verificationCode = undefined;
      console.log("user.verified");
      user.save();
      res.sendfile(join(__dirname, "../Templates/success.html"));
      // res.status(201).json({ msg: "Email verified !", data: user.verified });
    } catch (error) {
      res.sendfile(join(__dirname, "../Templates/error.html"));
      //res.status(406).json({ msg: error.message });
    }
  },
  logIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        email: req.body.email,
      });

      if (!user) {
        res.status(404).json({
          status: 404,
          msg: "email not found !",
        });
      } else {
        if (user.verified === true) {
          const passwordCompare = bcrypt.compareSync(password, user.password); // comparaison des deux password
          if (!passwordCompare) {
            // if password incorrect
            return res.status(406).json({
              status: 406,
              msg: "password Incorrect !",
            });
          }

          // 2eme etape creation de token
          const token = jwt.sign(
            {
              id: user._id,
              user: user,
            },
            SECRET,
            {
              expiresIn: "1 m",
            }
            /* { expiresn:'24h'} */
          );

          var refreshToken = jwt.sign({ id: user._id }, SECRET, {
            expiresIn: 86400, // 24 hours
          });
          RefreshTokens[refreshToken] = user._id;

          const result = {
            email: user.email,
            user: user,
            token: token,
            expiresIn: 1,
            // key: value
            refreshToken: refreshToken,
          };
          res.status(200).json({
            ...result,
            msg: "you are connected",
            success: true,
          });
        } else {
          res.status(404).json({
            msg: "your account is not verified",
          });
        }
      }
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  refreshToken: async (req, res) => {
    try {
      var refreshToken = req.body.refreshToken;
      if (refreshToken in RefreshTokens) {
        const token = jwt.sign(
          // creation d'autorization token
          {
            user: req.user,
          },
          SECRET,
          {
            expiresIn: "7h",
          }
        );
        var refreshToken = jwt.sign({ id: req.user }, SECRET, {
          expiresIn: 86400, //24 hours
        });
        RefreshTokens[refreshToken] = req.user;
        res.status(200).json({
          accesstoken: token,
          refreshToken: refreshToken,
        });
      } else {
        res.status(406).json({ msg: "token not found" });
      }
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  profile: async (req, res) => {
    try {
      const user = req.user;
      res.status(200).json({
        user: user,
      });
    } catch (error) {
      res.status(404).json({
        msg: error.message,
      });
    }
  },
  updateProfile: async (req, res) => {
    const user = req.params.id;

    const picture = user.picture;

    req.body["picture"] = !req.file ? picture : req.file.filename;

    Customer.findByIdAndUpdate(user, req.body, { new: true }, (err, item) => {
      if (err) {
        res.status(406).json({ message: "failed to updated user" });
      } else {
        res.status(201).json({ message: " user updated", data: item });
      }
    });
  },
  logout: async (req, res) => {
    try {
      var refreshToken = req.body.refreshToken;
      // console.log("refreshTokens : ", RefreshTokens)
      //console.log(delete RefreshTokens[refreshToken]);
      //if (refreshToken in RefreshTokens) {
      delete RefreshTokens[refreshToken];
      res.json({
        status: "success",
        msg: "Logout",
      });
    } catch (error) {
      res.status(404).json({
        msg: error.message,
      });
    }
  },
  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body; // entrer l'email dans body {email:}
      const user = await User.findOne({ email }); //chercher l'existance du email
      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }
      const resetPassWordToken = jwt.sign(
        // cree token du resetPasswordToken
        { id: user._id },
        SECRET,
        { expiresIn: "1h" } // date d'expiration
      );
      user.resetPassWordToken = resetPassWordToken;
      await user.save();
      res.status(201).json({ msg: "email sent" }); // affiche postman
      transport.sendMail(
        {
          to: user.email,
          subject: "Welcome " + user.fullname,
          text: "hello ",
          html: `
      <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  </head>
  <body>
  <div>
      <h1>Hello ${user.fullname}!</h1>
      
      <a href="${FRONT}/resetPassword/${resetPassWordToken}">Reset Password</a>
  </div>
  </body>
  </html>
      `,
        },
        // verifier l'erreur send mail
        (err, info) => {
          if (err) {
            console.log("email n'existe pas : ", err.message);
          } else {
            console.log("Email sent : ", info.response);
          }
        }
      );
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const resetPassWordToken = req.params.resetPassWordToken; // put the resetPasswordToken in params

      if (resetPassWordToken) {
        //pour verifier la date d'expiration de resetPasswordToken
        jwt.verify(resetPassWordToken, SECRET, async (err) => {
          //verifier les variables d'environnement dotenv

          if (err) {
            return res.json({
              error: "incorrect token or it is expired",
            });
          }
          const user = await User.findOne({
            resetPassWordToken: resetPassWordToken,
          });
          const salt = bcrypt.genSaltSync(10)
          user.password = bcrypt.hashSync(req.body.password, salt); // crypter ,le nouveau password dans body {newPass}
          user.resetPassWordToken = undefined; // supprimer token resetpasswordtoken
          user.save();

          return res.status(200).json({
            msg: "password has been changed",
          });
        });
      }
    } catch (error) {
      res.status(404).json({ msg: error.message });
    }
  },
};
