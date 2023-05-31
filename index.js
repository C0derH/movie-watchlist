import API_KEY from "./config.js"
const movieListEl = document.getElementById("movie-list")



document.addEventListener("click",function(e){
    if(e.target.id ==="search-btn"){
        handleSearchBtnClick()
    }else if(e.target.dataset.imdbId){
        saveMovieToLocalStorage(e.target.dataset.imdbId)
    }
})

function saveMovieToLocalStorage(imdbId){
    const moviesArrFromLocalStorage = JSON.parse(localStorage.getItem("movies"))
        if(!moviesArrFromLocalStorage){
            const moviesArr = []
            moviesArr.push(imdbId)
            localStorage.setItem("movies",JSON.stringify(moviesArr))

        }else if (!moviesArrFromLocalStorage.includes(imdbId)){
            moviesArrFromLocalStorage.push(imdbId)
            localStorage.setItem("movies",JSON.stringify(moviesArrFromLocalStorage))
        }
    
}

function handleSearchBtnClick(){
    const searchBarValue = document.getElementById("search-bar-el").value
    if(searchBarValue){
        fetch(`http://www.omdbapi.com/?s=${searchBarValue}&apikey=${API_KEY}&type=movie`)
            .then(res => res.json())
            .then(data => {
                document.getElementById("search-bar-el").value = ""
                if(data.Search){
                    getMoviesHtml(data.Search)
                        .then(html => renderMovies(html.join("")))
                }else {
                    movieListEl.innerHTML = `
                        <div class="placeholder">
                            <h2>Unable to find what you’re looking for. Please try another search.</h2>
                        </div>
                    `
                }
            })
    }

}

function getMoviesHtml(movies){
    const promises = movies.map((movie) => {
        return fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}&type=movie`)
                .then(res => res.json())
                .then(data => {
                    return   `
                    <div class = "movie">
                        <img class="movie-poster" src="${data.Poster}">
                        <div class="movie-info">
                            <div class="movie-top">
                                <h3 class="movie-title">${data.Title}</h3>
                                <div class="movie-rating">
                                    <i class="fa-solid fa-star fa-sm"></i>
                                    <p class="move-rating-score">${data.imdbRating}</p>
                                </div>
                            </div>
                            <div class="movie-mid">
                                <p class="movie-runtime">${data.Runtime}</p>
                                <p class="movie-genre">${data.Genre}</p>
                                <div class="movie-watchlist-action">
                                    <i class="fa-solid fa-circle-plus" data-imdb-id = "${movie.imdbID}"></i>
                                    <p class="watchlist-text">Watchlist</p>
                                </div>
                            </div>
                            <div>
                                <p class="movie-plot">${data.Plot}</p>
                            </div>
                        </div>
                    </div>
                `
                })
            
    })
    return Promise.all(promises)

}

function renderMovies(moviesHtml){
    movieListEl.innerHTML = moviesHtml
}



