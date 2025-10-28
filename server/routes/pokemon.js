import express from 'express';
import { getAboutInfo, setAboutInfo, deleteAboutInfo, } from '../db.js';
const router = express.Router();

// GET /api/pokemon/:id/about
router.get('/:id/about', (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    
    if (!Number.isInteger(pokemonId) || pokemonId <= 0) {
      return res.status(400).json({ 
        error: 'Invalid Pokemon ID. Must be a positive integer.' 
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
    console.error('Error fetching about info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/pokemon/:id/about
router.put('/:id/about', (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    
    if (!Number.isInteger(pokemonId) || pokemonId <= 0) {
      return res.status(400).json({ 
        error: 'Invalid Pokemon ID. Must be a positive integer.' 
      });
    }

    const { height, weight, description } = req.body;
    
    // Validation
    if (height !== undefined && height !== null && typeof height !== 'string') {
      return res.status(400).json({ error: 'Height must be a string or null' });
    }
    if (weight !== undefined && weight !== null && typeof weight !== 'string') {
      return res.status(400).json({ error: 'Weight must be a string or null' });
    }
    if (description !== undefined && description !== null && typeof description !== 'string') {
      return res.status(400).json({ error: 'Description must be a string or null' });
    }

    // Length validation
    if (height && height.length > 20) {
      return res.status(400).json({ error: 'Height must be 20 characters or less' });
    }
    if (weight && weight.length > 20) {
      return res.status(400).json({ error: 'Weight must be 20 characters or less' });
    }
    if (description && description.length > 500) {
      return res.status(400).json({ error: 'Description must be 500 characters or less' });
    }

    // Trim strings
    const aboutData = {
      height: height ? height.trim() : null,
      weight: weight ? weight.trim() : null,
      description: description ? description.trim() : null
    };

    setAboutInfo(pokemonId, aboutData);

    res.json({
      data: {
        pokemonId,
        aboutInfo: aboutData
      }
    });
  } catch (error) {
    console.error('Error setting about info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/pokemon/:id/about
router.delete('/:id/about', (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    
    if (!Number.isInteger(pokemonId) || pokemonId <= 0) {
      return res.status(400).json({ 
        error: 'Invalid Pokemon ID. Must be a positive integer.' 
      });
    }

    deleteAboutInfo(pokemonId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting about info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
