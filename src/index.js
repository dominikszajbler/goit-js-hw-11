import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const lightbox = new SimpleLightbox('.gallery a', {
//   captionSelector: 'title',
  close: true,
  nav: true,
  escKey: true,
  captionSelector: 'img',
  captionsData: 'alt',
  captionDelay: 250,
});

const url = 'https://pixabay.com/api/';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const searchButton = document.querySelector('button[type="submit"]');
const loadingButton = document.querySelector('.load-more');
const input = document.querySelector("input[name='searchQuery']");
const perPage = 40;
let currentPage = 1;
// let totalPages = 0;

const dataFromApi = {
  key: '35144361-9ec03ce098d095dbb4bda03de', // twój unikalny klucz dostępu do API - dostepny po zarejestrowaniu sie
  image_type: 'photo', // typ obrazka.Chcemy tylko zdjęć, dlatego określ wartość photo.
  orientation: 'horizontal', // orientacja zdjęcia. Określ wartość horizontal.
  safesearch: 'true', // weryfikacja wieku. Określ wartość true.
  lang: 'en', // en jako wartosc default, nie trzeba pisac. jezyk wyszukiwania
  per_page: 40, // Determine the number of results per page. Accepted values: 3 - 200 Default: 20
};
const { key, image_type, orientation, safesearch, lang, per_page } =
  dataFromApi;

loadingButton.classList.add('hidden');

async function fetchImages() {
  const searchTerm = input.value.trim();
  const urlApi = `https://pixabay.com/api/?key=${key}&q=${searchTerm}&image_type=${image_type}&orientation=${orientation}&safe_search=${safesearch}&lang=${lang}&per_page=${per_page}&page=${currentPage}`;
  try {
    const response = await axios.get(urlApi);
    console.log(response);
    const images = response.data.hits;
    console.log(images);

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    
    if (images.length < dataFromApi.per_page) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
         loadingButton.classList.add('hidden');
    }
   

    gallery.insertAdjacentHTML(
      'beforeend',
      images
        .map(
          el => `<div class="photo-card">
         <img src="${el.webformatURL} alt="${el.tags}" loading="lazy"/> 
         <div class="info">
         <p class="info-item">
         <b>Likes: ${el.likes}</b></p>
         <p class="info-item">
         <b>Views: ${el.views}</b></p>
         <p class="info-item">
         <b>Comments: ${el.comments}</b></p>
        <p class="info-item">
         <b>Downloads: ${el.downloads}</b></p></div></div>`
        )
        .join('') 
    );
    
    
    // lightbox.refresh();
    loadingButton.classList.remove('hidden');
    
    currentPage += 1;
              Notiflix.Notify.info(
                `Hooray! We found ${response.data.totalHits} images.`
              );

  }
  catch (error) {
    console.error(error);
  }
}

loadingButton.addEventListener('click', fetchImages);
form.addEventListener('submit', function (event) {
  event.preventDefault();
  currentPage = 1;
  gallery.innerHTML = '';
  fetchImages();
});