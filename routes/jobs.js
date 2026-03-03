const express = require("express");
const {
  getJobs,
  addJob,
  updateJob,
  getJob,
  deleteJob,
} = require("../controllers/jobsController");

const router = express.Router();

router.route("/").get(getJobs).post(addJob);
router.route("/new").get((req, res) => {
  res.render("jobs");
});
router.route("/edit/:id").post(updateJob).get(getJob);
router.route("/delete/:id").post(deleteJob);

module.exports = router;
