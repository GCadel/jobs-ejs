const Job = require("../models/Job");

const getJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort("createdAt");
  return res.render("jobs", { jobs });
};

const addJob = async (req, res) => {
  req.body.createdBy = req.user._id;
  const result = await Job.create({ ...req.body });

  return res.render(`job`, { job: result });
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
  await Job.findOneAndDelete({
    createdBy: req.user._id,
    _id: req.params.id,
  });
  const jobs = await Job.find({ createdBy: req.user._id }).sort("createdAt");
  res.render("jobs", { jobs });
};

const updateJob = async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { createdBy: req.user._id, _id: req.params.id },
    req.body,
    { returnDocument: "after" },
  );

  if (job) {
    return res.render("job", { job });
  }
  return res.render("job", { job: null });
};
module.exports = { getJobs, addJob, getJob, deleteJob, updateJob };
