const REPO_DIV_COLORS = ['#43cc9e', '#22b5ba'];
let repoDivColorsIndex = 0;

function displayUser(user) {
    const listItem = document.createElement('li');
    const clickableProfile = document.createElement('button');
    clickableProfile.setAttribute('class', 'profile-btn');
    clickableProfile.innerHTML =
        `
        <figure class="user-figure">
        <img src="${user.avatar_url}" alt="Avatar of ${user.login}" class="user-avatar"/>
        <figcaption class="user-caption"><a href=${user.html_url} class="login">${user.login}</a></figcaption>
        </figure>
        `;
    setBackgroundColor(clickableProfile, 'pink');
    clickableProfile.style.width = '150px';
    clickableProfile.style.height = '150px';
    clickableProfile.addEventListener('click', (event) => {
       let login = event.target.querySelector('.user-figure')
       .querySelector('.user-caption')
       .querySelector('.login')
       .textContent;
       console.log(login);
       console.log(userReposEndpoint(login));
    });
    listItem.appendChild(clickableProfile);
    document.querySelector('#user-list').appendChild(listItem);
}

// Returns all the users with a given username
// Displays all the returned users
function userSearchEndpoint(username) {
    return fetch(`https://api.github.com/search/users?q=${username}`)
            .then((response) => response.json())
            .then((data) => {
                clearChildrenById('user-list');
                //clearChildrenById('repos-list');
                for (const user of data.items) {
                    displayUser(user);
                }
                const userList = document.querySelector('#user-list');
                if (data.items.length > 0) {
                    if (userList.style.display === 'none') {
                        userList.style.display = 'flex';
                    }
                } else {
                    userList.style.display = 'none';
                }
            });
}

function displayRepository(repo, divColor) {
    const listItem = document.createElement('li');
    listItem.setAttribute('class', 'repo');
    listItem.innerHTML =
        `<b>Short Name</b>   -   ${repo.name}<br/>
        <b>Full Name</b>    -   ${repo.full_name}<br/>
        <b>Link</b>         -   <a href="${repo.clone_url}" target="_blank">${repo.clone_url}</a><br/>
        <b>Description</b>  -   ${repo.description}<br/>
        <b>Date Created</b> -   ${repo.created_at}<br/>`
    listItem.style.backgroundColor = divColor;
    for (const boldedHeader of Array.from(listItem.getElementsByTagName('b'))) {
        boldedHeader.style.backgroundColor = divColor;
    }
    listItem.getElementsByTagName('a')[0].style.backgroundColor = divColor;
    document.querySelector('#repos-list').appendChild(listItem);
}

function userReposEndpoint(username) {
    return fetch(`https://api.github.com/users/${username}/repos`, {
        method: "GET",
        headers: {
            Accept: 'application/vnd.github.v3+json'
        }
    })
    .then((response) => response.json())
    .then((data) => {
        //console.log(data);
        //console.log(data.items);
        clearChildrenById('repos-list');
        const reposList = document.querySelector('#repos-list');
        for (const repo of data) {
            console.log(repo);
            displayRepository(repo, REPO_DIV_COLORS[repoDivColorsIndex]);
            repoDivColorsIndex = (repoDivColorsIndex + 1) % REPO_DIV_COLORS.length;
        }
        if (data.length > 0) {
            if (reposList.style.display === 'none') {
                reposList.style.display = 'flex';
            }
        } else {
            reposList.style.display = 'none';
        }
    });
}

// Clears the current contents from the lists
function clearChildrenById(elementId) {
    const node = document.getElementById(elementId);
    node.innerHTML = "";
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#user-list').style.display = 'none';
    document.querySelector('#repos-list').style.display = 'none';
    // Get Users
    document.querySelector('#github-form').addEventListener('submit', (event) => {
        event.preventDefault();
        console.log(userSearchEndpoint(event.target.search.value));
    });

});

/*
 * HELPER METHODS
 */

// Styles the background color of a given node and all its descendants.
function setBackgroundColor(node, color) {
    node.style.backgroundColor = color;
    const children = Array.from(node.children);
    for (const child of children) {
        if (child.hasChildNodes()) {
            setBackgroundColor(child, color);
        } else {
            child.style.backgroundColor = color;
        }
    }
}