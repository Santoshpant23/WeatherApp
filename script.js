const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempValue, oriValue) => {
  let temperature = tempValue.replace("{%tempval%}", oriValue.main.temp);
  temperature = temperature.replace("{%tempmin%}", oriValue.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", oriValue.main.temp_max);
  temperature = temperature.replace("{%location%}", oriValue.name);
  temperature = temperature.replace("{%country%}", oriValue.sys.country);
  temperature = temperature.replace("{%tempstatus%}", oriValue.weather[0].main);

  return temperature;
};
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=kathmandu&units=metric&appid=55c861411947849b6417fdd40c9c7d0e"
    )
      .on("data", function (chunk) {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join(" ");
        res.write(realTimeData);

        console.log(realTimeData);
      })
      .on("end", function (err) {
        if (err) return console.log("Connection closed due to:", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(80, "127.0.0.1", () => {
  console.log(`Listening at http://localhost/`);
});
