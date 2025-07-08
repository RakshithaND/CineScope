const API_KEY = '46dffd2ad542cc271238c4bfeafa3c20';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const SEARCH_API = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

let currentPage = 1;
let currentQuery = '';
let isLoading = false;

// Initial load
getMovies(API_URL, currentPage);

async function getMovies(url, page = 1) {
  isLoading = true;
  const res = await fetch(`${url}&page=${page}`);
  const data = await res.json();

  showMovies(data.results);
  isLoading = false;
}

function showMovies(movies) {
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;

    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `
      <div class="movie">
        <img src="${IMG_PATH + poster_path}" alt="${title}">
        <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassbyRate(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
          <h3>Overview</h3>
          ${overview}
        </div>
      </div>
    `;
    main.appendChild(movieEl);
  });
}

function getClassbyRate(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

// Search movie
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();
  currentQuery = searchTerm;
  currentPage = 1;
  main.innerHTML = '';

  if (searchTerm !== '') {
    getMovies(SEARCH_API + searchTerm, currentPage);
  } else {
    getMovies(API_URL, currentPage);
  }

  search.value = '';
});

// Infinite scroll
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
    !isLoading
  ) {
    currentPage++;

    if (currentQuery) {
      getMovies(SEARCH_API + currentQuery, currentPage);
    } else {
      getMovies(API_URL, currentPage);
    }
  }
});
