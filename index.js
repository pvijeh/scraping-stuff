var Xray = require('x-ray'); 
var fs = require('fs');

var xray = new Xray();  

var createMonetizationMethodsArray = function (obj) {
    // console.log(obj);
    var MonetizationMethods = []; 
    var formattedObject = {
        MonetizationMethods: [],
        trafficEarningsData: {
         date : {  
            pageViews: null,
            users: null, 
            netProfit: null
            }
        }
    }; 

    obj.siteStats.forEach(function(siteStat){
        var i = 0; 
        var i2 = 0; 

        siteStat.siteStats.forEach(function(stat){
            ++i; 
           stat.stat.forEach(function(thingy){
                var date = thingy.split(':')[0]; 
                var itemData = thingy.split(':')[1].trim();
                // console.log('three');
                var tempObj = {}; 

                if(i === 1){
                    formattedObject.trafficEarningsData[date] = {};
                    formattedObject.trafficEarningsData[date].pageViews = itemData; 
                } else if (i === 2 ){
                    formattedObject.trafficEarningsData[date].users = itemData; 
                } else if (i === 3 ){
                    formattedObject.trafficEarningsData[date].netProfit = itemData; 
                }

            }); 
        });
    });

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
    formattedObject.MonetizationMethods = uniqueMonMethod(MonetizationMethods);

    console.log(formattedObject);

fs.writeFile("test.json", JSON.stringify(obj, null, 2), function(err) {  
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

