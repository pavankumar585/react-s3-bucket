import http from "./httpService";

export function getPosts() {
  return http.get("/posts");
}

export function savePost(post) {
  const id = post.get("_id");
  post.delete("_id");

  if (id) {
    return http.put("/posts/" + id, post, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  return http.post("/posts", post, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deletePost(id) {
  return http.delete("/posts/" + id);
}
