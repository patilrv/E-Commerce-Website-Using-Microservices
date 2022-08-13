const jwt = require('jsonwebtoken')

jwt_key = "mt-15"

module.exports = async function isAuthenticated(req, res, next) {

    try{
        const token = req.headers['authorization'].split(" ")[1]
        jwt.verify(token, jwt_key , (err, user)=> {
            if(err){
                return res.json({
                    error: err
                })

            }
            else{
                req.user = user
                next()
            }
        })
    }catch(err){
        return res.status(500).json({
            errorInAuth: " token missing.."
        })
    }
}