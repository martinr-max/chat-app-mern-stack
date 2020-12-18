const express = require('express');
const app = express();
const path = require('path')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const http = require('http').createServer(app);
const socketIO = require('./socket/socket')
const io = require('socket.io')(http);
const mongoDb = 'mongodb+srv://MartinR:Ukumasing1@cluster0.qyiy9.mongodb.net/chat?retryWrites=true&w=majority';

socketIO(io, app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});

app.use('/user', userRoutes);
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((error, req, res, next) => {
  if(req.file) {
      fs.unlink(req.file.path, err => {
          console.log(err);
      }) 
  }
  if(res.sentHeader) {
      return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'Unknown error'})
});

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDb, {
       useNewUrlParser: true,
       useUnifiedTopology: true
     });
    http.listen('8080', () => {
       console.log('Server has started');
     });
  }
  catch(err) {
    console.log(err.message);
  }
}

connectDB();

