import {createModal, isValid} from "./utils";
import {getQuestionFromLocalStorage, Question} from "./question";
import {getAuthForm} from "./auth";
import './style.css';


const form = document.getElementById('form');
const modalBtn = document.getElementById('modal-btn');
const submitBtn = form.querySelector('#submit');
const input = form.querySelector('#question-input');

window.addEventListener('load', Question.renderList);
form.addEventListener('submit', submitFormHandler);
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value);
});

getQuestionFromLocalStorage();

function submitFormHandler(event) {
    event.preventDefault();
    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        };
        submitBtn.disabled = true;
        //Async request to server to save question
        Question.create(question).then(() => {
            input.value = '';
            input.className = '';
            submitBtn.disabled = false;

        })
    }
}

function openModal() {
    createModal('Авторизация', getAuthForm());
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
    event.preventDefault();

    const email = event.target.querySelector('#email').value;
    const password = event.target.querySelector('#password').value;

    console.log(email, password)
}