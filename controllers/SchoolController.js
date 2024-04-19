import mongoose from "mongoose";
import School from "../models/SchoolModel.js";

// POST
// Create school
export const createSchool = async (req, res) => {
  const { name, address } = req.body;
  try {
    const newSchool = await School.create({ name, address });

    if (newSchool) {
      res.status(201).json(newSchool);
    } else {
      res.status(400).json({ error: "Error creating school" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Getting all schools
export const getAllSchools = async (req, res) => {
  try {
    const query = await School.find({});

    if (query) {
      return res.status(200).json(query);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get one school
export const getOneSchool = async (req, res) => {
  const { id } = req.params;
  try {
    const query = await School.findById(id);

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

// DELETE
export const deleteSchool = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid id" });
    }

    const query = await School.findOneAndDelete({ _id: id });

    if (query) {
      res.status(201).json(query);
    } else {
      res.status(400).json({ error: "No such school" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// UPDATE
export const updateSchool = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid id" });
    }

    const query = await School.findOneAndUpdate({
      _id: id,
      name: name,
      address: address,
    });

    if (!query) {
      return res.status(404).json({ error: "No such school" });
    }

    res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
