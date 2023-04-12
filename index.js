const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//////////////////////////MongoDB//////////////////////////
mongoose.connect(process.env.DATABASE_CONNECTION);

//Schema
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

//Model
const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//// All articles request route
app
  .route("/articles")

  //To get all the articles
  .get((req, res) => {
    //Find function
    find();
    async function find() {
      await Article.find({})
        .then((foundArticles) => {
          res.send(foundArticles);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  })

  //To creat an article
  .post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    const article = new Article({
      title: title,
      content: content,
    });

    article
      .save()
      .then(() => {
        res.send("A new article has been added successfully.");
      })
      .catch((err) => {
        res.send(err);
      });
  })

  //To delete all the articles
  .delete((req, res) => {
    //Delete function
    deleteArticles();
    async function deleteArticles() {
      await Article.deleteMany({}).then(() => {
        res.send("All articles has been deleted successfully.");
      });
    }
  });

////A specific article request route
app
  .route("/articles/:articleTitle")

  //To get a specific article
  .get((req, res) => {
    //The title in the route link
    const articleTitle = req.params.articleTitle;
    Article.findOne({ title: articleTitle })
      .then((foundArticle) => {
        res.send(foundArticle);
      })
      .catch(() => {
        res.send("No articles were found with that title.");
      });
  })

  //To update a specific article
  .put((req, res) => {
    //The title in the route link
    const articleTitle = req.params.articleTitle;
    //Values to be edited
    const title = req.body.title;
    const content = req.body.content;
    Article.findOneAndUpdate(
      { title: articleTitle },
      { title: title, content: content }
    )
      .then(() => {
        res.send("The article has been updated successfully.");
      })
      .catch((err) => {
        res.send(err);
      });
  })

  //To update a part from an article
  .patch((req, res) => {
    //The title in the route link
    const articleTitle = req.params.articleTitle;
    const updates = req.body;
    Article.updateOne({ title: articleTitle }, { $set: updates })
      .then(() => {
        res.send("Successfully updated.");
      })
      .catch((err) => {
        res.send(console.log(err));
      });
  })

  //To delete an article
  .delete((req, res) => {
    //The title in the route link
    const articleTitle = req.params.articleTitle;

    Article.findOneAndRemove({ title: articleTitle })
      .then(() => {
        res.send("The article has been deleted successfully");
      })
      .catch((err) => {
        res.send(err);
      });
  });

app.listen(port, () => {
  console.log("The server is listening on the port " + port);
});
