require('dotenv').config();
const globalErrorHandler = require('./middlewares/error.middleware')
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const accountRoutes = require('./routes/account.routes');
const userRoutes = require('./routes/user.routes')
const morgan = require('morgan');
const cors = require('cors');
const setupSwagger = require('./utils/swagger');

const corsOption = {
    origin: [
        'http://localhost:3000',
        'http://localhost:8080'
    ],
    credentials: true
}

app.use(cors(corsOption));

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/accounts', accountRoutes);
app.use('/api/users', userRoutes)

app.use(globalErrorHandler);

setupSwagger(app);

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});