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
        document.getElementById("likesLabel").innerHTML = res.totalLikes;
        document.getElementById("dislikesLabel").innerHTML = res.totalDislikes;
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
        document.getElementById("dislikesLabel").innerHTML = res.totalDislikes;
        document.getElementById("likesLabel").innerHTML = res.totalLikes;
    })     
}

function comment(id){
    let comment = document.getElementById("comment").value;
    console.log(comment)
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
        const response = await res.json()
        console.log("total com--",response)
        let strong = document.createElement("strong")
        let p = document.createElement("p")
        let commentUserText = document.createTextNode(response.name)
        let commentBodyText = document.createTextNode(response.comment.comment)
        console.log(commentUserText)
        console.log(commentBodyText)
        strong.appendChild(commentUserText)
        p.appendChild(commentBodyText)
        strong.appendChild(p)
        document.getElementById("totalComments").innerHTML = response.result.length
        document.getElementById("commentDisplay").appendChild(strong);
        document.getElementById("comment").value = "";
    })
}