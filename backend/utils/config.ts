export const 
  DEV=      process.env.production !== 'production' , 
  DEBUG=    process.env.DEBUG == 'express:*,app* ',
  PORT=     process.env.PORT || '3004',
  DB_URL=   process.env.MONGO_URI || 'mongodb://localhost:27017/reservation'
