const express = require("express");
const {
  getAllReports,
  lockAccount,
  updateReportStatus,
  getAllAccounts,
  deleteReport,
  createReport,
} = require("../controllers/BaoCaoController");
const router = express.Router();

router.get("/getAllReport", getAllReports);

router.put("/blockAccount", lockAccount);

router.put("/confirmReport", updateReportStatus);

router.get("/getAllAccount", getAllAccounts);

router.delete("/delete/Report", deleteReport);

router.post("/create/Report", createReport)

module.exports = router;
