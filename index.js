const express = require("express");
const app = express();
const port = 3000;
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ limit: "8mb", extended: false }));
app.use(cors({ maxAge: 86400 }));

app.post("/", (req, res) => {
  console.log(req.body);
  exec(
    `ansible-playbook ${req.body.playbook} -u root --extra-vars \"serverId=${req.body.serverId}\"`,
    (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        res.send(err);
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      res.send(stdout);
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
