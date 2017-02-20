var express = require('express');// 引入express的模块
var app = express.createServer();// 获得express创建的服务器
var path = require('path');

app.listen(3000);// 使服务器监听在3000端口

// 静态网页请求
app.use(express.static(path.join(__dirname, 'public')));

// 设置渲染器
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var tweets = [];

// 查看是否接受html文件
function acceptsHtml(header) {
	if (!header) { // 如果没有头信息 返回 false
		return false;
	}
	var accepts = header.split(',');
	for (var i = 0; i < accepts.length; i++) {
		if(accepts[i] === 'text/html'){
			return true;
		}
	}
	return false;
}

app.get('/', function (req, res) {// 响应 / 请求

	var title = '推特-风筝';
	var header = '欢迎 风筝';

	res.render('index',{
		locals: {
			'title': title,
			'header': header,
			'tweets': tweets,
			'stylesheets': ['/stylesheets/style.css']
		}
	});

});

app.get('/info', function (req, res) {
	res.render('info', {
		locals: {
			'title': '推特-风筝',
			'header': '输出文本信息',
			'stylesheets':['/stylesheets/style.css']
		}
	});
});

app.post('/send', express.bodyParser(), function (req, res) {
	// 测试
	console.log(req.body);

	if(req.body && req.body.tweet) {
		// tweets.push(req.body.tweet); // 添加一个元素
		tweets.unshift(req.body.tweet);	// 将元素添加到头部
		if (acceptsHtml(req.headers['accept'])) {
			res.redirect('/', 302);
		} else {
			res.send({status:"ok", message:"Tweet received"});
		}

	} else {
		// 没有 tweet ?
		res.send({status:"nok", message:"No tweet reveived"});
	}
});

app.get("/tweets", function (req, res) {
	res.send(tweets);
});


