const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");

const app=express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articlesSchema={
  title:String,
  content:String
};

const Article=mongoose.model("Article",articlesSchema);

//Requests for all articles
app.get("/articles",function(req,res){

  Article.find({},function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }
    else{
      res.send(err);
    }
  });
});

app.post("/articles",function(req,res){

const newArticle = new Article({
  title:req.body.title,
  content:req.body.content
});

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added");
    }else{
      res.send(err);
    }

  });
});

app.delete("/articles",function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("Successfully deleted all articles");
    }else{
      res.send(err);
    }
  });
});

//Requests targetting specific documents

app.get("/articles/:articleTitle",function(req,res){

Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
  if(foundArticle){
    res.send(foundArticle);
  }else{
    res.send("No such article");
  }
});

});

app.put("/articles/:articleTitle",function(req,res){

  Article.updateOne({title:req.params.articleTitle},{title:req.body.title,content:req.body.content},function(err){
    if(!err){
      res.send("successfully updated article");
    }
  });
});

app.patch("/articles/:articleTitle",function(req,res){
  Article.updateOne({title:req.params.articleTitle},{$set:req.body},function(err){
    if(!err){
      res.send("Successfully patched");
    }else{
      res.send(err);
    }
  });
});

app.delete("/articles/:articleTitle",function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(!err){
      res.send("Successfully deleted");
    }else{
      res.send(err);
    }
  });
});


app.listen(3000,function(){
  console.log("running");
});
