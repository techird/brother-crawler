var http = require('http');
var cheerio = require('cheerio');
var url = 'http://cn163.net/archives/23645/';

function datafilter(html){
    // 沿用jquery风格
    var $ = cheerio.load(html);
    var arr = [];
    var as = $('[href^="ed2k://"]');
    var res =[];
    as.each(function(index, el) {
        var item = $(this);
        var element = {
            name:$(this).text(),
            href:$(this).attr('href')
        }
        res.push(element);
    });
    return res;
}
function chooseQuality(arr,quality){
    var newarr = arr.filter(function(index) {
        return (index.name.indexOf(quality) > -1);
    });
    var res = [];
    for(var index in newarr){
        res.push(newarr[index].href);
    }
    return res;
}

http.get(url,function(res){
    var html = '';

    // 如果data事件发生，回调将data片段累加到html上
    res.on('data',function(data){
        html += data;
    })

    res.on('end',function(){
        var res = datafilter(html);
        res = chooseQuality(res,'1024');
        console.log(res);
    })
}).on('error',function(){
    console.log('获取数据出错');
})