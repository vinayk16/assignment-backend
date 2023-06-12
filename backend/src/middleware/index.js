const admin = require('../config/firebase-config');
const jwt = require("jsonwebtoken");
const SECRET_KEY = "Vooshproject";

class Middleware {
	async decodeToken(req, res, next) {
		const token = req.headers.authorization.split(' ')[1];
		if(req.headers['tokentype']==='jwt'){
			
			try {
				if(token){
					let user = jwt.verify(token, SECRET_KEY );
					req.userId = user.id;
					req.phoneno=user.phoneno;
				}
				else{
					return res.status(401).json({message: "Unauthorized User"});
				}
				return next();
			} catch (error) {
				return res.status(401).json({message: "Unauthorized User"});
			}
		
		}else if(req.headers['tokentype']==='google'){
		try {
			const decodeValue = await admin.auth().verifyIdToken(token);
			if (decodeValue) {
				req.authresponse=decodeValue;		
				return next();
			}
			return res.json({ message: 'Unauthorized' });
		} catch (e) {
			return res.json({ message: 'Internal Error' });
		}
	}
	}
}
module.exports = new Middleware();