const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const { errorHandler } = require('../helper/dbErrorHandling');

// use sendgrid for send email
const sgMail = require('@sendgrid/mail');
const { response } = require('express');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = async (req, res) => {
    try {
        // check user
        const { email, password } = req.body;

        var user = await User.findOne({ email })
        // console.log(user)

        // If user exists
        if (user) {
            return res.status(400).json({
                errors: 'มีบัญชีผู้ใช้งานนี้เเล้วในระบบ!'
            });
        }
        // -----------------------------------------------------------------------------------

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt);

        const activation_token = jwt.sign(
            {
                email,
                password: passwordHash
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: '50m'
            }
        );

        const msg = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Account activation link',
            html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                      <h2>Please use the following to activate your account</h2>
                      <a href=${process.env.CLIENT_URL}/users/activate/${activation_token} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Verify your email address</a>
                      <hr />
                      <p>This email may contain sensetive information</p>
                      <p>${process.env.CLIENT_URL}</p>
                      </div>
                  `
        };

        sgMail.send(msg).then((sent) => {
            return res.json({
                message: `Email has been sent to ${email} Please Verify your email address`
            });
        }).catch(err => {
            return res.status(400).json({
                success: false,
                errors: errorHandler(err)
            });
        });

    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.activation = async (req, res) => {
    try {
        const { activation_token } = req.body
        const user = jwt.verify(activation_token, process.env.JWT_ACCOUNT_ACTIVATION)

        const { email, password } = user

        const check = await User.findOne({ email })
        if (check) return res.status(400).json({ message: "คุณเคยลงทะเบียนไว้เเล้ว" })

        const newUser = new User({
            email,
            password
        })

        await newUser.save()
        return res.json({ message: "Account has been activated!" })


    } catch (err) {
        // res.status(500).send('server error')
        return res.status(500).json({ errors: errorHandler(err) })
    }
}

exports.login = async (req, res) => {
    try {
        // check user 
        const { email, password } = req.body;
        var user = await User.findOneAndUpdate({ email }, { new: true });
        if (user && user.enabled) {
            // check password user
            const isSame = await bcrypt.compare(password, user.password);

            if (!isSame) {
                // return res.status(400).send("รหัสผ่านไม่ถูกต้อง")
                return res.status(400).json({
                    errors: 'รหัสผ่านไม่ถูกต้อง!'
                });
            }

            // Payload
            const payload = {
                user: {
                    email: user.email,
                    role: user.role
                }
            }

            // generate token
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (error, token) => {
                if (error) throw error;
                res.json({ token, payload })
            });


        } else {
            // return res.status(400).send('ไม่พบผู้ใช้งาน')
            return res.status(400).json({
                errors: 'ไม่พบผู้ใช้งานในระบบ'
            });
        }


    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}


exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ errors: "ไม่พบบัญชีผู้ใช้งาน" })

        const reset_token = jwt.sign(
            {
                _id: user._id
            },
            process.env.JWT_RESET_PASSWORD,
            {
                expiresIn: '50m'
            }
        );

        const msg = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Password Reset Link',
            html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                      <h2>Please use the following to reset your password</h2>
                      <a href=${process.env.CLIENT_URL}/users/reset/${reset_token} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Reset Password</a>
                      <hr />
                      <p>This email may contain sensetive information</p>
                      <p>${process.env.CLIENT_URL}</p>
                      </div>
                  `
        };

        sgMail.send(msg).then((sent) => {
            return res.json({
                message: `Email has been sent to ${email} Please Reset your password`
            });
        }).catch(err => {
            return res.status(400).json({
                success: false,
                errors: errorHandler(err)
            });
        });

    } catch (err) {
        return res.status(500).json({ errors: err.message })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { reset_token, password } = req.body
        // console.log(password)
        const user = jwt.verify(reset_token, process.env.JWT_RESET_PASSWORD)
        const { _id } = user

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt);

        await User.findOneAndUpdate({ _id }, {
            password: passwordHash
        })
        res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" })

    } catch (err) {
        return res.status(500).json({ errors: err.message })
    }
}

exports.currentUser = async (req, res) => {
    try {
        // model user
        console.log(req.user)
        const user = await User.findOne({ email: req.user.email })
            .select('-password').exec();
        res.send(user);
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.showUser = async (req, res) => {
    try {
        res.send('get')
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.editUser = async (req, res) => {
    try {
        res.send("edit user")
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.deleteUser = async (req, res) => {
    try {
        res.send("delete user")
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}



