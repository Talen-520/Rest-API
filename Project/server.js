var http = require('http');
var url = require( 'url');//import url module
const ItemsJson = require("./items.json");

http.createServer(function(req,res){
    //CROS error handled by follwoing code
    res.setHeader('Access-Control-Allow-Origin','*');//any domain allow to access server
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
    console.log("req.method = " + req.method);
    var parsed = url.parse(req.url,true);
    console.log(parsed);

    if(req.method === "GET"){
        res.setHeader('Content-Type','application/json');
        res.statusCode = 200;
        res.write(JSON.stringify(ItemsJson))//convert to string
        res.end();
        console.log("GET:returned: ")
        console.log(ItemsJson)
    }
    if (req.method === "PUT"){
        //these two are path, make sure you check it
        var newItemName = parsed.query.newItemName;
        var newItemPrice = parsed.query.newItemPrice;
        if(!newItemName){
            console.log("PUT: newItemName is invaild")
            console.statusCode = 404;
            res.end();
            return;
        }
        if(!newItemPrice){
            console.log("PUT: newItemName is invaild")
            console.statusCode = 404;
            res.end();
            return;
        }

        var newId = (new Date(Date.now())).toISOString();

        ItemsJson.push({"id": newId,"name":newItemName,"price":newItemPrice});
        res.statusCode = 200;
        res.end();
    }
    if(req.method ==='POST'){
        var itemId = parsed.query.id;
        switch(parsed.pathname){
            case "/updateName" :
                var newItemName = parsed.query.newItemName;
                if(!newItemName){
                    console.log("POST: NewItemName is invaild");
                    res.statusCode = 404;
                    res.end();
                    return;
                }

                var jsonIndex = ItemsJson.findIndex(item=>item.id===itemId);
                if(jsonIndex >=0){
                    ItemsJson[jsonIndex].name = newItemName;
                    res.statusCode = 200;
                }
                else{
                    res.statusCode = 404;
                }
                res.end();
                break;
            case "/updatePrice":
                var newPrice = parsed.query.newPrice;
                if(!newPrice){
                    console.log("POST: NewItemName is invaild");
                    res.statusCode = 404;
                    res.end();
                    return;
                }

                var jsonIndex = ItemsJson.findIndex(item=>item.id===itemId);
                if(jsonIndex >=0){
                    ItemsJson[jsonIndex].price = newPrice;
                    res.statusCode = 200;
                }
                else{
                    res.statusCode = 404;
                }
                res.end();
                break;
            default:
                res.statusCode = 404;
                res.end();
        }        
    }
    if(req.method ==='DELETE'){
        var itemId = parsed.query.id;
        var jsonIndex = ItemsJson.findIndex(item=>item.id===itemId);
        if(jsonIndex >= 0){
            ItemsJson.splice(jsonIndex,1);
            res.statusCode =200;
        }
        else {
            res.statusCode = 404;
        }
    }
    if(req.method === 'OPTIONS'){
        res.statusCode = 200;
        res.end();
    }
}).listen(3000,function(){
    console.log("server started at port 3000...")
})
//control C quit process