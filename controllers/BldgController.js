import mongoose from "mongoose";
import Bldg from "../models/BldgModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dogpte0qt",
  api_key: "317652464244887",
  api_secret: "q7a8tNjQgmJhn-9soyGJyirlHqI",
});
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
    mitigation_actions,
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
      mitigation_actions,
    });

    if (newBldg) {
      console.log("newBldg");
      console.log("newBldgId:", newBldg.id);
      if (req.file) {
        console.log("both exists");
        const image = req.file;
        console.log(image);
        const imagePath = image.path;
        const uploadImg = await cloudinary.uploader.upload(imagePath, {
          folder: "trece-building-audits",
        });
        const public_id = uploadImg.public_id;
        console.log("yes may image");
        console.log("public id:", public_id);

        // Insert image to db
        const insertImagetoDB = await Bldg.findOneAndUpdate(
          { _id: newBldg.id }, // Filter by the building's _id
          { $set: { image: public_id } }, // Update the image field with the public_id
          { new: true } // Return the updated document
        );
        if (uploadImg && insertImagetoDB) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("File deleted successfully");
            }
          });
          return res
            .status(201)
            .json(
              "Successfully uploaded img to cloudinary, and inserted id to DB"
            );
        }
      }
      return res.status(201).json(newBldg);
    } else {
      return res.status(400).json({ error: "Error creating building" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Upload Building Image
export const uploadBldgImage = async (req, res) => {
  const file = req.file.path;
  try {
    const uploadImg = await cloudinary.uploader.upload(file);

    if (uploadImg) {
      return res.status(200).send({ message: "Successfully uploaded image" });
    }

    // const { file } = req.body;
    // const uploadedImg = req.file;
    // return res
    //   .status(200)
    //   .send({ message: "Successfully uploaded image", uploadedImg });
  } catch (error) {
    return res.status(400).json({ error: error.message, file: file });
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
