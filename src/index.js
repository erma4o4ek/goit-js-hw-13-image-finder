import galleryTpl from './templates/image.hbs';
import './css/style.css';
import NewsApiService from './js/apiService';
import LoadMoreBtn from './js/loadmore';



// import { inform, error } from '@pnotify/core';
// import '@pnotify/core/dist/PNotify.css';
// import '@pnotify/core/dist/BrightTheme.css';


const refs = {
  searchForm: document.querySelector('.search-form'),
  cardsContainer: document.querySelector('.gallery'),
};
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearchQuery);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearchQuery(event) {
  event.preventDefault();

  newsApiService.query = event.currentTarget.elements.query.value;

  if (newsApiService.query === '') {
    return inform({
      text: 'Enter the value!',
      delay: 1500,
      closerHover: true,
    });
  }

  loadMoreBtn.show();
  newsApiService.resetPage();
  clearCardsContainer();
  fetchImgs();
}

function fetchImgs() {
  loadMoreBtn.disable();
  return newsApiService.fetchImgs().then(images => {
    appendCardsMarkup(images);
    loadMoreBtn.enable();
    if (images.length === 0) {
      loadMoreBtn.hide();
      error({
        text: 'No matches found!',
        delay: 1500,
        closerHover: true,
      });
    }
  });
}

function appendCardsMarkup(images) {
  refs.cardsContainer.insertAdjacentHTML('beforeend', galleryTpl(images));
}

function clearCardsContainer() {
  refs.cardsContainer.innerHTML = '';
}


function onLoadMore() {
  fetchImgs()
    .then(
      setTimeout(() => {
        window.scrollBy({
          top: document.documentElement.clientHeight - 100,
          behavior: 'smooth',
        });
      }, 1500),
    )
    .catch(err => console.log(err));
}


