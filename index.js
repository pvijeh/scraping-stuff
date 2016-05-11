var Xray = require('x-ray'); 
var fs = require('fs');

// to do 
//  need to add site listing to json object
// need to create way to loop through site listing urls
// need to get list of all site listing urls 

var xray = new Xray();  

var createMonetizationMethodsArray = function (obj) {
    var MonetizationMethods = []; 
    var tempEarningsObj = {}; 
    var tempEarningsArray = []; 
    var formattedObject = {
        MonetizationMethods: [],
        monthlyAverages: {
            pageViews: null,
            users: null, 
            profit: null,
            profitPerPageView: null,
            profitPerUser: null
        },
        trafficEarningsData: {}
    };
    var monPageViews = 0; 
    var monUsers = 0; 
    var monProfit = 0;  

    // loop through the monthly earnings data and make a useable object
    obj.siteStats.forEach(function(siteStat){
        var i = 0; 
        siteStat.siteStats.forEach(function(stat){
            ++i; 
           stat.stat.forEach(function(thingy){ 
                var date = thingy.split(':')[0]; 
                var itemData = thingy.split(':')[1].trim();
                var tempObj = {}; 
                if(i === 1){
                    tempEarningsObj[date] = {};
                    tempEarningsObj[date].date = date;
                    tempEarningsObj[date].pageViews = parseInt(itemData.replace(/\$|,/g,''), 10); 
                } else if (i === 2 ){
                    tempEarningsObj[date].users = parseInt(itemData.replace(/\$|,/g,''), 10);
                } else if (i === 3 ){
                    tempEarningsObj[date].netProfit = parseInt(itemData.replace(/\$|,/g,''), 10);
                }
            }); 
        });
    });

    // convert the object into an array 
    for (var prop in tempEarningsObj ){
        tempEarningsArray.push(tempEarningsObj[prop]); 
    }

    tempEarningsArray.forEach(function(item){
        monPageViews = monPageViews + item.pageViews; 
        monUsers = monUsers+ item.users; 
        monProfit = monProfit + item.netProfit; 
    });

    monPageViews = Math.round(monPageViews/tempEarningsArray.length);
    monUsers = Math.round(monUsers/tempEarningsArray.length);
    monProfit = Math.round(monProfit/tempEarningsArray.length);

    formattedObject.monthlyAverages = {
        pageViews : monPageViews,
        users : monUsers,
        profit : monProfit,
        profitPerPageView : parseFloat((monProfit/monPageViews).toFixed(3)),
        profitPerUser : parseFloat((monProfit/monUsers).toFixed(3))
    }

    formattedObject.trafficEarningsData = tempEarningsArray; 

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
    };

    obj.monetization = uniqueMonMethod(MonetizationMethods);
    formattedObject.MonetizationMethods = uniqueMonMethod(MonetizationMethods);

    fs.writeFile("test.json", JSON.stringify(formattedObject, null, 2), function(err) {  
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

