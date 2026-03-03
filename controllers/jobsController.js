const getJobs = async (req, res) => {
  return res.status(200).send("Hello from getjobs");
};

const addJob = async (req, res) => {
  return res.status(201).send("Add a job");
};

const getJob = async (req, res) => {
  return res.status(200).send("get job by id");
};

const deleteJob = async (req, res) => {
  return res.status(200).send("Delete Job by id");
};

const updateJob = async (req, res) => {
  return res.status(200).send("update job by id");
};
module.exports = { getJobs, addJob, getJob, deleteJob, updateJob };
