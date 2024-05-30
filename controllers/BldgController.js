import mongoose from "mongoose";
import Bldg from "../models/BldgModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: "dogpte0qt",
  api_key: "317652464244887",
  api_secret: "q7a8tNjQgmJhn-9soyGJyirlHqI",
});
// POST
// Create Bldg
// export const createBldg = async (req, res) => {
//   const {
//     name,
//     school,
//     address,
//     year,
//     location,
//     storey,
//     building_type,
//     structure_type,
//     occupancy,
//     rvs_score,
//     vulnerability,
//     physical_conditions,
//     compliance,
//     remarks,
//     mitigation_actions,
//   } = req.body;

//   try {
//     const existingBldg = await Bldg.findOne({ name });
//     if (existingBldg) {
//       return res.status(400).json({ error: "Building name already exists" });
//     }

//     const newBldg = await Bldg.create({
//       name,
//       school,
//       address,
//       year,
//       location,
//       storey,
//       building_type,
//       structure_type,
//       occupancy,
//       rvs_score,
//       vulnerability,
//       physical_conditions,
//       compliance,
//       remarks,
//       mitigation_actions,
//     });

//     if (newBldg) {
//       console.log("newBldg");
//       console.log("newBldgId:", newBldg.id);
//       if (req.file) {
//         console.log("both exists");
//         const image = req.file;
//         console.log(image);
//         const imagePath = image.path;
//         const uploadImg = await cloudinary.uploader.upload(imagePath, {
//           folder: "trece-building-audits",
//         });
//         const public_id = uploadImg.public_id;
//         console.log("yes may image");
//         console.log("public id:", public_id);

//         // Insert image to db
//         const insertImagetoDB = await Bldg.findOneAndUpdate(
//           { _id: newBldg.id }, // Filter by the building's _id
//           { $set: { image: public_id } }, // Update the image field with the public_id
//           { new: true } // Return the updated document
//         );
//         if (uploadImg && insertImagetoDB) {
//           fs.unlink(imagePath, (err) => {
//             if (err) {
//               console.error("Error deleting file:", err);
//             } else {
//               console.log("File deleted successfully");
//             }
//           });
//           return res
//             .status(200)
//             .json(
//               "Successfully uploaded img to cloudinary, and inserted id to DB"
//             );
//         }
//       }
//       return res.status(201).json(newBldg);
//     } else {
//       return res.status(400).json({ error: "Error creating building" });
//     }
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

