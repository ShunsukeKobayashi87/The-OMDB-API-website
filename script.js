let searchButton = document.querySelector("#submit");
let searchTermInput = document.querySelector("#searchTerm");
let searchTerm;
let titleList = document.querySelector(".title-list");
//adding listener to the button that will search for movies and display them 
searchButton.addEventListener("click", function () {
  if (searchTermInput.value !== "") {
    searchTerm = searchTermInput.value;
    console.log(searchTerm);
    searchTerm = searchTerm.replaceAll(" ", "%20");
    //omdb api 
    let url = "https://www.omdbapi.com/?apikey=2381b505&s=" + searchTerm;
    searchTermInput.value = "";
    fetch(url)
      .then(function (result) {
        return result.json();
      })
      .then(function (json) {
        displayResults(json);
      });
  } else {
    alert("input is empty!");
  }
});
//this method will display the movies found, if no movie found, show alert 
function displayResults(json) {
  //remove all movie
  document.querySelectorAll(".movie-title").forEach((e) => e.remove());
  if (json.Response == "False") {
    alert("No movie found :(");
  } else {
    let movies = json.Search;
    movies.forEach((movie) => {
      const item = document.createElement("button");
      item.textContent = `${movie.Title}(${movie.Year})`;
      item.classList.add("movie-title");
      item.addEventListener("click", function () {
        console.log(movie.imdbID);
        getDetails(movie.imdbID);
      });
      titleList.appendChild(item);
    });
  }
}
//this method will get the details and poster image
function getDetails(imdb) {
  let url = "https://www.omdbapi.com/?apikey=2381b505&i=" + imdb;
  let id = imdb;
  fetch(url)
    .then(function (result) {
      return result.json();
    })
    .then(function (json) {
      //defining containers that will hold details element
      const titleContainer = document.querySelector(".title-container");
      const yearContainer = document.querySelector(".year-container");
      const imdbIDContainer = document.querySelector(".imdbID-container");
      const plotContainer = document.querySelector(".plot-container");
      //remove all the elelments every time new movie is clicked
      while (titleContainer.firstChild) {
        titleContainer.removeChild(titleContainer.firstChild);
      }
      while (yearContainer.firstChild) {
        yearContainer.removeChild(yearContainer.firstChild);
      }
      while (imdbIDContainer.firstChild) {
        imdbIDContainer.removeChild(imdbIDContainer.firstChild);
      }
      while (plotContainer.firstChild) {
        plotContainer.removeChild(plotContainer.firstChild);
      }
      // labels and actual content
      const title = document.createElement("span");
      const titleLabel = document.createElement("span");
      const yearLabel = document.createElement("span");
      const year = document.createElement("span");
      const imdbIDLabel = document.createElement("span");
      const imdbID = document.createElement("span");
      const plotLabel = document.createElement("button");
      const plot = document.createElement("p");
      titleLabel.textContent = "Title : ";
      yearLabel.textContent = "Year : ";
      imdbIDLabel.textContent = "imdbID : ";
      plotLabel.textContent = "Plot : ";
     
      titleContainer.appendChild(titleLabel);
      yearContainer.appendChild(yearLabel);
      imdbIDContainer.appendChild(imdbIDLabel);
      plotContainer.appendChild(plotLabel);
      title.textContent = json.Title;
      year.textContent = json.Year;
      imdbID.textContent = id;
      plot.textContent = json.Plot;
      let flag = true;
      //translate api switch en to ja, ja to en
      plotLabel.addEventListener("click",function(){
        let myUrl;
        
        if(flag){
           myUrl = 
          `https://script.google.com/macros/s/AKfycbzZtvOvf14TaMdRIYzocRcf3mktzGgXvlFvyczo/exec?text=${plot.textContent}&source=en&target=ja`;
          flag=false;
        }else{
          myUrl = `https://script.google.com/macros/s/AKfycbzZtvOvf14TaMdRIYzocRcf3mktzGgXvlFvyczo/exec?text=${plot.textContent}&source=ja&target=en`;
          flag=true;
        }

        fetch(myUrl).then(function(result){
          return result.json();
        }).then(function(jsonTranslate){
          plot.textContent = jsonTranslate.text;
          console.log(jsonTranslate.text);
        })
      });
      // add details to  container
      titleContainer.appendChild(title);
      yearContainer.appendChild(year);
      imdbIDContainer.appendChild(imdbID);
      plotContainer.appendChild(plot);
      
      //set default image in case there is no poster found
      let posterImage = document.querySelector(".poster-image");
      console.log(json);
      if (json.Poster != "N/A") {
        posterImage.setAttribute("src", json.Poster);
      }else{
          posterImage.setAttribute("src","images/noImage.png");
      }
      console.log(json.Poster);
    });

  
}
