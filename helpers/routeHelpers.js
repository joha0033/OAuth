const Joi = 
  require('joi')

//using Joi to validate for now.
module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      // req.body will become result.value //
      const result = Joi.validate(req.body, schema)
      
      if(result.error){
        return res.status(400).json(result.error)
      }

      if(!req.value){
        req.value = {}
      }

      req.value['body'] = result.value

      return next()
    }
  },
  schemas: {
    //create the auth schema for joi, used as arg above
    registerSchema: Joi.object().keys({
      firstName: Joi.string().allow('', null),
      lastName: Joi.string().allow('', null),
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),
    postSchema: Joi.object().keys({
      title: Joi.string().required(),
      content: Joi.string().required(),
      category: Joi.string().required(),
      level: Joi.any().allow()
    })
  }
}
