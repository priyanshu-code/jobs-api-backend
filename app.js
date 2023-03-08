require('dotenv').config();
require('express-async-errors');
const helmet = require('helmet')
// const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


const express = require('express');
const app = express();
//connect db
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')
// routers
 
const authRouter = require('./routes/auth') 
const jobsRouter = require('./routes/jobs')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
app.set('trust proxy',1)
app.use(rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));
// const corsOptions ={
//   origin:'https://job-tracker-9t75.onrender.com', 
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// }
app.use(express.json());
app.use(helmet());
// app.use(cors());
app.use(xss());
// extra packages
app.get('/',(req,res)=>{
  res.send("jobs Api")
})
// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser,jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
 
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
