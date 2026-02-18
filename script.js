const form = document.querySelector("#myForm");
const feed = document.getElementById("feed");

let postid = 1;

form.addEventListener("submit", handleSubmit);

// createPost("Welcome to Crudly.");

const posts = await loadPosts();
for (const post of posts) {
  createPost(post["text"]);
}

function handleSubmit(e) {
  e.preventDefault();
  const content = document.getElementById("input").value;
  createPost(content);
}

function createPost(content) {
  // create new post with unique id and timestamp
  const newPost = document.createElement("div");
  const timestamp = new Date(Date.now()).toLocaleString();
  newPost.id = `post-${postid}`;
  newPost.className = "post";
  newPost.innerHTML = `
  <div class="post-head">
    <small class="date">${timestamp}</small>
    <span>
      <i id="edit-btn-${postid}" class="fa-regular fa-pen-to-square right"></i>
      <i id="delete-btn-${postid}" class="fa-regular fa-rectangle-xmark right"></i>
    <span>
  </div>
  <div class="post-text">
    <p id=content-${postid}>"${content}"</p>
  </div>
  `;

  // append post to end of feed
  feed.appendChild(newPost);

  // add delete button listener
  const id = postid;
  const deleteBtn = document.getElementById(`delete-btn-${id}`);
  deleteBtn.addEventListener("click", () => deletePostById(id));

  // add edit button listener
  const editBtn = document.getElementById(`edit-btn-${id}`);
  editBtn.addEventListener("click", () => editPostById(id));

  // clear user input
  document.getElementById("input").value = "";

  // increment post id
  postid++;
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

async function loadPosts() {
  try {
    const url = "http://127.0.0.1:8000/";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Reponse error: ${response.Error}`);
    }

    const result = await response.json();
    return result;
  } catch (e) {
    throw e;
  }
}
