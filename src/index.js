import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const refs = {
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
  searchInput: document.querySelector('#search-box'),
};
const DEBOUNCE_DELAY = 300;

refs.searchInput.addEventListener(
  'input',
  debounce(onSearchInput, DEBOUNCE_DELAY)
);

function onSearchInput(event) {
  const name = event.target.value.trim();
  if (name.length === 0) {
    clearResults();
    return;
  }
  filterCountries(name);
}

function filterCountries(name) {
  fetchCountries(name)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length === 1) {
        showCountryInfo(countries[0]);
      } else if (countries.length >= 2 && countries.length < 10) {
        showCountryList(countries);
      } else {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function clearResults() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}

function showCountryList(countries) {
  clearResults();
  countries.forEach(country => {
    const flagIconUrl = country.flags.svg;
    const listItem = document.createElement('li');
    listItem.classList.add('list-item');
    const listItemContent = `<img width='25px' height='20px' src="${flagIconUrl}" alt='Flag: ${country.name}'>${country.name}`;
    listItem.innerHTML = listItemContent;
    refs.list.appendChild(listItem);
  });
}

function showCountryInfo(country) {
  clearResults();
  const languageNames = country.languages
    .map(language => language.name)
    .join(', ');
  const flagIconUrl = country.flags.svg;
  const countryInfo = `<div class='country-name'><img width='25px' height='20px' src="${flagIconUrl}" alt='Flag: ${country.name}'>
      <h1>${country.name}</h1></div>
      <p><span>Capital:</span> ${country.capital}</p>
      <p><span>Population:</span> ${country.population}</p>
      <p><span>Languages:</span> ${languageNames}</p>
  `;
  refs.info.innerHTML = countryInfo;
}
