const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

app.use(bodyParser.json());

app.set("port", process.env.PORT || 3000);

app.get("/", (request, response) => {
  response.send("Hello, Publications!");
});

app.get("/api/v1/papers", async (request, response) => {
  try {
    const papers = await database("papers").select(); //return an array of all the papers
    response.status(200).json(papers);
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.get("/api/v1/footnotes", async (request, response) => {
  try {
    const footnotes = await database("footnotes").select(); //return an array of all the footnotes
    response.status(200).json(footnotes);
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.post("/api/v1/papers", async (request, response) => {
  const paper = request.body;

  for (let requiredParameter of ["title", "author"]) {
    if (!paper[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { title: <String>, author: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
  }

  try {
    const id = await database("papers").insert(paper, "id");
    response.status(201).json({ id });
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.post("/api/v1/footnotes", async (request, response) => {
  const footnotes = request.body;

  for (let requiredParameter of ["note", "paper_id"]) {
    if (!footnotes[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { note: <String>, paper_id: <Number> }. You're missing a "${requiredParameter}" property.`,
      });
    }
  }

  try {
    //check if the paper_id exist
    const paper = await database("papers")
      .where("id", request.body.paper_id)
      .select();
    if (paper.length) {
      const id = await database("footnotes").insert(footnotes, "id");
      response.status(201).json({ id });
    } else {
      response.status(500).send({
        error: `Could not find paper with id ${request.body.paper_id}`,
      });
    }
  } catch (error) {
    console.warn(error);
    response.status(500).json({ error });
  }
});

// GET a specific paper
app.get("/api/v1/papers/:id", async (request, response) => {
  try {
    const papers = await database("papers")
      .where("id", request.params.id)
      .select();
    if (papers.length) {
      response.status(200).json(papers);
    }
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.listen(app.get("port"), () => {
  console.log(`App is running on ${app.get("port")}.`);
});

module.exports = app;
