var Xray = require('x-ray'); 

var xray = new Xray();  

// xray(
//     'https://empireflippers.com/listing/40396/',
//      '.listing--traffic', 
//     [{
//         ul : xray('li', ['li'])
//     }]
//     )(console.log)


// xray(
//     'https://empireflippers.com/listing/40396/',
//      '.listing--traffic', 
//     [{
//         siteStats : xray('ul', [{
//                 stat : xray('li', ['li']) 
//         }])
//     }]
//     )(console.log).write('results.json'); 



xray('https://empireflippers.com/listing/40396/', {
    siteStats: xray('.listing--traffic', 
        [{
            siteStats : xray('ul', [{
            stat : xray('li', ['li']) 
        }])
    }])
})(console.log).write('results.json'); 

    




    // .write('results.json'); 
    // .write(console.log());
    