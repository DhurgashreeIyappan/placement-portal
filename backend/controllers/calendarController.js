/**
 * Calendar controller - Company visit schedules
 */
import CalendarEvent from '../models/CalendarEvent.js';

export const createEvent = async (req, res, next) => {
  try {
    const event = await CalendarEvent.create({ ...req.body, createdBy: req.user.id });
    await event.populate('company', 'name academicYear');
    res.status(201).json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const { companyId, start, end } = req.query;
    const filter = {};
    if (companyId) filter.company = companyId;
    if (start && end) {
      filter.eventDate = { $gte: new Date(start), $lte: new Date(end) };
    }
    const events = await CalendarEvent.find(filter)
      .populate('company', 'name academicYear')
      .sort('eventDate');
    res.json({ success: true, events });
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await CalendarEvent.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    ).populate('company', 'name academicYear');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await CalendarEvent.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
