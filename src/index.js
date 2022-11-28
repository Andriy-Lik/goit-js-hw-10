import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';


const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
    const nameCountries = refs.searchBox.value.trim();
    if (nameCountries === '') {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return;
    }

    fetchCountries(nameCountries)
    .then(countries => {
        if (countries.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.');
            refs.countryInfo.innerHTML = '';
            refs.countryList.innerHTML = '';
            return;
        }

        if (countries.length > 1 && countries.length < 11) {
            const listMarkup = countries.map(country => countryListTemplate(country));
            refs.countryInfo.innerHTML = '';
            refs.countryList.innerHTML = listMarkup.join('');
        }
        
        if (countries.length === 1) {
            const cardMarkup = countries.map(country => countryCardTemplate(country));
            refs.countryInfo.innerHTML = cardMarkup.join('');
            refs.countryList.innerHTML = '';
        }
    })
    .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        return error;
    })
}

function countryListTemplate ({ flags, name }) {
    return `
    <li class="country-list__item">
        <img class="country-list__flags" src="${flags.svg}" alt="${name.official}" width="25" />
        <h2 class="country-list__name">${name.official}</h2>
    </li>
    `;
}

function countryCardTemplate ({ flags, name, capital, population, languages }) {
    return `
    <div class="country-info__container">
        <div class="country-info__wrapper">
            <img class="country-info__flags" src="${flags.svg}" alt="${name.official}" width="50" />
            <h2 class="country-info__name">${name.official}</h2>
        </div>
        <p class="country-info__capital"><span class="country-info__weight">Capital:</span> ${capital}</p>
        <p class="country-info__population"><span class="country-info__weight">Population:</span> ${population}</p>
        <p class="country-info__languages"><span class="country-info__weight">Languages:</span> ${Object.values(languages)}</p>
    </div>
  `;
}
