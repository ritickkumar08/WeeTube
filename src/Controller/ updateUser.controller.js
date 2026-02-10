import User from "../Models/userModel.js";

const updateUserController = async (req, res) => {
  try {
    // extracting allowed fields from request body
    const { username, email, logo } = req.body;

    // getting authenticated user id from auth middleware
    const userId = req.user.id;

    // object to store only fields that need to be updated
    const updates = {};
    // if username is sent, add it to update object
    if (username) updates.username = username;
    // if email is sent, add it to update object
    if (email) updates.email = email;
    // if avatar url is sent, update avatar url
    if (logo) updates.avatar = logo;

    // updating user document and returning the updated version
    const updatedUser = await User.findByIdAndUpdate(
      userId,          // user to update
      updates,         // fields to update
      {
        new: true,     // return updated document
        runValidators: true // ensure schema validations run
      }
    ).select("-password"); // removing password from response

    // if user does not exist, return not found
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found", });
    }

    // sending updated user back to frontend
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser, 
    });

  } catch (err) {
    // logging error for debugging
    console.error(err);
    // generic server error response
    res.status(500).json({ message: "Internal server error", });
  }
};

export default updateUserController;