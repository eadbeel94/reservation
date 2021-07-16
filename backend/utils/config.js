module.exports= {
  DEV:      process.env.production !== 'production' , 
  DEBUG:    process.env.DEBUG == 'express:*,app* ',
  HOT_REL:  process.env.HOT_RELOAD != "false",
  PORT:     process.env.PORT || '3003',
  DB_URI:   process.env.MONGO_URI,
  NOT_AUTH: process.env.NOT_AUTH === "true",
  TEST_ID:  process.env.TEST_ID || false 
}