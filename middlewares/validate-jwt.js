const jwt = require("jsonwebtoken");
const { request, response } = require("express");
const UserModel = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
        
        const token = req.header("xtoken");

        if (!token) {

              return res.status(401).json({
                msg: "Not has token in response",
              });
        }

        try {

              const {cedula} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
              
              console.log({cedula});
              
              const userAuth = await UserModel.findById(cedula); 

              console.log({userAuth});

              if (!userAuth) {

                    return res.status(401).json({
                      message: 'Token no valido. El usuario no existe en la DB'
                    })
              } 

              if (!userAuth.status) {

                    return res.status(401).json({
                      message: 'Token no valido. El usuario con estado: false'
                    })

              }

              console.log("Token is valid");

              req.userAuth = userAuth; 

      } catch (error) {

              console.log(error);
              res.status(401).json({
                message: "Token not validate",
              });
        }
        
      //Next validation. See docs.
      next();
  
};

module.exports = {
  validateJWT,
};
