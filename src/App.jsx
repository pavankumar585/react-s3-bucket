import { useEffect, useState, useRef } from "react";
import { getPosts, savePost, deletePost } from "../services/postService";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [id, setId] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await getPosts();
    setPosts([...posts, ...data]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) formData.append("image", file);
    if (id) formData.append("_id", id);

    try {
      const { data: post } = await savePost(formData);
      if (id) {
        const updatedPosts = posts.map((p) => (p._id === post._id ? post : p));
        setPosts(updatedPosts);
      } else setPosts((prev) => [...prev, post]);

      inputRef.current.value = "";
      setFile(null);
      setId("");
      setTitle("");
      setContent("");
      setImage("");
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 400)
        setError(error.response.data);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    const updatedPosts = posts.filter((p) => p._id !== id);
    setPosts(updatedPosts);
  };

  const handleUpdate = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setImage(post.image_url);
    setId(post._id);
    inputRef.current.value = "";
    setFile(null);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          accept=".jpg, .jpeg, .png"
          ref={inputRef}
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="enter title"
        />
        <textarea
          rows={"10"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="enter content"
        />
        <button disabled={loading} type="submit">
          submit
        </button>
        <h6>{error}</h6>
      </form>
      <div className="post-container">
        {posts.map((post) => (
          <div key={post._id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <figure>
              <img src={post.image_url} alt={post.image_url} />
            </figure>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
            &nbsp;&nbsp;
            <button onClick={() => handleUpdate(post)}>Update</button>
          </div>
        ))}
      </div>
      <div className="image-container">
        {(file || image) && (
          <img src={(file && URL.createObjectURL(file)) || image} />
        )}
      </div>
    </div>
  );
}

export default App;
