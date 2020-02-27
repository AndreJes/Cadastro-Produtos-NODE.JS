const {check, validationResult} = require("express-validator");
const fs = require("fs");

const NeDB = require("nedb");

let database = new NeDB({
    filename:"database.db",
    autoload:true
});

module.exports = (app) => {

    let route = app.route("/");

    //Returns a Html File
    route.get((req, res) => {
        res.statusCode = 200;
        sendIndexFile(res);
    });

    route.post([check(["description", "lote", "value"], "Campo inválido!").notEmpty()],
        (req, res) =>{
            let errors = validationResult(req);

            if(!errors.isEmpty()){
                console.log(errors);
                return false;
            }

            database.insert(req.body, (err, product) =>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log(`Produto: ${product} adicionado`);
                    sendIndexFile(res);
                }
            })


    });

    let ApiList = app.route("/api/list");

    //Returns a json[] of products 
    ApiList.get((req, res) =>{

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");

        database.find({}).exec((err, products) =>{

            if(err){
                res.json({
                    err
                });
            } else{
                console.log("Obtendo lista de produtos!");
                res.json(products);
            }

        });

    });

    let ApiDelete = app.route("/api/delete/:id");

    ApiDelete.delete((req, res) =>{
        let id = req.params.id;
        database.remove({_id:req.params.id}, "", (err) =>{
            if(err){
                return false;
            }
            else{
                console.log(`produto de id: ${id} Removido!`)
                sendIndexFile(res);
            }
        });
    });
}

function sendIndexFile(res){
    res.sendFile("index.html", {root: "../views/"});
}