export const createBldg = async (req, res) => {
  const {
    name,
    school,
    address,
    year,
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
      year,
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

          streamifier.createReadStream(image.buffer).pipe(uploadStream);
        });

        const public_id = uploadResult.public_id;
        console.log("yes may image");
        console.log("public id:", public_id);

        // Insert image to db
        const insertImagetoDB = await Bldg.findOneAndUpdate(
          { _id: newBldg.id }, // Filter by the building's _id
          { $set: { image: public_id } }, // Update the image field with the public_id
          { new: true } // Return the updated document
        );
        if (uploadResult && insertImagetoDB) {
          return res
            .status(200)
            .json(
              "Successfully uploaded img to Cloudinary, and inserted id to DB"
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
// export const uploadBldgImage = async (req, res) => {
//   const file = req.file.path;
//   try {
//     const uploadImg = await cloudinary.uploader.upload(file);

//     if (uploadImg) {
//       return res.status(200).send({ message: "Successfully uploaded image" });
//     }

//   } catch (error) {
//     return res.status(400).json({ error: error.message, file: file });
//   }
// };

export const uploadBldgImage = async (req, res) => {
  const file = req.file;

  try {
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

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    if (uploadResult) {
      return res.status(200).send({ message: "Successfully uploaded image" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// export const editBldgImage = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const building = await Bldg.findById(id);

//     if (req.file) {
//       const image = req.file;
//       const imagePath = image.path;

//       // delete image in cloudinary
//       if (building.image) {
//         try {
//           const deleteImage = await cloudinary.uploader.destroy(building.image);
//           if (deleteImage.result !== "ok") {
//             throw new Error("Error deleting image in Cloudinary");
//           }
//         } catch (error) {
//           console.error("Error deleting image:", error);
//           // Handle error deleting image
//           return res
//             .status(400)
//             .json({ error: "Error deleting image in Cloudinary" });
//         }
//       }

//       const uploadImg = await cloudinary.uploader.upload(imagePath, {
//         folder: "trece-building-audits",
//       });
//       // get the public id from cloudinary
//       const public_id = uploadImg.public_id;
//       console.log("public id: ", public_id);
//       // Update image to db
//       const updateImagetoDB = await Bldg.findOneAndUpdate(
//         { _id: building.id }, // Filter by the building's _id
//         { $set: { image: public_id } }, // Update the image field with the public_id
//         { new: true } // Return the updated document
//       );

//       if (updateImagetoDB) {
//         fs.unlink(imagePath, (err) => {
//           if (err) {
//             console.error("Error deleting file:", err);
//           } else {
//             console.log("File deleted successfully");
//           }
//         });
//         return res.status(200).json("Successfully updated image");
//       }
//     }
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

export const editBldgImage = async (req, res) => {
  const { id } = req.params;

  try {
    const building = await Bldg.findById(id);

    if (req.file) {
      const image = req.file;
      console.log(req.file);

      // delete image in cloudinary
      if (building.image) {
        console.log(building.image);
        try {
          const deleteImage = await cloudinary.uploader.destroy(building.image);
          console.log("Cloudinary delete response:", deleteImage);
          if (
            deleteImage.result !== "ok" &&
            deleteImage.result !== "not found"
          ) {
            throw new Error("Error deleting image in Cloudinary 1");
          }
        } catch (error) {
          console.error("Error deleting image:", error);
          return res
            .status(400)
            .json({ error: "Error deleting image in Cloudinary 2" });
        }
      }

      // Upload new image to Cloudinary from buffer
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

        streamifier.createReadStream(image.buffer).pipe(uploadStream);
      });

      // get the public id from cloudinary
      const public_id = uploadResult.public_id;
      console.log("public id: ", public_id);

      // Update image to db
      const updateImagetoDB = await Bldg.findOneAndUpdate(
        { _id: building.id }, // Filter by the building's _id
        { $set: { image: public_id } }, // Update the image field with the public_id
        { new: true } // Return the updated document
      );

      if (updateImagetoDB) {
        return res.status(200).json("Successfully updated image");
      }
    } else {
      return res.status(400).json({ error: "No image file provided" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Edit Bldg
export const editBldg = async (req, res) => {
  const {
    name,
    school,
    address,
    year,
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
  const { id } = req.params;

  try {
    // const existingBldg = await Bldg.findOne({ name });
    // if (existingBldg) {
    //   return res.status(400).json({ error: "Building name already exists" });
    // }

    const updatedBldg = await Bldg.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name: name,
          school: school,
          address: address,
          year: year,
          location: location,
          storey: storey,
          building_type: building_type,
          structure_type: structure_type,
          occupancy: occupancy,
          rvs_score: rvs_score,
          vulnerability: vulnerability,
          physical_conditions: physical_conditions,
          compliance: compliance,
          remarks: remarks,
          mitigation_actions: mitigation_actions,
        },
      },
      { new: true }
    );

    if (updatedBldg) {
      return res.status(201).json(updatedBldg);
    } else {
      return res.status(400).json({ error: "Error editing building" });
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

// Get buildings by school
export const getBldgsBySchool = async (req, res) => {
  const { school } = req.query;
  try {
    const existingBldg = await Bldg.findOne({ school });
    if (!existingBldg) {
      return res
        .status(400)
        .json({ error: "No buildings found for the provided school" });
    }

    const query = await Bldg.find({ school });

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

// Get building count for school
export const getBldgCount = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$school", // Group by the name field
          count: { $sum: 1 }, // Count the occurrences of each name
        },
      },
    ];

    const result = await Bldg.aggregate(pipeline);

    res.status(200).json(result);
  } catch (error) {
    // res.status(500).json({ error: error.message });
  }
};

// Delete building
// DELETE
export const deleteBldg = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid id" });
    }

    const query = await Bldg.findOneAndDelete({ _id: id });

    if (query) {
      res.status(201).json(query);
    } else {
      res.status(400).json({ error: "No such building" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
