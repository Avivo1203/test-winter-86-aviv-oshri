"use client";

import { useEffect, useState } from "react";
import styles from "./Posts.module.css";

type Post = {
  _id: string;
  author: string;
  title: string;
  content: string;
  likes: number;
};

export default function Posts() {
  // Posts list
  const [posts, setPosts] = useState<Post[]>([]);

  // Form inputs
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [likes, setLikes] = useState("");

  // Load posts from DB
 async function loadPosts() {
  const res = await fetch("/api/posts", { cache: "no-store" });

  // If server returned an error, show it and stop
  if (!res.ok) {
    const text = await res.text();
    console.error("GET /api/posts failed:", text);
    return;
  }

  // Read JSON safely
  const data = await res.json();
  setPosts(data);
}

// Add new post
async function addPost() {
  // simple validation
  if (!author || !title || !content || likes === "") return;

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      author,
      title,
      content,
      likes: Number(likes),
    }),
  });

  // אם השרת החזיר שגיאה - נדפיס מה הוא החזיר ונעצור
  if (!res.ok) {
    const text = await res.text();
    console.error("POST /api/posts failed:", text);
    return;
  }

  // clear inputs after adding
  setAuthor("");
  setTitle("");
  setContent("");
  setLikes("");

  // refresh list immediately
  await loadPosts();
}

  // Delete post
  async function deletePost(id: string) {
    await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
    await loadPosts();
  }

  // Find the post with the longest content
  let mostLongPost: Post | null = null;
  if (posts.length > 0) {
    mostLongPost = posts[0];
    for (let i = 1; i < posts.length; i++) {
      if (posts[i].content.length > mostLongPost.content.length) {
        mostLongPost = posts[i];
      }
    }
  }

  return (
    <div className={styles.wrap}>
      {/* Add Post UI */}
      <h2 className={styles.title}>Add Post</h2>

      <div className={styles.formRow}>
        <span className={styles.label}>Author:</span>
        <input
          className={styles.input}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <div className={styles.formRow}>
        <span className={styles.label}>Title:</span>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className={styles.formRow}>
        <span className={styles.label}>Content:</span>
        <textarea
          className={styles.input}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
      </div>

      <div className={styles.formRow}>
        <span className={styles.label}>Likes:</span>
        <input
          className={styles.input}
          type="number"
          value={likes}
          onChange={(e) => setLikes(e.target.value)}
        />
      </div>

      <button className={styles.btn} onClick={addPost}>
        Add Post
      </button>

      <hr className={styles.hr} />

      {/* Posts list */}
      <h2 className={styles.sectionTitle}>Posts List</h2>

      {posts.map((p) => (
        <div key={p._id} className={styles.postCard}>
          <p className={styles.small}>author: {p.author}</p>
          <p className={styles.small}>title: {p.title}</p>
          <p className={styles.small}>content: {p.content}</p>
          <p className={styles.small}>likes: {p.likes}</p>

          <button className={styles.btn} onClick={() => deletePost(p._id)}>
            Delete
          </button>
        </div>
      ))}

      {/* Most long post */}
      {mostLongPost && (
        <p className={styles.footerNote}>
          The Most Long Post is with the title – {mostLongPost.title} of{" "}
          {mostLongPost.author}
        </p>
      )}
    </div>
  );
}
