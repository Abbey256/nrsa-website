import React, { useEffect, useState } from "react";
import axios from "axios";

const MediaAdmin = () => {
  const [media, setMedia] = useState([]);
  const [editingMedia, setEditingMedia] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    category: "",
  });

  const token = localStorage.getItem("token");

  // Fetch all media
  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await axios.get("/api/media");
      setMedia(res.data);
    } catch (err) {
      console.error("Error fetching media:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingMedia(item);
    setFormData({
      title: item.title,
      url: item.url,
      category: item.category,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;
    try {
      await axios.delete(`/api/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMedia();
    } catch (err) {
      console.error("Error deleting media:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMedia) {
        await axios.put(`/api/media/${editingMedia.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/media", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ title: "", url: "", category: "" });
      setEditingMedia(null);
      fetchMedia();
    } catch (err) {
      console.error("Error saving media:", err);
    }
  };

  return (
    <div className="admin-container">
      <h2>Media Management</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Image / Video URL"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          required
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="">Select category</option>
          <option value="Image">Image</option>
          <option value="Video">Video</option>
          <option value="Audio">Audio</option>
        </select>

        <button type="submit">
          {editingMedia ? "Update Media" : "Add Media"}
        </button>
      </form>

      <div className="media-list">
        {media.map((item) => (
          <div key={item.id} className="media-item">
            <h4>{item.title}</h4>
            <p>Category: {item.category}</p>
            {item.url.includes("youtube") ? (
              <iframe width="250" height="150" src={item.url} title={item.title}></iframe>
            ) : (
              <img src={item.url} alt={item.title} width="250" />
            )}
            <div>
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaAdmin;