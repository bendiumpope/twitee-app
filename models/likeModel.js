import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    likeType: {
      type: String,
      enum: ["like", "dislike"],
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

// likeSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select: "_id name",
//   });
//   this.populate({
//     path: "post",
//   });

//   next();
// });

const Like = mongoose.model("Like", likeSchema);

export default Like;
