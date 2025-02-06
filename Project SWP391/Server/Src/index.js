const express = require('express')
const app = express()
const routeClient = require('./api/routes/client/index')

const routeAdmin = require('./api/routes/admin/adminIndex')


const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
//connet db
const database = require('./Config/database')
database.connect();

app.use(express.json());

require('dotenv').config();
const port = process.env.PORT

app.use(cookieParser())

// Body
app.use(bodyParser.json())



app.use(cors({
    origin: ['http://localhost:8081', 'http://localhost:8082'], // URL của frontend
    credentials: true // Cho phép gửi cookie
}));

routeClient(app)
routeAdmin(app)

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


