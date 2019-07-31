function like(id){
    let data = {
        blogId : id
    }
    fetch("/likePost" , {
        method : "POST",
        body : JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(async response => {
        const res = await response.json()
        console.log(res)
        document.getElementById("likes").innerHTML = res.totalLikes;
        document.getElementById("dislikes").innerHTML = res.totalDislikes;
    })     
}

function dislike(id){
    let data = {
        blogId : id
    }
    fetch("/dislikePost" , {
        method : "POST",
        body : JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(async response => {
        const res = await response.json()
        console.log(res)
        document.getElementById("dislikes").innerHTML = res.totalDislikes;
        document.getElementById("likes").innerHTML = res.totalLikes;
    })     
}

function comment(id){
    let comment = document.getElementById("comment").value;
    let data = {
        blogId : id,
        comment : comment
    }
    fetch("/comment" , {
      method : "POST",
      body : JSON.stringify(data),
      headers: {
          "Content-Type": "application/json"
      },
    })
    .then(async res => {
        let response = await res.json();
        let commentUser = document.createElement("h5");
        let commentBody = document.createElement("p")
        let line = document.createElement("hr")
        let commentUserText = document.createTextNode(response.name)
        let commentBodyText = document.createTextNode(response.comment.comment)
        commentUser.appendChild(commentUserText)
        commentBody.appendChild(commentBodyText)
        document.getElementById("commentDisplay").appendChild(commentUser);
        document.getElementById("commentDisplay").appendChild(commentBody);
        document.getElementById("comment").value = "";
    })
}