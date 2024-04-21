import mongoose from "mongoose";
import Bldg from "../models/BldgModel.js";

// POST
// Create Bldg
export const createBldg = async (req, res) => {
  const {
    name,
    school,
    address,
    location,
    storey,
    building_type,
    structure_type,
    occupancy,
    rvs_score,
    vulnerability,
    physical_conditions,
    compliance,
    remarks,
    hazard,
  } = req.body;
  try {
    const existingBldg = await Bldg.findOne({ name });
    if (existingBldg) {
      return res.status(400).json({ error: "Building name already exists" });
    }

    const newBldg = await Bldg.create({
      name,
      school,
      address,
      location,
      storey,
      building_type,
      structure_type,
      occupancy,
      rvs_score,
      vulnerability,
      physical_conditions,
      compliance,
      remarks,
      hazard,
    });

    if (newBldg) {
      return res.status(201).json(newBldg);
    } else {
      return res.status(400).json({ error: "Error creating building" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// GET
// GEt all bldgs
export const getAllBldgs = async (req, res) => {
  try {
    const query = await Bldg.find({});

    if (query) {
      return res.status(200).json(query);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get one building
export const getOneBldg = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid id" });
    }
    const query = await Bldg.findById(id);

    if (query) {
      res.status(200).json(query);
    } else {
      res.status(400).json({
        error: "No records existed.",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
