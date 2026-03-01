import { BASE_URL } from "./config.js";

const form = document.querySelector("#myForm");
const feed = document.getElementById("feed");

form.addEventListener("submit", handleSubmit);
const errorBar = document.getElementById("post");

refreshFeed();

async function refreshFeed() {
  const posts = await getAllPosts();
  for (const post of posts) {
    if (post) buildPost(post);
  }

  errorBar.innerHTML = "";
}

function handleSubmit(e) {
  e.preventDefault();
  const text = document.getElementById("input").value;
  createNewPost(text);
}

async function getAllPosts() {
  const response = await serverRequest({ method: "GET" });
  return response;
}

async function createNewPost(text) {
  const newpost = await serverRequest({ method: "POST", data: { text: text } });
  buildPost(newpost);
  console.log("post created");
}

async function updatePost(post_id, text) {
  const newpost = await serverRequest({
    route: post_id,
    method: "PUT",
    data: { text: text },
  });
  return newpost;
}

async function deletePost(post_id) {
  const deleted = await serverRequest({ route: post_id, method: "DELETE" });
}

function buildPost(post) {
  const newPost = document.createElement("div");
  newPost.id = `post-${post.id}`;
  newPost.className = "post";
  newPost.innerHTML = `
  <div class="post-head">
    <span>
      <small id="timestamp-${post.id}" class="timestamp">Created: ${post.created}</small>
    </span>
    <span>
      <i id="edit-btn-${post.id}" class="fa-regular fa-pen-to-square right"></i>
      <i id="delete-btn-${post.id}" class="fa-regular fa-rectangle-xmark right"></i>
    </span>
  </div>
  <div class="post-head">
    <small id="timestamp-updated-${post.id}" class="timestamp updated">
    ${post.updated ? `Edited: ${post.updated}` : ""}</small>
  </div>
  <div class="post-text">
    <p id=content-${post.id}></p>
  </div>
  `;

  // append post to end of feed
  feed.appendChild(newPost);

  // set user supplied text using textContent (instead of innerHTML)
  document.getElementById(`content-${post.id}`).textContent = post.text;

  // add delete button listener
  const ref = post.id;
  const deleteBtn = document.getElementById(`delete-btn-${ref}`);
  deleteBtn.addEventListener("click", async () => await deletePostById(ref));

  // add edit button listener
  const editBtn = document.getElementById(`edit-btn-${ref}`);
  editBtn.addEventListener("click", async () => await editPostById(ref));

  // clear user input
  document.getElementById("input").value = "";
}

async function deletePostById(id) {
  // delete post from server
  await deletePost(id);

  // delete post locally
  const post = document.getElementById(`post-${id}`);
  feed.removeChild(post);

  console.log("post deleted");
}

async function editPostById(id) {
  const post = document.getElementById(`post-${id}`);
  const postText = document.getElementById(`content-${id}`);
  const editbox = document.createElement("textarea");

  document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
      postText.textContent = postText.textContent;
      post.removeChild(editbox);
      return;
    }
  });

  editbox.id = `editbox-${id}`;
  editbox.value = postText.textContent;
  postText.textContent = "";
  post.appendChild(editbox);

  editbox.focus();

  // merge text on editbox loss of focus (a click outside the box)
  editbox.addEventListener("blur", async () => await mergetext(id));
}

async function mergetext(id) {
  const post = document.getElementById(`post-${id}`);
  const postText = document.getElementById(`content-${id}`);
  const editbox = document.getElementById(`editbox-${id}`);
  const updatedText = editbox.value;
  const updated_timestamp = document.getElementById(`timestamp-updated-${id}`);

  // update post on server (and get new timestamp)
  const updatedPost = await updatePost(id, updatedText);

  // update text and timestamp locally
  postText.textContent = updatedPost.text;
  updated_timestamp.innerHTML = `Edited: ${updatedPost.updated}`;

  // remove the edit box
  post.removeChild(editbox);

  console.log("post updated");
}

async function serverRequest({
  base_url = BASE_URL,
  route = "",
  method = "GET",
  data = undefined,
}) {
  try {
    const url = `${base_url}${route}`;
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      const msg = `${response.status} ${response.statusText}<br>Detail: ${error.detail}`;
      throw new Error(msg);
    }

    const result = await response.json();
    return result;
  } catch (e) {
    errorBar.innerHTML = e;
    console.log(e);
  }
}
