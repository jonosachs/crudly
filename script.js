const form = document.querySelector("#myForm");
const feed = document.getElementById("feed");

form.addEventListener("submit", handleSubmit);
const errorBar = document.getElementById("post");

refreshFeed();

async function refreshFeed() {
  const posts = await getAllPosts();
  for (const post of posts) {
    if (post) buildPost(post.id, post.created, post.text);
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
  buildPost(newpost.id, newpost.created, newpost.text);
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

function buildPost(id, created, text) {
  const newPost = document.createElement("div");
  newPost.id = `post-${id}`;
  newPost.className = "post";
  newPost.innerHTML = `
  <div class="post-head">
    <small id="timestamp-${id}" class="timestamp">${created}</small>
    <span>
      <i id="edit-btn-${id}" class="fa-regular fa-pen-to-square right"></i>
      <i id="delete-btn-${id}" class="fa-regular fa-rectangle-xmark right"></i>
    <span>
  </div>
  <div class="post-text">
    <p id=content-${id}></p>
  </div>
  `;

  // append post to end of feed
  feed.appendChild(newPost);

  // set user supplied text using textContent (instead of innerHTML)
  document.getElementById(`content-${id}`).textContent = text;

  // add delete button listener
  const ref = id;
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
  const timestamp = document.getElementById(`timestamp-${id}`);
  const updatedText = editbox.value;

  console.log(id, updatedText);

  // update post on server (and get new timestamp)
  const updatedPost = await updatePost(id, updatedText);

  // update text and timestamp locally
  postText.textContent = updatedPost.text;
  timestamp.textContent = updatedPost.updated;

  // remove the edit box
  post.removeChild(editbox);

  console.log("post updated");
}

async function serverRequest({
  base_url = "http://127.0.0.1:8000/",
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
