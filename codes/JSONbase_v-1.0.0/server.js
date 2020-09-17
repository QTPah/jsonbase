const path = require("path");
const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const fetch = require("node-fetch");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

app.get('/data/base', function(req, res) {

    if(Object.keys(req.query).length===0){
        res.send('Error: Request needs 1 Query Param: {\n   access:[int]\n}');
        return;
    }

    fs.readdir('./data', (err,files)=>{
        if(err) return console.log(err);
        if(files.length<req.query.access){
            res.send('Error: No base found with the index of '+req.query.access);
            return;
        }

        fs.readFile('./data/base'+req.query.access+'.json', 'utf8', (err, rawdata)=>{
            if(err) return console.log(err);    
            let base = JSON.parse(rawdata);
            
            res.send(base);
        });

    });

    
});

app.post('/addData', (req,res)=>{
    if(Object.keys(req.query).length===0){
        res.send('Error: Request needs 1 Query Param: {\n   access:[int]\n}');
        return;
    }

    fs.readdir('./data', (err,files)=>{
        if(err) return console.log(err);
        if(files.length<req.query.access){
            res.send('Error: No base found with the index of '+req.query.access);
            return;
        }

        fs.readFile('./data/base'+req.query.access+'.json', 'utf8', (err, rawdata)=>{
            if(err) return console.log(err);    
            let base = JSON.parse(rawdata);
            

            base.package1.push(JSON.parse(req.query.data));
            json = JSON.stringify(base, null, 2);
            try{
                fs.writeFileSync('./data/base'+req.query.access+'.json', json);
            } catch (error){
                console.log(error);
            }
            res.send("Success");
        });

    });
});

app.get('/create/base', function(req, res){
    fs.readFile('./data.json', 'utf8', (err, rawdata)=>{
        if(err) return console.log(err);    
        let data = JSON.parse(rawdata);

        let newBase = parseInt(data.data[data.data.length-1].split("").slice(4).join(""), 10)+1;

        data.data.push(`base${newBase}`);

        json=JSON.stringify({package1: []}, null, 2);
        let json2 = JSON.stringify(data, null, 2);
        try{
            fs.writeFileSync(`./data/base${newBase}.json`, json);
            fs.writeFileSync('./data.json', json2);
        }catch(error){
            console.error(error);
        }
        res.send("Success");
    });
});

app.get('/bases', function(req, res){
    fs.readFile('./data.json', 'utf8', (err, rawdata)=>{
        if(err) return console.log(err);    
        let data = JSON.parse(rawdata);
        res.send(data);
    });
});

server.listen(14736, function(){
    console.log('listening on :14736');
});


