const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')

const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())
app.use(cors())

app.use("/order",proxy('http://localhost:8080'))
app.use("/product",proxy('http://localhost:9090'))
app.use("/auth",proxy('http://localhost:7070'))


app.listen(PORT, () => {
    console.log("E-COM Server is running on PORT : 8000");
})