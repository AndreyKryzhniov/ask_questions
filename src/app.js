import {createModal, isValid} from "./utils";
import {getQuestionFromLocalStorage, Question} from "./question";
import {authWithEmailAndPassword, getAuthForm} from "./auth";
import './style.css';

const form = document.getElementById('form');
const modalBtn = document.getElementById('modal-btn');
const submitBtn = form.querySelector('#submit');
const input = form.querySelector('#question-input');

window.addEventListener('load', Question.renderList);
form.addEventListener('submit', submitFormHandler);
modalBtn.addEventListener('click', openModal);
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

    const btn = event.target.querySelector('button');
    const email = event.target.querySelector('#email').value;
    const password = event.target.querySelector('#password').value;

    btn.disabled = true;
    authWithEmailAndPassword(email, password)
        .then(Question.fetch)
        .then(renderModalAuth)
        .finally(() => btn.disabled = false)
}

function renderModalAuth(content) {
    if (typeof content === 'string') {
        createModal('Ошибка', content)
    } else {
        createModal('Список всех вопросов', Question.listToHTML(content))
    }
}