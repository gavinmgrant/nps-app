'use strict';

const apiKey = '5NETpozFNmjxEUQauqQdfKSWanaEIihj3pJjYseu'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  
  if (responseJson.total == 0) {
    $('#error').removeClass('hidden');
    $('#results').addClass('hidden');
    } else {
    for (let i = 0; i < responseJson.data.length; i++){
        $('#results-list').append(
            `<li><h3>${responseJson.data[i].fullName}</h3>
            <p>${responseJson.data[i].description}</p>
            <p>Visit this park\'s website: <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a></p>
            <p>${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>
            </li>`
          )}; 
        $('#results').removeClass('hidden');
        $('#error').addClass('hidden');
    }
};

function getParks(query, maxResults=10) {
    const params = {
      stateCode: query,
      limit: maxResults,
      api_key: apiKey,
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString
    console.log(url);
  
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
  }

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchState = $('#js-search-state').val();
      const maxResults = $('#js-max-results').val();
      getParks(searchState, maxResults);
    });
  }
  
  $(watchForm);