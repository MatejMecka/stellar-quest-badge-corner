// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require('body-parser')
const StellarSdk = require('stellar-sdk');
const app = express();

const server = new StellarSdk.Server('https://horizon.stellar.org');
var balances = ["SQ0101", "SQ0102", "SQ0103", "SQ0104", "SQ0105", "SQ0106", "SQ0107", "SQ0108", "SSQ01", "SQ0201", "SQ0202"]

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/verify", (request, response) => {
  console.log(request.body)
  let public_key = request.body["pubkey"]
  
  server.accounts()
    .accountId(public_key)
    .call().then(
    function(r){ 
      var counter = 0
      var found_badges = []
      for(var i=0; i < r["balances"].length; i++){
        if(balances.indexOf(r["balances"][i]["asset_code"]) != -1){
          found_badges.push(r["balances"][i]["asset_code"])
          counter++
        }
      }; 
      if(counter > r["balances"].length){
        response.json({"badges": found_badges})
      }
    });
  
  
  response.json({"nesho":"nesho"});
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
