const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const amqp = require('amqplib')

const Order = require('./model/order')
const isAuthenticated = require('../helper/athentication')


require('./db')();
const PORT = process.env.PORT || 8080

const app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.json())

app.listen(PORT , () => {
    console.log("Order service is running on PORT : 8080");
})

var channel, connection;

async function connect(){
    const amqpServer = "amqp://localhost:5672"

    connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()

    await channel.assertQueue("ORDERS")
    console.log("asddadas");

}
function createOrder(products, userEmail){

    let total =0
    for(let i=0 ; i < products.length ; i++){
        total +=products[i].price
    }
    const newOrder = new Order({
        products,
        user: userEmail,
        total_price: total
    })
    newOrder.save()
    return newOrder
}

connect().then( () => {
    channel.consume("ORDERS", data => {
        console.log("Comsumming ORDER queue..");
        const { products, userEmail} = JSON.parse(data.content)

        const newOrder = createOrder(products, userEmail)
        channel.ack(data)
        channel.sendToQueue("PRODUCTS", Buffer.from(JSON.stringify({newOrder})))

    })
}).catch( err => {
    console.log("error : ", err);
})

app.get("/orders", isAuthenticated, async (req, res) => {
    data = await Order.find()
    return res.json({
        "orders": data
    })
})



