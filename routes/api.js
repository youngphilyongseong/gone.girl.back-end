var express = require('express');
var router = express.Router();

var querystring = require('querystring');
var moment = require('moment');
var _ = require('underscore');
var http = require('http');

var API_PATH    = '/openapi/service/rest/abandonmentPublicSrvc/abandonmentPublic?'
var SERVICE_KEY = 'Z3bYXoHuTv1ttp4LF7sHs8H+eoEmVB+bLwO9WCYTD5cenWgZuBCxOiQiTmQIJBb9bvG1Vms1673ukVKMpxB50g==';

var upkindMap = {
  'dog': 417000,
  'cat': 422400,
  'etc': 429900,
  'all': ''
};

var apiParams = {
  ServiceKey: SERVICE_KEY,
  _type:      'json',
  numOfRows:   200
};

var apiOptions = {
  hostname: "openapi.animal.go.kr",
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  }
};

var requestOpenAPI = function(options, callback) {
  var result = '';
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      result += chunk;
    });
    res.on('end', function() {
      callback(JSON.parse(result));
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();
};

var defultParamInfo = {
  numOfRows: 10,
  defaultQueryDay: 10
};

router.get('/abandonment', function(req, res, next) {

  var upkind = req.param('upkind') || "all";
  var pageNo = req.param('pageNo') || 1;
  var bgnde = req.param('bgnde');
  var endde = req.param('endde');
  var numOfRows = req.param('numOfRows') || defultParamInfo.numOfRows;

  if(!bgnde || !endde) {
    endde = moment().format('YYYYMMDD');
    bgnde = moment().subtract(defultParamInfo.defaultQueryDay, 'day').format('YYYYMMDD');
  }

  var params = _.extend(apiParams, {
    bgnde: bgnde,
    endde: endde,
    upkind: upkindMap[upkind],
    pageNo: pageNo,
    numOfRows: numOfRows
  });

  var query = querystring.stringify(params);
  var options = _.extend(apiOptions, {
    path: API_PATH + query
  });

  console.log("query : " + query);

  requestOpenAPI(options, function(data) {
    res.json(data.response.body);
  });

});


module.exports = router;
