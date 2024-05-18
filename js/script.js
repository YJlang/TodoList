document.getElementById('add-todo').addEventListener('click', function() {
    addTodoItem();
});

document.getElementById('apply-checkbox').addEventListener('change', function() {
    applyCheckBox();
});

function addTodoItem(todoText = null) {
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const text = todoText || todoInput.value.trim();

    if (text !== '') {
        const li = document.createElement('li');
        li.textContent = text;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'remove';
        removeButton.addEventListener('click', function () {
            li.remove();
            saveTodosToCookie();
        });

        li.appendChild(removeButton);
        todoList.appendChild(li);

        if (!todoText) {
            todoInput.value = '';
            saveTodosToCookie();
        }
    }
}

function saveTodosToCookie() {
    const todos = [];
    const todoListItems = document.getElementById('todo-list').children;

    for (const item of todoListItems) {
        todos.push(item.childNodes[0].nodeValue.trim());
    }

    setCookie("todoList", JSON.stringify(todos), 1);
}

function loadTodosFromCookie() {
    const todos = getCookie("todoList");

    if (todos) {
        const parsedTodos = JSON.parse(todos);
        for (const todo of parsedTodos) {
            addTodoItem(todo);
        }
    }
}

function setCookie(name, value, expiredays) {
    const date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; expires=" + date.toUTCString() + "; path=/";
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (decodeURIComponent(cookieName) === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

function applyCheckBox() {
    const applyCheckbox = document.getElementById('apply-checkbox');
    if (applyCheckbox.checked) {
        saveTodosToCookie();
        setCookie("applyYN", "Y", 1);
    } else {
        setCookie("applyYN", "N", 1);
        setCookie("todoList", "", -1); // Remove the cookie
    }
}

function initializeTodos() {
    const applyYN = getCookie("applyYN");
    const applyCheckbox = document.getElementById('apply-checkbox');
    applyCheckbox.checked = (applyYN === "Y");

    if (applyCheckbox.checked) {
        loadTodosFromCookie();
    }
}

initializeTodos();