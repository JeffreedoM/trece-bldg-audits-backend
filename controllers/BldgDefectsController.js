import mongoose from "mongoose";
import Bldg from "../models/BldgModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import streamifier from "streamifier";

// export const UploadBldgDefects = async (req, res) => {
//   const { id } = req.params;
//   try {
//     // Check if files exist in the request
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: "No files uploaded" });
//     }

//     // Array to store public IDs of uploaded images
//     const publicIds = [];

//     // Process each uploaded file
//     for (const file of req.files) {
//       const imagePath = file.path;

//       // Upload image to Cloudinary
//       const uploadResult = await cloudinary.uploader.upload(imagePath, {
//         folder: "trece-building-audits",
//       });

//       // Store public ID of uploaded image
//       const publicId = uploadResult.public_id;
//       publicIds.push(publicId);

//       // Delete file from local filesystem
//       fs.unlink(imagePath, (err) => {
//         if (err) {
//           console.error("Error deleting file:", err);
//         } else {
//           console.log("File deleted successfully");
//         }
//       });
//     }

//     // Perform any additional processing or save the public IDs to the database here
//     // For example, you can update the Bldg model with the public IDs
//     const building = await Bldg.findById(id);
//     const updateDefects = await Bldg.findOneAndUpdate(
//       { _id: building.id }, // Filter by the building's _id
//       { $push: { defects: { $each: publicIds } } }, // Push new publicIds to the defects array
//       { new: true } // Return the updated document
//     );
//     if (!updateDefects) {
//       return res.status(400).json({ error: "Error updating defects" });
//     }

//     return res.status(200).json({
//       message:
//         "Images uploaded to Cloudinary and deleted from local filesystem",
//       publicIds: publicIds,
//     });
//   } catch (error) {
//     console.error("Error uploading images:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
export const UploadBldgDefects = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if files exist in the request
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Array to store public IDs of uploaded images
    const publicIds = [];

    // Process each uploaded file
    for (const file of req.files) {
      const buffer = file.buffer;

      // Upload image to Cloudinary from buffer
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "trece-building-audits" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
      });

      // Store public ID of uploaded image
      const publicId = uploadResult.public_id;
      publicIds.push(publicId);
    }

    // Perform any additional processing or save the public IDs to the database here
    // For example, you can update the Bldg model with the public IDs
    const building = await Bldg.findById(id);
    const updateDefects = await Bldg.findOneAndUpdate(
      { _id: building.id }, // Filter by the building's _id
      { $push: { defects: { $each: publicIds } } }, // Push new publicIds to the defects array
      { new: true } // Return the updated document
    );
    if (!updateDefects) {
      return res.status(400).json({ error: "Error updating defects" });
    }

    return res.status(200).json({
      message:
        "Images uploaded to Cloudinary and deleted from local filesystem",
      publicIds: publicIds,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get Building Defects
export const getBldgDefects = async (req, res) => {
  const { id } = req.params;
  try {
    const building = await Bldg.findById(id);

    if (building) {
      res.status(200).json(building);
    } else {
      res.status(400).json({
        error: "No records existed.",
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// DELETE
export const deleteDefect = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the building document by its _id
    const building = await Bldg.findById(id);

    // Check if the building exists
    if (!building) {
      return res.status(404).json({ error: "Building not found" });
    }

    // Find the index of the defect in the defects array
    const defectIndex = building.defects.findIndex(
      (defect) => defect === req.body.defect
    );

    // Check if the defect exists in the defects array
    if (defectIndex === -1) {
      return res.status(404).json({ error: "Defect not found in building" });
    }

    await cloudinary.uploader.destroy(req.body.defect);

    // Remove the defect from the defects array
    building.defects.splice(defectIndex, 1);

    // Save the updated building document
    await building.save();

    // Respond with the updated building document
    res.status(200).json(building);
  } catch (error) {
    // Handle errors
    console.error("Error deleting defect:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
