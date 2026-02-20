const form = document.querySelector("#myForm");
const feed = document.getElementById("feed");

form.addEventListener("submit", handleSubmit);

refreshFeed();

async function refreshFeed() {
  const posts = await getAllPosts();
  for (const post of posts) {
    buildPost(post.id, post.timestamp, post.text);
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const content = document.getElementById("input").value;
  buildPost(content);
}

async function createNewPost(text) {
  const newpost = await serverRequest("/", "POST", { text: text });
  console.log(newpost);
  buildPost(newpost.id, newpost.timestamp, newpost.text);
}

function buildPost(id, timestamp, text) {
  const newPost = document.createElement("div");
  newPost.id = `post-${id}`;
  newPost.className = "post";
  newPost.innerHTML = `
  <div class="post-head">
    <small class="date">${timestamp}</small>
    <span>
      <i id="edit-btn-${id}" class="fa-regular fa-pen-to-square right"></i>
      <i id="delete-btn-${id}" class="fa-regular fa-rectangle-xmark right"></i>
    <span>
  </div>
  <div class="post-text">
    <p id=content-${id}>"${text}"</p>
  </div>
  `;

  // append post to end of feed
  feed.appendChild(newPost);

  // add delete button listener
  const ref = id;
  const deleteBtn = document.getElementById(`delete-btn-${ref}`);
  deleteBtn.addEventListener("click", () => deletePostById(ref));

  // add edit button listener
  const editBtn = document.getElementById(`edit-btn-${ref}`);
  editBtn.addEventListener("click", () => editPostById(ref));

  // clear user input
  document.getElementById("input").value = "";
}

function deletePostById(id) {
  const post = document.getElementById(`post-${id}`);
  feed.removeChild(post);
}

function editPostById(id) {
  console.log("edit post");
  const post = document.getElementById(`post-${id}`);
  const postText = document.getElementById(`content-${id}`);
  const editbox = document.createElement("textarea");
  editbox.id = `editbox-${id}`;
  editbox.value = postText.textContent.slice(1, -2); // remove inverted commas
  postText.textContent = "";
  post.appendChild(editbox);

  editbox.focus();

  // listen for editbox loss of focus (a click outside the box)
  editbox.addEventListener("blur", () => {
    lockcontent(id);
  });
}

function lockcontent(id) {
  console.log("lock");
  const post = document.getElementById(`post-${id}`);
  const postText = document.getElementById(`content-${id}`);
  const editbox = document.getElementById(`editbox-${id}`);
  postText.textContent = `"${editbox.value}"`;
  post.removeChild(editbox);
}

async function getAllPosts() {
  const response = await serverRequest("/", "GET", null);
  return response;
}

async function serverRequest(route, method, data) {
  try {
    const url = `http://127.0.0.1:8000${route}`;
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Server reponse error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (e) {
    throw e;
  }
}
