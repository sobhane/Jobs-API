const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJobs,
  CreateJobs,
  updateJobs,
  deleteJobs,
} = require("../controllers/jobs");

router.route("/").get(getAllJobs).post(CreateJobs);
router.route("/:id").get(getJobs).delete(deleteJobs).patch(updateJobs);

module.exports = router;
