const http = require ('http');
const fs = require ('fs');
var requests = require('requests');

const mainfile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempval,orgval)=>{
    let temperature = tempval.replace("{%tempval%}", Math.floor(orgval.main.temp-273));
    temperature = temperature.replace("{%tempmin%}", Math.floor(orgval.main.temp_min-273));
    temperature = temperature.replace("{%tempmax%}", Math.floor(orgval.main.temp_max-273));
    temperature= temperature.replace("{%location%}",orgval.name);
    temperature =temperature.replace("{%Country%}", orgval.sys.country);
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url=="/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Solan&appid=6c764e32178bf6e275a6b5f42563611f')
        .on('data', function (chunk) {
            const objData= JSON.parse(chunk);
        //   console.log(objData);
          const arrData = [objData];
        //   console.log(arrData[0].main.temp-273.00);

        const realTimeData= arrData.map((val) => replaceVal(mainfile, val)).join("");
    // replaceVal(mainfile, val);
        res.write(realTimeData);
        //console.log(realTimeData);
        })
        .on('end', function (err) {
          if (err) return console.log('connection closed due to errors', err);
         
          res.end();
        });


    }
    else{
        res.end("File Not Found!");
    }

})
server.listen(8000, "127.0.0.1");