import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id name",
  })
  this.populate({
    path:"post"
  });

  next();
});


const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
