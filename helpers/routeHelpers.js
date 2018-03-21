const Joi = require('joi')

module.exports = {
  validateBody: (schema) => {
    // console.log(schema);
    return (req,res,next) => {

      console.log('req.body', req.body);
      const result = Joi.validate(req.body, schema)
      console.log(result);
      if(result.error){
        return res.status(400).json(result.error)
      }

      if(!req.value){
        req.value = {}
        console.log('req.value', req.value);
      }
      // req.value.body will be the
      // validated request, not req.body
      req.value['body'] = result.value
      console.log('req.value', req.value);
      return next()

    }

  },
  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }
}
