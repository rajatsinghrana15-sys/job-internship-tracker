const express = require("express");

const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ADD APPLICATION
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      company,
      role,
      type,
      location,
      status,
      applicationDate,
      jobUrl,
      notes,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        message: "Company and role are required",
      });
    }

    const application = await Application.create({
      userId: req.userId,
      company,
      role,
      type,
      location,
      status,
      applicationDate,
      jobUrl,
      notes,
    });

    res.status(201).json({
      message: "Application added successfully",
      application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add application",
    });
  }
});

// GET APPLICATION STATISTICS
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.userId,
    });

    const stats = {
      total: applications.length,
      applied: applications.filter(
        (application) => application.status === "Applied",
      ).length,
      interviews: applications.filter(
        (application) => application.status === "Interview",
      ).length,
      offers: applications.filter(
        (application) => application.status === "Offer",
      ).length,
      rejected: applications.filter(
        (application) => application.status === "Rejected",
      ).length,
    };

    res.json(stats);
  } catch (error) {
    console.error("STATS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch application statistics",
    });
  }
});

// GET ANALYTICS
router.get("/analytics", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.userId,
    }).sort({
      applicationDate: 1,
    });

    const analytics = {
      total: applications.length,

      statusBreakdown: {
        applied: applications.filter(
          (application) => application.status === "Applied",
        ).length,

        interviews: applications.filter(
          (application) => application.status === "Interview",
        ).length,

        offers: applications.filter(
          (application) => application.status === "Offer",
        ).length,

        rejected: applications.filter(
          (application) => application.status === "Rejected",
        ).length,
      },

      typeBreakdown: {
        fullTime: applications.filter(
          (application) => application.type === "Full Time",
        ).length,

        internship: applications.filter(
          (application) => application.type === "Internship",
        ).length,

        partTime: applications.filter(
          (application) => application.type === "Part Time",
        ).length,

        contract: applications.filter(
          (application) => application.type === "Contract",
        ).length,
      },
    };

    res.json(analytics);
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch analytics",
    });
  }
});

// GET ALL APPLICATIONS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(applications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
});

// UPDATE APPLICATION
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("UPDATE REQUEST");
    console.log("Application ID:", req.params.id);
    console.log("User ID:", req.userId);

    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    console.log("Found application:", application);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    application.company = req.body.company;
    application.role = req.body.role;
    application.type = req.body.type;
    application.location = req.body.location;
    application.status = req.body.status;
    application.applicationDate = req.body.applicationDate;
    application.jobUrl = req.body.jobUrl;
    application.notes = req.body.notes;

    await application.save();

    res.json({
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      message: "Failed to update application",
    });
  }
});

// DELETE APPLICATION
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete application",
    });
  }
});

module.exports = router;
