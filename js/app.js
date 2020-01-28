const $refreshButton = document.getElementById('refresh-button');
const $reposContainer = document.getElementById('repos-container');

let colors = null;

fetchLanguageColors().then(reload);

$refreshButton.addEventListener('click', reload);

async function fetchLanguageColors() {
    colors = await (await fetch('/json/colors.json')).json();
}

async function reload() {
    $reposContainer.innerHTML = '';

    const repos = await fetchHotRepos();

    for (const repo of repos) {
        renderRepo(repo);
    }
}

function renderRepo(repo) {
    const repoHTML = generateRepoHTML(repo);

    $reposContainer.innerHTML += repoHTML;
}

function generateRepoHTML(repo) {
    return `
<a href="${repo.html_url}" class="github-card" target="_blank">
    <h3>${repo.name}</h3>
    <p>${repo.description || 'No description'}</p>

    <div>
        <span class="github-card__meta">
            <span style="color: ${colors[repo.language] || 'gray'};">● </span>
            ${repo.language || 'Unknown'}
        </span>
        
        <span class="github-card__meta">
            <i class="fa fa-star" aria-hidden="true"></i>
            <span>${repo.stargazers_count}</span>
        </span>
        
        <span class="github-card__meta">
            <i class="fas fa-code-branch" aria-hidden="true"></i>
            <span>${repo.forks_count}</span>
        </span>
    </div>
</a>`;
}

async function fetchHotRepos() {
    const creationDate = new Date();
    creationDate.setDate(creationDate.getDate() - 7);

    return (await (await fetch(`https://api.github.com/search/repositories?q=created:>=${creationDate.toISOString().split('.')[0]}&sort=stars&order=desc&per_page=10`)).json()).items;
}