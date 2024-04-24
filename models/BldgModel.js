import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    year_established: {
      type: Number,
    },
    location: {
      type: String,
      required: true,
    },
    storey: {
      type: Number,
    },
    year_nscp: {
      type: Number,
    },
    building_type: {
      type: String,
    },
    structure_type: {
      type: String,
    },
    design: {
      type: String,
    },
    rvs_score: {
      type: Number,
    },
    vulnerability: {
      type: String,
    },
    physical_conditions: {
      type: String,
    },
    compliance: {
      type: Number,
    },
    remarks: {
      type: String,
    },
    mitigation_actions: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("buildings", buildingSchema);
