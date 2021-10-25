import Post from "../models/postModel";

export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!(allowedFields.includes(el))) newObj[el] = obj[el];
  });
  return newObj;
};


export const userPostsAndLikes = async (postsRequest, likesRequest) => {
  let posts = await postsRequest
  let likes = await likesRequest

  let data = posts.reduce((acc, post) => {
    let likeArray = [];
    let disLikeArray = [];

    likes.forEach(like => {
      if (post._id.toString() === like.post.toString() && like.likeType === "like") {
        likeArray.push(like)
      }
      if (
        post._id.toString() === like.post.toString() &&
        like.likeType === "dislike"
      ) {
        disLikeArray.push(like);
      }
    })
    acc.push({ ...post, likes: likeArray, disLikes: disLikeArray })
    
    return acc;
    
  }, [])
  
  let outputs = await Promise.allSettled(data);

  let responseData = outputs.map(output => {
    return {
      ...output.value._doc,
      likes: output.value.likes,
      dislike: output.value.disLikes
    };
  })

  return responseData;
}