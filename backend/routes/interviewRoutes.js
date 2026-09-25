const express = require("express");

const Interview = require("../models/Interview");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ADD INTERVIEW
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      company,
      role,
      interviewDate,
      interviewType,
      meetingLink,
      notes,
      status,
    } = req.body;

    if (!company || !role || !interviewDate) {
      return res.status(400).json({
        message: "Company, role and interview date are required",
      });
    }

    const interview = await Interview.create({
      userId: req.userId,
      company,
      role,
      interviewDate,
      interviewType,
      meetingLink,
      notes,
      status,
    });

    res.status(201).json({
      message: "Interview added successfully",
      interview,
    });
  } catch (error) {
    console.error("ADD INTERVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to add interview",
    });
  }
});

// GET UPCOMING INTERVIEWS
router.get("/upcoming", authMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.userId,
      status: "Upcoming",
      interviewDate: {
        $gte: new Date(),
      },
    })
      .sort({
        interviewDate: 1,
      })
      .limit(5);

    res.json(interviews);
  } catch (error) {
    console.error("UPCOMING INTERVIEWS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch upcoming interviews",
    });
  }
});

// GET ALL INTERVIEWS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.userId,
    }).sort({
      interviewDate: 1,
    });

    res.json(interviews);
  } catch (error) {
    console.error("GET INTERVIEWS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch interviews",
    });
  }
});

// UPDATE INTERVIEW
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.json({
      message: "Interview updated successfully",
      interview,
    });
  } catch (error) {
    console.error("UPDATE INTERVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to update interview",
    });
  }
});

// DELETE INTERVIEW
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.json({
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error("DELETE INTERVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to delete interview",
    });
  }
});

module.exports = router;
