const pool = require("../models/db");

//create event
exports.createEvent = async (req, res) => {
  const { title, date_time, location, capacity } = req.body;
  if (!title || !date_time || !location || !capacity) {
    return res
      .status(400)
      .json({ error: "Title, date_time, location, and capacity are required" });
  }

  if (capacity && (isNaN(capacity) || capacity > 1000 || capacity < 1)) {
    return res.status(400).json({
      error: "Capacity must be a number and between 1 and 1000",
    });
  }
  try {
    const result = await pool.query(
      `INSERT INTO events (title, date_time, location, capacity) VALUES ($1, $2, $3, $4) RETURNING id`,
      [title, date_time, location, capacity]
    );
    res.status(201).json({ eventId: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all events
exports.getAllEvents = async (req, res) => {
  const { id: eventId } = req.params;
  if (!eventId) {
    return res.status(400).json({ error: "Event ID is required" });
  }
  try {
    const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [
      eventId,
    ]);
    if (event.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    const users = await pool.query(
      `SELECT u.id, u.name, u.email
       FROM registrations r JOIN users u ON r.user_id = u.id
       WHERE r.event_id = $1`,
      [eventId]
    );
    res.json({ ...event.rows[0], registration: users.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//register for event
exports.registerForEvent = async (req, res) => {
  const userId = req.body?.userId;
  const { id: eventId } = req.params;
  if (!userId || !eventId) {
    return res.status(400).json({ error: "User ID and Event ID are required" });
  }
  try {
    const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [
      eventId,
    ]);
    if (event.rowCount === 0) {
      return res.status(404).json({ error: "No event found" });
    }
    const eventData = event.rows[0];
    //no duplicate reg
    const checkDuplicate = await pool.query(
      `SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2`,
      [userId, eventId]
    );
    if (checkDuplicate.rowCount > 0) {
      return res.status(400).json({ error: "Already registered" });
    }

    //if event full
    const count = await pool.query(
      `SELECT COUNT(*) FROM registrations WHERE event_id = $1`,
      [eventId]
    );
    if (+count.rows[0].count >= eventData.capacity) {
      return res.status(400).json({ error: "Event is full" });
    }

    //cannot reg for past event
    const now = new Date();
    if (new Date(eventData.date_time) < now) {
      return res.status(400).json({ error: "Cannot register for past event" });
    }

    await pool.query(
      `INSERT INTO registrations (user_id, event_id) VALUES ($1,$2)`,
      [userId, eventId]
    );

    res.status(201).json({ message: "registration successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//cancel registration
exports.cancelRegistration = async (req, res) => {
  const userId = req.body?.userId;
  const { id: eventId } = req.params;
  if (!userId || !eventId) {
    return res.status(400).json({ error: "User ID and Event ID are required" });
  }
  try {
    const check = await pool.query(
      `SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2`,
      [userId, eventId]
    );
    if (check.rowCount === 0) {
      return res.status(404).json({ error: "No registration found" });
    }
    await pool.query(
      `DELETE FROM registrations WHERE user_id = $1 AND event_id = $2`,
      [userId, eventId]
    );
    res.status(201).json({ message: "Registration cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//list upcoming events
exports.listUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const events = await pool.query(
      `SELECT * FROM events WHERE date_time > $1 ORDER BY date_time ASC, location ASC`,
      [now]
    );
    res.json(events.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//EVENT STATUS
exports.eventStatus = async (req, res) => {
  const eventId = req.params?.id;
  if (!eventId) {
    return res.status(400).json({ error: "Event ID is required" });
  }
  try {
    const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [
      eventId,
    ]);
    if (event.rowCount === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    const capacity = event.rows[0].capacity;
    const count = await pool.query(
      "SELECT COUNT(*) FROM registrations WHERE event_id = $1",
      [req.params.id]
    );
    console.log(count.rows[0].count);

    const total = +count.rows[0].count;
    const remaining = capacity - total;
    const percentage = ((total / capacity) * 100).toFixed(2);

    res.json({
      totalRegistrations: total,
      remainingCapacity: remaining,
      percentageUsed: percentage + "%",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
