const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const amqp = require('amqplib')

const Product = require('./model/product')
const isAuthenticated = require('../helper/athentication')
// const Order = require('../order-service/model/order')

const PORT = process.env.PORT || 9090
require('./db')();
const app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
// app.use(express.json())

app.listen(PORT , () => {
    console.log("Product service is running on PORT : 9090");
})

var channel, connection;
var order;
async function connect(){
    const amqpServer = "amqp://localhost:5672"

    connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()

    await channel.assertQueue("PRODUCTS")
    // console.log("asddadas");

}
connect()

app.post('/create', isAuthenticated, async (req, res) =>{

    const { name, description, price} = req.body

    const newProduct = new Product({
        name,
        description,
        price
    })
    newProduct.save()
    return res.json(newProduct)
})

app.post('/buy',isAuthenticated, async (req, res) => {
    const {ids} = req.body
    try{
        const products = await Product.find({_id : { $in : ids}})
            
        channel.sendToQueue(
            "ORDERS", Buffer.from(
                JSON.stringify({
                    products,
                    userEmail: req.user.email
                })
            )
        )
        channel.consume(
            "PRODUCTS", data => {
                order={}
                console.log("Consuming in PRODUCTS queue...", order);
                
                order = JSON.parse(data.content)
                channel.ack(data)
                console.log("order :", order);
                return res.json({order})
            }
        );
    }catch(err){
        console.log("error in finding data in db :", err);
        res.sendStatus(500);
        return;
    }
    
})
