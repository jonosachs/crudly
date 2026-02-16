const form = document.querySelector("#myForm");
const feed = document.getElementById("feed");

let postid = 1;

form.addEventListener("submit", handleSubmit);

createPost("Welcome to Crudly.");

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
    <i id="delete-btn-${postid}" class="fa-regular fa-rectangle-xmark right"></i>
  </div>
  <div class="post-text">
    <p>"${content}"</p>
  </div>
  `;

  // append post to end of feed
  feed.appendChild(newPost);

  // add delete button listener
  const id = postid;
  deleteBtn = document.getElementById(`delete-btn-${id}`);
  deleteBtn.addEventListener("click", () => deletePostById(id));

  // clear user input
  document.getElementById("input").value = "";

  // increment post id
  postid++;
}

function deletePostById(id) {
  post = document.getElementById(`post-${id}`);
  feed.removeChild(post);
}
