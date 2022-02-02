const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose")

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/listDB')
const listSchema = {
    item: String
}
const Item = mongoose.model('Item', listSchema);

const customListSchema = {
    listName: String,
    items: [listSchema]
}

const List = mongoose.model("List", customListSchema);


app.get("/", function(req, res){
    Item.find({}, function(err, results){
        if(err) {
            console.log("Retrieving data from db failed")
        } else {

            res.render('changetext', {
                listTitle: "Today",
                newListItem: results,
                postAddress: "/"
            });
        }
    });  
});

app.post("/", function(req, res){
    const item = new Item({
        item: req.body.newItem
    });
    item.save();
    res.redirect('/');
});


app.post("/delete", function(req, res){
    console.log(req.body.checkbox);
    Item.deleteOne({_id: req.body.checkbox}, function(err){
        if(err) {
            console.log("deleting unsuccessful")
        }
    });
    res.redirect("/")
})

app.get("/:customList", function(req, res){


    List.find({listName: req.params.customList}, function(err, results){
        if(err) {
            console.log(err);
        } else if(results.length == 0) {
            const list = new List({
                listName: req.params.customList,
            })
            list.save();
            res.render("changetext", {
                listTitle: req.params.customList,
                newListItem: [],
                postAddress: "/" + req.params.customList
            });
        } else{
            console.log(results);
            res.render("changetext", {
                listTitle: req.params.customList,
                newListItem: results[0].items,
                postAddress: "/" + req.params.customList
            });
        }
    })

    
});
app.post("/:customList", function(req, res){
    let item = req.body.newItem;

    

    workItems.push(item);
    res.redirect("/work");
})

app.post("/reset", function(req, res){

    res.redirect("/");
});

app.get("/about", function(req, res) {
    res.render("about");
})

app.listen(3000, function(){
    console.log("server started");
});

