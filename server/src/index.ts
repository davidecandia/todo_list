import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Notes from "./models/Notes.js";
//for deploy
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5000;

const basePath = path.resolve();

const app = express();

app.use(cors());

app.use(express.json());

//metodi crud
// invia nota al database
app.post("/notes", async (req: express.Request, res: express.Response) => {
  const newNotes = new Notes({
    title: req.body.title,
    description: req.body.description || "Nessuna descrizione",
  });
  if (req.body.title === "") return;
  const createNotes = await newNotes.save();
  res.json(createNotes);
});
//prendi tutte le notes
app.get("/notes", async (req: express.Request, res: express.Response) => {
  const notes = await Notes.find();
  res.json(notes);
});
// Modifica una nota esistente
app.put("/notes/:ID", async (req: express.Request, res: express.Response) => {
  const ID = req.params.ID;
  const { title, description } = req.body;

  try {
    const updatedNote = await Notes.findByIdAndUpdate(
      ID,
      {
        title,
        description: description || "Nessuna descrizione",
      },
      { new: true }
    );

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: "Errore durante la modifica della nota" });
  }
});

//delete
app.delete(
  "/notes/:ID",
  async (req: express.Request, res: express.Response) => {
    //prendi id
    const ID = req.params.ID;
    const note = await Notes.findByIdAndDelete(ID);
    res.json(note);
  }
);

app.use(express.static(path.join(basePath, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(basePath, "client", "dist", "index.html"));
});

//connessione al db
mongoose.connect(process.env.MONGO_URL!).then(() => {
  console.log(`Connected to MongoDB at port ${PORT}`);
  app.listen(PORT);
});
