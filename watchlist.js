import dotenv from './node_modules/dotenv'
dotenv.config()

const apiKey = process.env.API_KEY

let moviesArrFromLocalStorage = JSON.parse(localStorage.getItem("movies"))

const watchlistEl = document.getElementById("watchlist")
document.addEventListener("click" , function(e){
    if(e.target.dataset.remove){
        removeMovieFromWatchlist(e.target.dataset.remove)
    }
})

function removeMovieFromWatchlist(removeId){
   moviesArrFromLocalStorage = moviesArrFromLocalStorage.filter(item => item !== removeId)
   localStorage.setItem("movies",JSON.stringify(moviesArrFromLocalStorage))
   renderWatchlist()
} 

function getWatchlistHtml(){
    if(moviesArrFromLocalStorage.length > 0){
        const promises = moviesArrFromLocalStorage.map(imdbID => {
        return fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}&type=movie`)
            .then(res => res.json())
            .then(data => {
                return `
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
                                <i class="fa-solid fa-circle-minus" data-remove = ${imdbID} ></i>
                                <p class="watchlist-text">Remove</p>
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
}



function renderWatchlist() {
    if (moviesArrFromLocalStorage.length > 0) {
        getWatchlistHtml()
        .then(html => watchlistEl.innerHTML =html.join(""))
    } else {
        watchlistEl.innerHTML = `
        <div class="placeholder">
            <h2>Your watchlist is looking a little empty...</h2>
            <div class="watchlist-placeholder">
                <a href="index.html"><i  class="fa-solid fa-circle-plus"></i></a>
                <p class="watchlist-placeholder-text">Let’s add some movies!</p>
            </div>
        </div>
        `
    }
}

renderWatchlist()
