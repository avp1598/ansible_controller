const express = require("express");
const app = express();
const port = 3000;
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ limit: "8mb", extended: false }));
app.use(cors({ maxAge: 86400 }));

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.post("/createSurf", (req, res) => {
  // generate random seed
  const seed = Math.floor(Math.random() * 1000000000);
  console.log(req.body);
  try {
    exec(
      `echo ${req.body.ip} > ${
        req.body.ip
      } && ansible-playbook playbooks/createSurf.yml -u root --extra-vars \"seed=${seed.toString()}\" -i ${
        req.body.ip
      } && rm ${req.body.ip}`,
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
  } catch (err) {
    res.send(err);
  }
});

app.post("/createCeramic", (req, res) => {
  // generate random seed
  const seed = Math.floor(Math.random() * 1000000000);
  console.log(req.body);
  try {
    exec(
      `echo ${req.body.ip} > ${
        req.body.ip
      } && ansible-playbook playbooks/createCeramic.yml -u root --extra-vars \"seed=${seed.toString()} IPFS_S3_REGION=${
        req.body.region
      } IPFS_S3_BUCKET_NAME=${req.body.bucket} IPFS_S3_ACCESS_KEY_ID=${
        req.body.accessKeyId
      } IPFS_S3_SECRET_ACCESS_KEY=${req.body.secretAccessKey} PEER_IP=${
        req.body.peerIP
      } IPFS_S3_REGION_ENDPOINT=${req.body.endpoint}\"
       -i ${req.body.ip} && rm ${req.body.ip}`,
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
  } catch (err) {
    res.send(err);
  }
});

app.post("/createCustom", (req, res) => {
  console.log(req.body);
  try {
    exec(
      `ansible-playbook createCustom.yml -u root --extra-vars \"serverId=${req.body.serverId} githubRepo=${req.body.githubRepo}\" `,
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
  } catch (err) {
    res.send(err);
  }
});

app.post("/updateCustom", (req, res) => {
  console.log(req.body);
  try {
    exec(
      `ansible-playbook updateCustom.yml -u root --extra-vars \"serverId=${req.body.serverId}\" `,
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
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
