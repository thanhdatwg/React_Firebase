import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import { db } from "./firebase";
import firebase from "firebase";
function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt="Admin" src="./image.png" />
        <h3>{username}</h3>
      </div>
      <img className="post__image" src={imageUrl} alt=""></img>
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>
      <Divider />
      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong className="post__comment">{comment.username}</strong>
            {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="コメントを追加..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            アップ
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
