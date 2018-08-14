const path = require('path');
const express = require('express');

const publichPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
app.use(express.static(publichPath));

app.listen(port, () =>{
  console.log(`Server is running on port ${port}`);
});
