import axios from 'axios';
import { Notify } from 'notiflix';
import throttle from 'lodash.throttle';


const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '30065475-777006d9dcbf1a88245494e6c';
let pageNumber = 1;
// let searchQuery = '';

const form = document.querySelector('.search-form');
const input = document.querySelector('input[name="searchQuery"]');
const searchBtn = document.querySelector('.search-form button');
const gallery = document.querySelector('.gallery');

searchBtn.disabled = true;
Notify.init({
    position: 'center-top',
    distance: '100px',
    showOnlyTheLastOne: true,
})

form.addEventListener('input', throttle(onInput, 250));

form.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', throttle(checkPosition, 250));
window.addEventListener('resize', throttle(checkPosition, 250));


async function onFormSubmit (event) {
    await event.preventDefault();
    gallery.innerHTML = '';
    await getResultObject(input.value, 1);
    // console.log(this.data.hits.length);

}

function onInput() {
    if (input.value == false) {
        searchBtn.disabled = true;
    } else {
        searchBtn.disabled = false;
    }   
}



async function getResultObject(searchQuery, pageNumber) {
    try {
      const response = await axios.get(`${BASE_URL}/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`);
      const queryResult = await response.data.hits;

      const galleryMarkup = queryResult.map((pic) =>
          `<div class="photo-card">
    <div class="img-wrap"><img src="${pic.webformatURL}" alt="${pic.tags}" loading="lazy" /></div>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <span>${pic.likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b>
       <span>${pic.views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <span>${pic.comments}</span>
      </p>
      <p class="info-item">
      <b>Downloads</b>
      <span>${pic.downloads}</span>
    </p>
  </div>
</div>`).join('');
        
    if (response.data.totalHits === 0) {
        gallery.innerHTML = '';
        notifyQueryError();
    } else {
    gallery.insertAdjacentHTML('beforeend', galleryMarkup);
    }
  
    } catch (error) {      
    console.error(error);
  }
}


function notifyQueryError() {
    
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}



async function checkPosition() {
    const height = document.body.offsetHeight;
    const screenHeight = window.innerHeight;
    const scrolled = window.scrollY;
    const threshold = height - screenHeight;
    const position = scrolled + screenHeight;

    if (position >= threshold && input.value !== '') {
      pageNumber += 1;
      await getResultObject(input.value, pageNumber)
    } 
}

