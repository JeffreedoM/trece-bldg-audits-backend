import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    year_established: {
      type: Number,
    },
    location: {
      type: String,
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
    physical_condition: {
      type: String,
    },
    compliance: {
      type: String,
    },
    mitigation_actions: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("buildings", buildingSchema);
