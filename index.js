/*
* Name: Michael David Bradley
* Date: November 1 2018
* Section: CSE 154 AC
*
* This is the index.js javascript file for this website. It uses the API https://swapi.co/ to
* present information about selected Star Wars starships.
*/

(function() {
  "use strict";

  const BASE_URL = "https://swapi.co/api/starships/"; // the default URL for the API fetch request
  let starships = []; // an array to contain all starships from the API

  window.addEventListener("load", initialize);

  /**
   * Initializes the site by calling a function to get the data needed from https://swapi.co/
   */
  function initialize() {
    populateData(BASE_URL);
  }

  /**
   * Uses the given url to do AJAX processing and works on creating the options for the select tag.
   * Once the API's url=null (on the last page of the API), then it fully generates the select tag
   * with all necessary starships. It also enables the select tag so it can be interacted with
   * @param {string} url - the URL to fetch data from
   */
  function populateData(url) {
    if (url !== null) {
      fetch(url, {mode: 'cors'})
        .then (checkStatus)
        .then(JSON.parse)
        .then(processData)
        .catch(handleError);
    } else {
      populateList();
      $("select-input").addEventListener("click", updateFeed);
      $("select-input").disabled = false;
    }
  }

  /**
   * Combs through the data taken from the API and places all of the Starships into an array, called
   * Starships. After getting the ships from the current page, it calls populateData with the next
   * url found on each page of the API
   * @param {object} response - the response from the AJAX process-chain
   */
  function processData(response) {
    for (let i = 0; i < response.results.length; i++) {
      starships.push(response.results[i]);
    }
    populateData(response.next);
  }

  /**
   * Uses the starships array to fully populate the select tag with all available starships from
   * the API.
   */
  function populateList() {
    for (let i = 0; i < starships.length; i++) {
      let current = document.createElement("option");
      current.appendChild(document.createTextNode(starships[i].name));
      current.setAttribute("value", i + 1);
      document.querySelector("select").appendChild(current);
    }
  }

  /**
   * Every time the select tag is clicked, this function will update the website with all relevant
   * information relating to the currently-selected option.
   */
  function updateFeed() {
    let index = document.getElementById("select-input").selectedIndex;
    let ship = starships[index - 1]; // -1 to account for the first slot being "Select Input"

    if (index !== 0) {
      $("name").innerText = ship.name;
      $("model").innerText = ship.model;
      $("maker").innerText = ship.manufacturer;

      $("cost").innerText = "Manufacturing Cost: " + ship.cost_in_credits + " Credits";
      $("crew").innerText = "Crew: " + ship.crew;
      $("passengers").innerText = "Passengers: " + ship.passengers;
      $("length").innerText = "Length: " + ship.length + " Imperial-Standard Meters";
      $("mglt").innerText = ship.MGLT + " Megalights/hour ";
      $("cargo-cap").innerText = "Cargo Capacity: " + ship.cargo_capacity +
                                 " Imperial-Standard Kilograms";
      $("starship-display").classList.remove("hidden");
    }
  }

  /**
   * Displays in a specially-designated area any errors that may occur.
   * @param {string} error - the error taken from the AJAX process-chain
   */
  function handleError(error) {
    let e = document.createElement("p");
    e.appendChild(document.createTextNode("There was an error - continue with your operations and" +
    " an Imperial Engineer will be along shortly.\nShow them the following error: " + error));
    // should the error be displayed?
    document.$("error").appendChild(e);
  }

  /**
   * Helper Function: Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @returns {object} DOM object associated with id.
   */
  function $(id) {
    return document.getElementById(id);
  }

 /**
  * Helper function to return the response's result text if successful, otherwise
  * returns the rejected Promise result with an error status and corresponding text
  * TAKEN FROM IN-CLASS DOCUMENTATION
  * @param {object} response - response to check for success/error
  * @return {object} - valid result text if response was successful, otherwise rejected
  *                    Promise result
  */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      return response.text().then(Promise.reject.bind(Promise));
    }
  }
})();