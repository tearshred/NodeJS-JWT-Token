const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    
    try{
        // Decoding and verifying the token. The "jwt.decode" only 
        // decodes the token without verification, thus we use this.
        const decodeTopken = jwt.verify(req.body.token, process.env.JWT_KEY);
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Auth failed"
        });
    }
    
    
    
}; 