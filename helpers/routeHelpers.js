const Joi = require('joi')

//using Joi to validate for now.
module.exports = {
  validateBody: (schema) => {

    //schema is defined as schems.authSchema below
    return (req,res,next) => {

      // req.body will become result.value //
      const result = Joi.validate(req.body, schema)

      //any errors?
      if(result.error){
        return res.status(400).json(result.error)
      }

      //if req.value doesn't exist, create
      if(!req.value){
        req.value = {}
      }

      // create req.value.body with results.value
      req.value['body'] = result.value

      return next()

    }

  },
  schemas: {
    //create the auth schema for joi, used as arg above 
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()

    })
  }
}
