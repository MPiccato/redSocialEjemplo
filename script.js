const urlBase = 'https://jsonplaceholder.typicode.com/posts';
let posts = [];

function getData() {
    fetch(urlBase)
        .then(res => res.json())
        .then(data => {
            posts = data
            renderPostList()
        }).catch(error => {
            console.log(error);
        })
}


getData()

function renderPostList() {
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.classList.add('postItem');
        listItem.innerHTML = `

        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})">Editar</button>
        <button onclick="deletePost(${post.id})">Borrar</button>

        <div id="editForm-${post.id}" class="editForm" style="display:none">
            <label for="editTitle">Titulo:</label>
            <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
            <label for="editBody">Comentario:</label>
            <textarea id="editBody-${post.id}" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})">Actualizar</button>
        </div>


        `
        postList.appendChild(listItem);
    })

}

function postData() {
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if (postTitle.trim() == '' || postBody.trim() == '') {
        alert('Los campos son obligatorios')
    }

    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userid: 1

        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(res => res.json())
        .then(data => {
            posts.unshift(data)
            renderPostList()
            postBodyInput.value = ''
            postTitleInput.value = ''

        })
        .catch(error => console.log(error))
}

function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none';
}

function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;
    console.log(editTitle)
    console.log(editBody)

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle,
            body: editBody,
            uderId: 1
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },


    })
        .then(res => res.json())
        .then(data => {
            const index = posts.findIndex(post => post.id === data.id)
            if (index != -1) {
                posts[index] = data
            } else {
                alert('Error al actualizar info')
            }
            renderPostList()
        }).catch(error => console.log(error))

}

function deletePost(id) {
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE',

    })
        .then(res => {
            if (res.ok) {
                posts = posts.filter(post => post.id != id)

                renderPostList()
            } else {
                alert('Hubo un error al eliminar')
            }
        })
        .catch(error => console.log(error))
}
