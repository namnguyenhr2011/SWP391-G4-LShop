const express = require('express')
const app = express()
const routeClient = require('./api/routes/client/index')

const routeAdmin = require('./api/routes/admin/adminIndex')
const routeSale = require('./api/routes/sale/SaleIndex')
const routeShipper = require('./api/routes/shipper/shipperIndex')

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

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));



app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true
}));

require('./api/controllers/admin/discountScheduler');

routeClient(app)
routeAdmin(app)
routeSale(app)
routeShipper(app)

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


