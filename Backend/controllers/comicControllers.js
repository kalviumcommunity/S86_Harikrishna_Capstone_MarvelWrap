import Comic from "../models/Comic.js";

export const getComics = async (req, res) => {
  try {
    const query = req.query.search
      ? { title: { $regex: req.query.search, $options: "i" } }
      : {};
    const comics = await Comic.find(query)
      .populate("characters")
      .populate("createdBy", "username email");
    res.json(comics);
  } catch (err) {
    res.status(500).json({ error: "Failed to get comics" });
  }
};

export const getComicById = async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id)
      .populate("characters")
      .populate("createdBy", "username email");
    if (!comic) return res.status(404).json({ error: "Comic not found" });
    res.json(comic);
  } catch (err) {
    res.status(500).json({ error: "Failed to get comic" });
  }
};

export const createComic = async (req, res) => {
  try {
    const newComic = new Comic({ ...req.body, createdBy: req.user._id });
    const saved = await newComic.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create comic" });
  }
};

export const updateComic = async (req, res) => {
  try {
    const updated = await Comic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Comic not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update comic" });
  }
};