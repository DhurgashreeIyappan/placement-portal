/**
 * Announcement controller - Post and list announcements in groups
 */
import Announcement from '../models/Announcement.js';
import Group from '../models/Group.js';

export const createAnnouncement = async (req, res, next) => {
  try {
    const group = await Group.findOne({ _id: req.body.groupId, createdBy: req.user.id });
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    const announcement = await Announcement.create({
      group: req.body.groupId,
      title: req.body.title,
      content: req.body.content,
      createdBy: req.user.id,
    });
    await announcement.populate('group', 'name type');
    res.status(201).json({ success: true, announcement });
  } catch (err) {
    next(err);
  }
};

export const getAnnouncementsByGroup = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({ group: req.params.groupId })
      .populate('createdBy', 'name')
      .sort('-createdAt');
    res.json({ success: true, announcements });
  } catch (err) {
    next(err);
  }
};

export const getMyAnnouncements = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user.id }).select('_id');
    const groupIds = groups.map((g) => g._id);
    const announcements = await Announcement.find({ group: { $in: groupIds } })
      .populate('group', 'name type')
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .limit(50);
    res.json({ success: true, announcements });
  } catch (err) {
    next(err);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const ann = await Announcement.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { title: req.body.title, content: req.body.content },
      { new: true }
    ).populate('group', 'name');
    if (!ann) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.json({ success: true, announcement: ann });
  } catch (err) {
    next(err);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const ann = await Announcement.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!ann) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
