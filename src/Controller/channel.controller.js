import Channel from "../Models/channelModel.js";
import Video from "../Models/videoModel.js";
import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";

// CREATE CHANNEL CONTROLLER
export const createChannel = async (req, res) => {
  try {
    // extracting required fields from request body
    const { channelName, description, channelBanner, uniqueDeleteKey } = req.body;

    // getting authenticated user id from auth middleware
    const userId = req.user.id;

    // validating channel name
    if (!channelName) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    // validating unique delete key
    if (!uniqueDeleteKey) {
      return res.status(400).json({ message: "Unique delete key is required" });
    }

    // checking if user already owns a channel
    const existingChannel = await Channel.findOne({ owner: userId });
    if (existingChannel) {
      return res.status(400).json({ message: "User already has a channel" });
    }

    // hashing delete key before storing it
    const hashedDeleteKey = await bcrypt.hash(uniqueDeleteKey, 10);

    // creating new channel instance
    const newChannel = new Channel({
      channelName,
      description,
      channelBanner,
      uniqueDeleteKey: hashedDeleteKey,
      owner: userId,
    });

    // saving channel to database
    const savedChannel = await newChannel.save();

    // attaching channel reference to user document
    await User.findByIdAndUpdate(userId, { channel: savedChannel._id });

    // returning created channel
    res.status(201).json(savedChannel);

  } catch (err) {
    // handling server errors
    res.status(500).json({ message: "Error creating channel", error: err });
  }
};


//   GET ALL CHANNELS
export const getAllChannels = async (req, res) => {
  try {
    // fetching all channels with basic owner details
    const channels = await Channel.find()
      .populate("owner", "username avatar");

    // sending channels list
    res.status(200).json(channels);

  } catch (err) {
    // handling server errors
    res.status(500).json({ message: "Error fetching channels", error: err, });
  }
};


//   GET CHANNEL BY ID
export const getChannelById = async (req, res) => {
  try {
    // extracting channel id from route params
    const { id } = req.params;

    // fetching channel and populating owner details
    const channel = await Channel.findById(id)
      .populate("owner", "username avatar email");

    // returning error if channel does not exist
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // fetching all videos uploaded under this channel
    const videos = await Video.find({ channel: id })
      .sort({ createdAt: -1 }) // sorting videos by newest first
      .populate("channel", "channelName description subscribers")
      .populate("uploader", "username avatar");

    // sending channel and video data together
    res.status(200).json({
      success: true,
      channel,
      videos,
      videoCount: videos.length,
    });

  } catch (error) {
    // handling server errors
    res.status(500).json({
      success: false,
      message: "Error fetching channel details",
      error: error.message,
    });
  }
};


//   DELETE CHANNEL
export const deleteChannel = async (req, res) => {
  try {
    // extracting channel id and delete key
    const { id } = req.params;
    const { uniqueDeleteKey } = req.body;

    // getting authenticated user id
    const userId = req.user.id;

    // fetching channel from database
    const channel = await Channel.findById(id);

    // returning error if channel does not exist
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // checking channel ownership
    if (channel.owner.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this channel" });
    }

    // validating delete key
    const isKeyValid = await bcrypt.compare(uniqueDeleteKey, channel.uniqueDeleteKey);
    if (!uniqueDeleteKey || !isKeyValid) {
      return res.status(403).json({ message: "Invalid delete key verification" });
    }

    // deleting all videos under this channel
    await Video.deleteMany({ channel: id });

    // deleting the channel itself
    await Channel.findByIdAndDelete(id);

    // removing channel reference from user document
    await User.findByIdAndUpdate(userId, { channel: null });

    // sending success response
    res.status(200).json({ message: "Channel deleted successfully" });

  } catch (err) {
    // handling server errors
    res.status(500).json({ message: "Error deleting channel", error: err });
  }
};


//   UPDATE CHANNEL
export const updateChannel = async (req, res) => {
  try {
    // extracting channel id and update fields
    const { id } = req.params;
    const { channelName, description, channelBanner } = req.body;

    // getting authenticated user id
    const userId = req.user.id;

    // fetching channel from database
    const channel = await Channel.findById(id);

    // returning error if channel does not exist
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // checking ownership before updating
    if (channel.owner.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this channel" });
    }

    // updating fields only if they are provided
    if (channelName) channel.channelName = channelName;
    if (description !== undefined) channel.description = description;
    if (channelBanner !== undefined) channel.channelBanner = channelBanner;

    // saving updated channel
    const updatedChannel = await channel.save();

    // sending updated channel
    res.status(200).json(updatedChannel);

  } catch (err) {
    // handling server errors
    res.status(500).json({ message: "Error updating channel", error: err });
  }
};
