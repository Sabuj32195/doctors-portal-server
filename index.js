const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config()
const port = process.env.PORT || 5000;
const app = express()
// middleware
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://doc-portal:kXZ42ArURlfvq0J4@cluster0.rxupo7n.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
    const appoinmentOptionCollection=client.db('doctorsPortal').collection('appoinmentOptions')
    const bookingCollection=client.db('doctorsPortal').collection('bookings')
    const userCollection=client.db('doctorsPortal').collection('users')


    app.get('/appointmentOptions',async(req,res)=>{
        const date=req.query.date;
       
        const query={}
        const options=await appoinmentOptionCollection.find(query).toArray()
        const bookingQuery={TreatmentDate:date}
        const alreadyBooked=await bookingCollection.find(bookingQuery).toArray()
     
        options.forEach(option=>{
            const optionBooked=alreadyBooked.filter(book=>book.Treatment==option.name)
            
            const bookedSlots=optionBooked.map(book=>book.Slot)
            const remainingSlots=option.slots.filter(slot=>!bookedSlots.includes(slot))
            console.log(remainingSlots.length)

            // const remainingSlots=option.Slots.filter(Slot=>!bookedSlots.includes(Slot))
             option.slots=remainingSlots
        })

        res.send(options)
    })

    app.get('/bookings',async(req,res)=>{
        const email=req.query.email;
        console.log(email)
        const query={Email:email};
        const bookings=await bookingCollection.find(query).toArray()
        res.send(bookings)
    })

    app.post('/users',async(req,res)=>{
        const user=req.body;
        const result=await userCollection.insertOne(user)
        res.send(result)
    })
    app.post('/bookings',async(req,res)=>{
        const booking=req.body;
       
        const result= await bookingCollection.insertOne(booking)
        res.send(result)

    })

}
finally{

}
}
run()
.catch(console.log)


app.get('/', async (req, res) => {
    res.send('doctors portal server is running')
})

app.listen(port, () => {
    console.log(`doctors portal is running on ${port}`)
})