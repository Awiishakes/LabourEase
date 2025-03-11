export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken()
    const options = [
        {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: true,
            domain: "https://ingenious-perfection-production.up.railway.app",
            sameSite: "none",
        },
        {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            secure: true,
            domain: "https://ingenious-perfection-production.up.railway.app",
            sameSite: "none",
        }
    ]
    res.status(statusCode).cookie('token', token, options[0]).cookie('checkToken', true, options[1]).json({
        success: true,
        user,
        message,
        token,
    })
}
