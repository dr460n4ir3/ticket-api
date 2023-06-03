import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
const app = express();

const port = process.env.PORT //|| 5000;
//console.log(`${port}`);
const uri = process.env.MONGODB_URI;
const db = process.env.DB_PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('this is the dirname: ', __dirname);


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



mongoose
    .connect(`${uri}`)
    .then(() => {
        app.listen(db, () => {
            console.log(`Server is running on http://localhost:${port}`);
            console.log(`MongoDB is running on ${db}`);
        });
    })
    .catch((err) => {
        console.log('Error connecting to DB', err);
        console.error(err);
    });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const Schema = mongoose.Schema;

const status = ['New', 'In Progress', 'Closed', 'Reopened']

const ticketSchema = new Schema({
    subject: String,
    description: String,
    status: New,
    date: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);



app.post('/tickets/add', (req, res) => {
    const subject = req.body.subject;
    const description = req.body.description;
    const status = req.body.status;
    const date = Date.parse(req.body.date);

    const newTicket = new Ticket({
        subject,
        description,
        status,
        date
    });

    newTicket.save()
        .then(() => res.json('Ticket added!'))
        .catch((err) => res.status(400).json('Error: ' + err));
});

app.get('/tickets', (req, res) => {
    Ticket.find()
        .then((tickets) => res.json(tickets))
        .catch((err) => res.status(400).json('Error: ' + err));
});

app.get('/tickets/:id', (req, res) => {
    Ticket.findById(req.params.id)
        .then((ticket) => res.json(ticket))
        .catch((err) => res.status(400).json('Error: ' + err));
});

app.put('/tickets/update/:id', (req, res) => {
    Ticket.findById(req.params.id)
        .then((ticket) => {
            ticket.subject = req.body.subject;
            ticket.description = req.body.description;
            ticket.status = req.body.status;
            ticket.date = Date.parse(req.body.date);

            ticket.save()
                .then(() => res.json('Ticket updated!'))
                .catch((err) => res.status(400).json('Error: ' + err));
        })
        .catch((err) => res.status(400).json('Error: ' + err));
});

app.delete('/tickets/:id', (req, res) => {
    Ticket.findByIdAndDelete(req.params.id)
        .then(() => res.json('Ticket deleted.'))
        .catch((err) => res.status(400).json('Error: ' + err));
});

app.delete('/tickets', (req, res) => {
    Ticket.deleteMany()
        .then(() => res.json('All tickets deleted.'))
        .catch((err) => res.status(400).json('Error: ' + err));
});


app.get('/test', (req, res) => {
  //res.json({ test_message: "testing mctesty" });
  //res.status(200).send({ './test.ejs' : 'test' });
  // send test.html file back to the client
  res.sendFile(__dirname + '/test.html');
});

app.get('/', (req, res) => {
  res.json({ Hello: "Dr460n4ir3 LLC" });
});

app.get('/john.doe', (req, res) => {
  res.json({
    name: "John Doe",
    age: 30,
    address: "123 Main St.",
    city: "New York",
    state: "NY",
    zip: "10001",
    phone: "202-444-4444"
  });
});

app.get('/monster', (req, res) => {
  res.json({
    name: "Monster",
    hp: 100,
    attack: 20,
    defense: 10,
    speed: 5
  });
});

app.get('/monster2', (req, res) => {
  res.json({
    name: "Monster2",
    hp: 100,
    attack: 20,
    defense: 10,
    speed: 5
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
});

/*
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {

    console.log("Connected to MongoDB");
}
);
*/
console.log(process.env.uri);
