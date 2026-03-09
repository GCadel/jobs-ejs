const Job = require("../models/Job");
const parseValidationErr = require("../utils/parseValidationErr");

const getJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort("createdAt");
  return res.render("jobs", { jobs });
};

const addJob = async (req, res) => {
  req.body.createdBy = req.user._id;
  try {
    const result = await Job.create({ ...req.body });
    return res.render(`job`, { job: result });
  } catch (error) {
    parseValidationErr({ errors: error }, req);
    return res.render(`job`, { job: null });
  }
};

const getJob = async (req, res) => {
  const job = await Job.findOne({
    createdBy: req.user._id,
    _id: req.params.id,
  });
  if (job) {
    return res.render("job", { job });
  }
  return res.render("job", { job: null });
};

const deleteJob = async (req, res) => {
  try {
    await Job.findOneAndDelete({
      createdBy: req.user._id,
      _id: req.params.id,
    });
    const jobs = await Job.find({ createdBy: req.user._id }).sort("createdAt");
    res.render("jobs", { jobs });
  } catch (error) {
    parseValidationErr({ errors: error }, req);
    const jobs = await Job.find({ createdBy: req.user._id }).sort("createdAt");
    res.render("jobs", { jobs });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { createdBy: req.user._id, _id: req.params.id },
      req.body,
      { returnDocument: "after" },
    );

    if (job) {
      return res.render("job", { job });
    }
    return res.render("job", { job: null });
  } catch (error) {
    parseValidationErr({ errors: error }, req);
    const job = await Job.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    }).sort("createdAt");
    res.render("job", { job });
  }
};
module.exports = { getJobs, addJob, getJob, deleteJob, updateJob };
