// Wait for the DOM to completely load before we run our JS
document.addEventListener("DOMContentLoaded", e => {
  if (e) {
    console.log("DOM loaded! 🚀");
  }

  const exerContainer = document.querySelector(".exercise-container");
  const postCategorySelect = document.getElementById("preCategory");

  let posts;

  // Function to grab posts from the database
  const getPosts = category => {
    let categoryString = category || "";
    if (categoryString) {
      categoryString = categoryString.replace(" ", "");
      categoryString = `category/${categoryString}`;
      console.log(categoryString);
    }

    fetch(`/api/posts/${categoryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success in getting posts:", data);
        posts = data;

        if (!posts.length) {
          displayEmpty();
        } else {
          initializeRows();
        }
      });
    // .catch(error => console.error("Error:", error));
  };

  // Function to make DELETE request for a post
  const deletePost = id => {
    console.log("deleting post");
    fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(() => getPosts(postCategorySelect.value));
  };

  // Getting initial list of posts
  getPosts();

  // Function to help construct the post HTML content inside exerContainer
  const initializeRows = () => {
    exerContainer.innerHTML = "";
    const postsToAdd = [];

    posts.forEach(post => postsToAdd.push(createNewRow(post)));
    postsToAdd.forEach(post => exerContainer.prepend(post));
  };

  const createNewRow = post => {
    // Postcard div
    const newPostCard = document.createElement("div");
    newPostCard.classList.add("card");

    // Heading
    const newPostCardHeading = document.createElement("div");
    newPostCardHeading.classList.add("card-header");

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.classList.add("delete", "btn", "btn-danger");
    deleteBtn.addEventListener("click", handlePostDelete);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "EDIT";
    editBtn.classList.add("delete", "btn", "btn-primary");
    editBtn.addEventListener("click", handlePostEdit);

    // New post info
    const newPostTitle = document.createElement("h5");
    const newPostDate = document.createElement("small");
    // const newPostName = document.createElement("p");

    // New post category
    const newPostCategory = document.createElement("h5");
    newPostCategory.textContent = post.category;
    newPostCategory.style.float = "right";
    newPostCategory.style.fontWeight = "700";
    newPostCategory.style.marginTop = "-15px";

    // New post card body
    const newPostCardBody = document.createElement("div");
    // newPostCardBody.classList.add("card-body");

    // New Post
    const newPostBody = document.createElement("p");
    newPostTitle.textContent = post.exercise_name;
    newPostTitle.setAttribute("data-id", post.id);
    newPostBody.textContent = post.description;
    newPostBody.style.marginLeft = "15px";
    // newPostBody
    // newPostDate.textContent = post.exercise_name;
    const formattedDate = new Date(post.createdAt).toLocaleDateString();
    newPostDate.textContent = formattedDate;

    newPostCardHeading.appendChild(newPostDate);
    newPostCardHeading.appendChild(deleteBtn);
    // newPostCardHeading.appendChild(editBtn);
    newPostCardHeading.appendChild(newPostTitle);
    // newPostCardHeading.appendChild(newPostCategory);
    newPostCardBody.appendChild(newPostBody);
    newPostCard.appendChild(newPostCardHeading);
    newPostCard.appendChild(newPostCardBody);
    newPostCard.setAttribute("data-post", JSON.stringify(post));

    return newPostCard;
  };

  const handlePostDelete = e => {
    const currentPost = JSON.parse(
      e.target.parentElement.parentElement.dataset.post
    );
    console.log("handlePostDelete -> currentPost", currentPost);
    deletePost(currentPost.id);
  };

  const handlePostEdit = e => {
    const currentPost = JSON.parse(
      e.target.parentElement.parentElement.dataset.post
    );
    console.log("handlePostEdit -> currentPost", currentPost);
    window.location.href = `/cms?post_id=${currentPost.id}`;
  };

  const displayEmpty = () => {
    exerContainer.innerHTML = "";
    const messageH2 = document.createElement("h4");
    messageH2.style.textAlign = "center";
    messageH2.style.marginTop = "25px";
    messageH2.innerHTML =
      "No exercises yet for this category. <br>Use this page form to make a new exercise.";
    exerContainer.appendChild(messageH2);
  };

  const handleCategoryChange = e => {
    const newPostCategory = e.target.value;
    console.log("handleCategoryChange -> newPostCategory", newPostCategory);
    getPosts(newPostCategory.toLowerCase());
  };
  postCategorySelect.addEventListener("change", handleCategoryChange);
});
