const express = require('express');
const path = require('path');
const redis = require('redis')
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());

const redisClient = redis.createClient({
    port: 20499,
    host: 'ec2-3-214-160-172.compute-1.amazonaws.com',
    password: "p196459389413ebf5fe19cb54dcedac009a3d022cf31a78670d17963cd66ff3bb"
})

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.post("/api/record", (req, res) => {
    redisClient.dbsize((err, data) => {
        if(err){
            res.status(500)
            res.send("Error saving score")
        }else{
            redisClient.set(`${req.body.name}_${data}`, req.body.score, (err, _) => {
                if(err){
                    res.status(500)
                    res.send("Error saving score")
                }else{
                    res.status(200)
                    res.send(`{"status": "saved"}`)
                }
            })
        }
    })
    
})

app.get("/api/ranking/:max", (req, res) => {
    const max = req.params.max

    redisClient.keys("*", (err, keys) => {
        if(err){
            console.log(err)
            res.send([])
        }else{
            Promise.all(keys.map(key => {
                return new Promise(function(resolve, reject){
                    redisClient.get(key, function(err, data){
                        if(err){
                            reject(err)
                        }else{
                            resolve(data)
                        }
                    })

                })
            }))
            .then(values => {
                let result = []
                for(let i = 0; i < keys.length; i++){
                    let obj = {}
                    const name = keys[i].split("_")[0]
                    obj[name] = values[i]
                    result.push(obj)
                }

                result.sort((a, b) => {
                    return b[Object.keys(b)[0]] - a[Object.keys(a)[0]]
                });

                if(max > 0){
                    result = result.slice(0, max)
                }
                res.send(result)
            })
            .catch(err => {
                res.send(err)
                console.log(err)
            })
        }
    })
})

app.get("/api/ranking", (_, res) => {
    redisClient.keys("*", (err, keys) => {
        if(err){
            console.log(err)
            res.send([])
        }else{
            Promise.all(keys.map(key => {
                return new Promise(function(resolve, reject){
                    redisClient.get(key, function(err, data){
                        if(err){
                            reject(err)
                        }else{
                            resolve(data)
                        }
                    })

                })
            }))
            .then(values => {
                let result = []
                for(let i = 0; i < keys.length; i++){
                    let obj = {}
                    const name = keys[i].split("_")[0]
                    obj[name] = values[i]
                    result.push(obj)
                }

                result.sort((a, b) => {
                    return b[Object.keys(b)[0]] - a[Object.keys(a)[0]]
                });

                res.send(result)
            })
            .catch(err => {
                res.send(err)
                console.log(err)
            })
        }
    })
})

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
