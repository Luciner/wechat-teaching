"use strict";

const wechat = require('wechat-enterprise');
const express = require('express');
const request = require('request');
const app = express();
const http = require('http').Server(app);
const io  = require('socket.io')(http);
const path = require('path');
const fs = require('fs');
const https = require('https');
const qs = require('querystring');
const config = require('./config.json');
const wechatUrl = require('./wechatUrl.json');

app.use(express.query());
app.use(express.static(path.join(__dirname, 'public/')));

let access_token = fs.readFileSync('./access_token.txt').toString();

const saveToken = function(){
	 let params = {
		 corpid: config.corpId,
		 corpsecret: config.corpSecret
	};
	let options = {
		url: wechatUrl.gettoken + qs.stringify(params),
		method: 'GET',
		json: true
	};
	request(options, function (err, res, body) {
		access_token = body.access_token;
		fs.writeFile('access_token.txt', access_token, function (err) {
			if(err) throw err;
		});
	});
};

const refreshToken = function () {
	saveToken();
	setInterval(function () {
		saveToken();
    }, 7000*1000);
};
refreshToken();

app.use('/corp', wechat(config, function (req, res, next) {
	switch(req.weixin.Content){
		case '1': res.reply([{
			title : "options",
			description : "请选择你的选项",
			picUrl : "http://128.199.176.191:8080/yuant/img/options.jpg",
			url : wechatUrl.options
		}]);break;
		default: res.reply('hello');
	}
}));

let statisticsNsp = io.of('/statistics');

statisticsNsp.on('connection', function(socket){
	console.log('a client connected /statistics');
	socket.emit('init-data',historicalBarChart);
	socket.on('make-option',function(data){
		console.log(data.option);
		statisticsNsp.emit('redraw',data);
		switch(data.option){
    		case 'A': historicalBarChart[0].values[0].value++; break;
    		case 'B': historicalBarChart[0].values[1].value++; break;
    		case 'C': historicalBarChart[0].values[2].value++; break;
    		case 'D': historicalBarChart[0].values[3].value++; break;
    	}
	});	
	socket.on('clear-data', function(){
		for (let i = 0; i < 4; i++) {
			historicalBarChart[0].values[i].value = 0;
		}
		statisticsNsp.emit('clear-data');
		console.log('clear-data');
	});
	socket.on('new-question', function(){
		for (let i = 0; i < 4; i++) {
			historicalBarChart[0].values[i].value = 0;
		}
		statisticsNsp.emit('clear-data');
		sendOptions();
	});
});

let overviewNsp = io.of('/overview');

overviewNsp.on('connection', function(socket){
	console.log('a client connected /overview');
  	getCorpApp().then(function(data){
  		overviewNsp.emit('get-overview', data);
  	});
});

app.get('/',function (req,res) {
	res.sendFile(path.join(__dirname, 'views/signin.html'));
});
app.get('/overview', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/overview.html'));
});
app.get('/statistics', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/statistics.html'));
});
app.get('/options', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/options.html'));
});
app.get('/chart', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/chart.html'));
});
/*
app.get('/test', function(req, res) {
  res.send('hello');
  sendText('hello123');
  sendOptions();
});
*/

let historicalBarChart = [
{
	key: "Cumulative Return",
	values: [{
		"label" : "A" , "value" : 0
	}, {
		"label" : "B" , "value" : 0
	}, {
		"label" : "C" , "value" : 0
	}, {
		"label" : "D" , "value" : 0
	}]
}];

const getCorpApp = function(){
	access_token = fs.readFileSync('./access_token.txt').toString();
	let params = {
		access_token: access_token,
		agentid: config.agentid
	};
	let options = {
		method: 'GET',
		url: wechatUrl.agent_get + qs.stringify(params),
		json: true
	};
	return new Promise(function(resolve, reject) {
	    request(options, function (err, res, body) {
	      if (res) {
	        resolve(body);
	      } else {
	        reject(err);
	      }
	    });
  	});
};

const sendText = function(text){
	access_token = fs.readFileSync('./access_token.txt').toString();
	let params = {
		access_token: access_token
	};
	let postData = {
		   "touser": "@all",
		   "msgtype": "text",
		   "agentid": 6,
		   "text": {
			   "content": text
		   },
		   "safe":0
	};
	let options = {
		method: "POST",
		url: wechatUrl.message_send + qs.stringify(params),
		json: postData
	};
	request(options, function (err, res, body) {
	      console.log(body);
	});
};

const sendOptions = function(){
	access_token = fs.readFileSync('./access_token.txt').toString();
	let params = {
		access_token: access_token
	};
	let postData = {
	"touser": "@all",
	"msgtype": "news",
	"agentid": 6,
	"news": {
       "articles":[
           {
            "title": "options",
			"description": "请选择你的选项",
			"url": wechatUrl.options,
			"picurl" : "http://128.199.176.191:8080/yuant/img/options.jpg"
           }
		]
	}
	};
	let options = {
		method: "POST",
		url: wechatUrl.message_send + qs.stringify(params),
		json: postData
	};
	request(options, function (err, res, body) {
	      console.log(body);
	});
};

http.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});