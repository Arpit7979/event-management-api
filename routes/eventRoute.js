const express = require("express");
const eventController = require("../controllers/eventController");

const router = express.Router();

router.get("/upcoming-events", eventController.listUpcomingEvents);
router.post("/create-event", eventController.createEvent);
router.get("/:id", eventController.getAllEvents);
router.post("/:id/register", eventController.registerForEvent);
router.delete("/:id/cancel-registration", eventController.cancelRegistration);
router.get("/:id/event-status", eventController.eventStatus);

module.exports = router;
