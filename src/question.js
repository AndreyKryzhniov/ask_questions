export class Question {
    static create(question) {
        return fetch('https://question-4e1dc.firebaseio.com/question.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                question.id = response.name;
                return question
            })
            .then(addToLocalStorage)
            .then(Question.renderList)
    }

    static fetch(token) {
        if (!token) {
            return Promise.resolve(`<p class="error">У вас нет токена</p>`)
        }
        return fetch(`https://question-4e1dc.firebaseio.com/question.json?auth=${token}`)
            .then(response => response.json())
            .then(response => {
                if (response && response.error) {
                    return `<p class="error">${response.error}</p>>`
                }
                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })) : []
            })
    }

    static renderList() {
        const questions = getQuestionFromLocalStorage();
        const html = questions.length
            ? questions.map(toCard).join('')
            : `<div class="mui--text-black-54">Вы пока ничего не спрашивали</div>`;
        const list = document.getElementById('list');
        list.innerHTML = html
    }

    static listToHTML(questions) {
        return questions.length
            ? `<ol>${questions.map(question => {
                return `<li>${toCard(question)}</li>`
            }).join(' ')}</ol>`
            : `<h2>Пока нет вопросов</h2>`
    }
}

function addToLocalStorage(question) {
    const arrayQuestion = getQuestionFromLocalStorage();
    arrayQuestion.push(question);
    localStorage.setItem('questions', JSON.stringify(arrayQuestion))
}

export function getQuestionFromLocalStorage() {
    return JSON.parse(localStorage.getItem('questions') || '[]')
}

function toCard(question) {
    return (
        `<div class="mui--text-headline">
            ${new Date(question.date).toLocaleDateString()}
            ${new Date(question.date).toLocaleTimeString()}
        </div>
        <div>${question.text}</div>
        <br>`
    )
}