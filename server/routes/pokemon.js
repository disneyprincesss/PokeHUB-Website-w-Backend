import express from "express";
import { getAboutInfo, setAboutInfo, deleteAboutInfo, } from "../db.js";
const router = express.Router();

// GET /api/pokemon/:id/about
router.get("/:id/about", (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    
    if (!Number.isInteger(pokemonId) || pokemonId <= 0) {
      return res.status(400).json({ 
        error: "Invalid Pokemon ID. Must be a positive integer." 
      });
    }

    const aboutInfo = getAboutInfo(pokemonId);
    
    res.json({
      data: {
        pokemonId,
        aboutInfo: aboutInfo || {
          height: null,
          weight: null,
          description: null
        }
      }
    });
  } catch (error) {
    console.error("Error fetching about info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/pokemon/:id/about
router.put("/:id/about", (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);

    if (!Number.isInteger(pokemonId) || pokemonId <= 0) {
      return res.status(400).json({
        error: "Invalid Pokemon ID. Must be a positive integer.",
      });
    }

    const { height, weight, description } = req.body;

    // Validation for numbers
    if (height !== undefined && height !== null) {
      if (typeof height !== "number" || isNaN(height) || height < 0) {
        return res
          .status(400)
          .json({ error: "Height must be a positive number or null" });
      }
      if (height > 1000) {
        return res.status(400).json({ error: "Height must be less than 1000" });
      }
    }

    if (weight !== undefined && weight !== null) {
      if (typeof weight !== "number" || isNaN(weight) || weight < 0) {
        return res
          .status(400)
          .json({ error: "Weight must be a positive number or null" });
      }
      if (weight > 10000) {
        return res
          .status(400)
          .json({ error: "Weight must be less than 10000" });
      }
    }

    // DON"T call .trim() on numbers!
    const aboutData = {
      height: height || null,
      weight: weight || null,
      description: description ? description.trim() : null,
    };

    setAboutInfo(pokemonId, aboutData);

    res.json({
      data: {
        pokemonId,
        aboutInfo: aboutData,
      },
    });
  } catch (error) {
    console.error("Error setting about info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/pokemon/:id/about
router.delete("/:id/about", (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    
    if (!Number.isInteger(pokemonId) || pokemonId <= 0) {
      return res.status(400).json({ 
        error: "Invalid Pokemon ID. Must be a positive integer." 
      });
    }

    deleteAboutInfo(pokemonId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting about info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
