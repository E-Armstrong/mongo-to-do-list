var express = require('express')
var bodyParser = require('body-parser')
var mongo = require('mongodb')
const mongoose = require('mongoose');
var app = express()

mongoose.Promise = global.Promise;

var MongoClient = mongo.MongoClient

const ObjectId = mongoose.Schema.ObjectId;

mongoose.connect('mongodb://localhost:27017/mongo-to-do-list');

app.use(express.static('./public'))

var toDoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isCheckedComplete: {type: Boolean, required: true},
})

let toDoModel = mongoose.model('toDo', toDoSchema)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', function(req, res){
    res.sendFile('./html/index.html', {root: './public'})
})
app.post('/newtodo', function(req, res) {
    console.log('BODY:', req.body.newList);
    let newToDo = {
        name: req.body.newList,
        isCheckedComplete: false,
    };
    console.log(newToDo)
    new toDoModel(newToDo).save(function(err, createdToDo) {
        if (err) { 
            res.status(500).send(err);
            return console.log(err);
        }
        console.log(createdToDo)
        res.status(200).send(createdToDo);
    })
})

app.post("/currenttodos", function(req, res){
    toDoModel.find(
        {},
        function(err, toDos) {
            if (err) {
                res.status(500).send(err);
                return console.log(err);
            }
            res.status(200).send(toDos);
        }
    )
})

app.post("/deletetodo", function(req, res){
    console.log('body:', req.body);
    toDoModel.findOneAndRemove(
        { _id: req.body.id },
        function(err, deletedToDoInfo) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            console.log('It deleted:', deletedToDoInfo)
            res.status(200).send(deletedToDoInfo._id);
        })
})

app.post("/markaschecked", function(req, res){
    console.log('body', req.body.isCheckedComplete)
    toDoModel.updateOne(
        { _id : req.body.id},
        { $set: { isCheckedComplete: req.body.isCheckedComplete === 'false' ? true : false } },
        {new : true},
        function(err, info) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            console.log('It checked:', info)
            res.status(200).send(info);
        })
})

app.listen(8080, function(){
    console.log('server listening on port 8080')
})