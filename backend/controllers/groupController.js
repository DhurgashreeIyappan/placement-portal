/**
 * Group controller - Create and manage student groups (Coordinator)
 */
import Group from '../models/Group.js';
import User from '../models/User.js';

export const createGroup = async (req, res, next) => {
  try {
    const group = await Group.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, group });
  } catch (err) {
    next(err);
  }
};

export const updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    ).populate('members', 'name email rollNo batch');
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    res.json({ success: true, group });
  } catch (err) {
    next(err);
  }
};

export const getGroups = async (req, res, next) => {
  try {
    const { type, companyId, batchYear } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (companyId) filter.company = companyId;
    if (batchYear) filter.batchYear = batchYear;
    const groups = await Group.find(filter).populate('company', 'name academicYear').populate('members', 'name email rollNo batch').populate('createdBy', 'name');
    res.json({ success: true, groups });
  } catch (err) {
    next(err);
  }
};

export const getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('company', 'name academicYear')
      .populate('members', 'name email rollNo batch branch cgpa')
      .populate('createdBy', 'name');
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    res.json({ success: true, group });
  } catch (err) {
    next(err);
  }
};

export const addMembersToGroup = async (req, res, next) => {
  try {
    const { memberIds } = req.body;
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    const newIds = [...new Set([...group.members.map(String), ...memberIds])];
    group.members = newIds;
    await group.save();
    await group.populate('members', 'name email rollNo batch');
    res.json({ success: true, group });
  } catch (err) {
    next(err);
  }
};

export const removeMemberFromGroup = async (req, res, next) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    group.members = group.members.filter((m) => m.toString() !== req.params.memberId);
    await group.save();
    await group.populate('members', 'name email rollNo batch');
    res.json({ success: true, group });
  } catch (err) {
    next(err);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    res.json({ success: true, message: 'Group deleted' });
  } catch (err) {
    next(err);
  }
};
