'use strict';

const weatherForm = document.querySelector('form');
const searchCamp = document.querySelector('input');
const successResponse = document.querySelector('#success-response');
const errorResponse = document.querySelector('#error-response');

weatherForm.addEventListener('submit', (e) => {
    //prevent refresh page
    e.preventDefault();

    successResponse.textContent = '';
    errorResponse.textContent = '';

    let userInput = searchCamp.value;

    if(!userInput){
        userInput = 'default';
    }

    fetch(`/weather?location=${userInput}`).then((res) => {
        res.json().then((data) => {
            if(!data.dataString){
                errorResponse.textContent = 'error: ' + data.error;
                return;
            }
            successResponse.textContent = data.dataString;
        });
    })
});