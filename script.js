// Função para carregar os links do arquivo JSON e gerar os botões
fetch('links.json')
    .then(response => response.json())
    .then(data => {
        const buttonContainer = document.getElementById('button-container');
        
        // Gerar os botões dinamicamente
        data.links.forEach(link => {
            const button = document.createElement('a');
            button.href = link.url;
            button.classList.add('button');
            button.textContent = link.text;
            buttonContainer.appendChild(button);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo de links:', error);
    });

// Função para carregar e salvar To-Do List
function loadTodoList() {
    const savedTasks = JSON.parse(localStorage.getItem('todoList')) || [];
    const taskList = document.getElementById('task-list');

    savedTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <button class="remove-task">Remover</button>
        `;
        if (task.completed) {
            li.classList.add('completed');
        }

        taskList.appendChild(li);

        // Marcar tarefa como concluída
        li.querySelector('.task-text').addEventListener('click', function() {
            li.classList.toggle('completed');
            saveTodoList();
        });

        // Remover tarefa
        li.querySelector('.remove-task').addEventListener('click', function() {
            taskList.removeChild(li);
            saveTodoList();
        });
    });
}

function saveTodoList() {
    const taskList = document.getElementById('task-list');
    const tasks = [];

    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            completed: li.classList.contains('completed')
        });
    });

    localStorage.setItem('todoList', JSON.stringify(tasks));
}

// Função para adicionar uma nova tarefa
document.getElementById('add-task-btn').addEventListener('click', function() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();

    if (taskText) {
        const taskList = document.getElementById('task-list');

        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text">${taskText}</span>
            <button class="remove-task">Remover</button>
        `;

        taskList.appendChild(li);
        taskInput.value = ''; // Limpa o campo de entrada

        // Marcar tarefa como concluída
        li.querySelector('.task-text').addEventListener('click', function() {
            li.classList.toggle('completed');
            saveTodoList(); // Salvar as alterações
        });

        // Remover tarefa
        li.querySelector('.remove-task').addEventListener('click', function() {
            taskList.removeChild(li);
            saveTodoList(); // Salvar as alterações
        });

        saveTodoList(); // Salvar as alterações
    }
});

// Função para gerar o calendário
function generateCalendar() {
    const calendarElement = document.getElementById('calendar');
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    // Limpar calendário antes de gerar
    calendarElement.innerHTML = '';

    // Adicionar os dias da semana
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        calendarElement.appendChild(dayElement);
    });

    // Adicionar os dias do mês
    for (let i = 0; i < startingDay; i++) {
        const emptyCell = document.createElement('div');
        calendarElement.appendChild(emptyCell);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = i;
        dayCell.classList.add('calendar-day');
        dayCell.addEventListener('click', function() {
            const selectedDate = `${currentYear}-${currentMonth + 1}-${i}`;
            document.getElementById('calendar-note-input').focus();
            document.getElementById('calendar-note-input').setAttribute('data-date', selectedDate);
        });
        calendarElement.appendChild(dayCell);
    }
}

// Função para carregar as anotações do calendário
function loadCalendarNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('calendarNotes')) || [];
    const notesList = document.getElementById('calendar-notes-list');

    savedNotes.forEach(note => {
        const li = document.createElement('li');
        li.innerHTML = `${note.date}: ${note.text} <button class="remove-note">Remover</button>`;
        notesList.appendChild(li);

        // Adicionar funcionalidade para remover anotação
        li.querySelector('.remove-note').addEventListener('click', function() {
            notesList.removeChild(li);
            saveCalendarNotes(); // Atualizar o localStorage
        });
    });
}

// Função para adicionar anotação no calendário
document.getElementById('add-calendar-note-btn').addEventListener('click', function() {
    const noteInput = document.getElementById('calendar-note-input');
    const noteText = noteInput.value.trim();
    const selectedDate = noteInput.getAttribute('data-date');

    if (noteText && selectedDate) {
        const notesList = document.getElementById('calendar-notes-list');
        const noteItem = document.createElement('li');
        noteItem.innerHTML = `${selectedDate}: ${noteText} <button class="remove-note">Remover</button>`;
        notesList.appendChild(noteItem);

        // Salvar as anotações
        saveCalendarNotes();

        // Limpar o campo após adicionar
        noteInput.value = '';
    }
});

// Função para salvar as anotações do calendário
function saveCalendarNotes() {
    const notesList = document.getElementById('calendar-notes-list');
    const notes = [];

    notesList.querySelectorAll('li').forEach(li => {
        const [date, text] = li.textContent.split(': ');
        notes.push({ date, text: text.split(' ')[0] }); // Extrair texto sem o botão
    });

    localStorage.setItem('calendarNotes', JSON.stringify(notes));
}

// Inicializar o calendário
generateCalendar();

// Carregar os dados ao iniciar a página
loadTodoList();
loadCalendarNotes();
