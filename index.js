var Xray = require('x-ray'); 
var fs = require('fs');

var xray = new Xray();  

var createMonetizationMethodsArray = function (obj) {
    var MonetizationMethods = []; 

    obj.monetization.forEach( function (string ){
        if (string.indexOf('Monetization Methods:') > -1 ){
        var blah =  string.replace('Monetization Methods:','').trim().replace(' ', '').split(','); 
            blah.forEach(function(item){
                MonetizationMethods.push(item);
            });     
        }
    });

    var uniqueMonMethod  = function (a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        })
    }

    obj.monetization = uniqueMonMethod(MonetizationMethods);

fs.writeFile("test.json", JSON.stringify(obj), function(err) {  
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 
}

xray('https://empireflippers.com/listing/40396/', {
    siteStats: xray('.listing--traffic', 
        [{
            siteStats : xray('ul', [{
            stat : xray('li', ['li']) 
        }])
    }]), 
    monetization: xray('.site ', ['p'])
})(function(err, obj){
    createMonetizationMethodsArray(obj);
}); 

