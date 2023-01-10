class Task {
    constructor(name, id) {
        this.id = id;
        this.name = name;
        this.priority = 'normal';
        this.done = false;
        this.time = Date.now();
    }
}

const { createApp } = Vue;

createApp({
    data() {
        return {
            tasks: this.getAllTasks(),
            taskName: '',
            searchTask: '',
            priorityFilter: ''
        }
    },
    computed: {
        getPendingTasks() {
            return this.tasks.filter(task => task.done == false).length;
        },
        getTotalTasks() {
            return this.tasks.length;
        }
    },
    methods: {
        newTask() {
            newTask = new Task(this.taskName, this.getNewTaskIndex());
            this.taskName = '';
            this.priorityFilter = '';
            this.tasks.push(newTask);
            this.tasks.sort(this.orderTasks);
            this.updateLocalStorage();
        },
        getAllTasks() {
            tasks = localStorage.tasks;
            if (tasks) {
                return JSON.parse(tasks);
            }
            return [];
        },
        getTimeUntilTaskCreation(task) {
            return Math.round((Date.now() - task.time) / 1000 / 60);
        },
        getNewTaskIndex() {
            let id = 0;
            let tasks = this.getAllTasks();
            if (tasks) {
                if (tasks.length !== 0) {
                    id = tasks[tasks.length - 1].id + 1;
                }
            }
            return id;
        },
        getAllTasks() {
            tasks = localStorage.tasks;
            if (tasks) return JSON.parse(tasks);
            return [];
        },
        removeTask(taskToRemove) {
            this.tasks = this.tasks.filter(task => task.id != taskToRemove.id);
            this.updateLocalStorage();
        },
        removeFinishedTasks() {
            this.tasks = this.tasks.filter(task => task.done == false);
            this.updateLocalStorage();
        },
        toggleDone(task) {
            task.done = !task.done;
            this.updateLocalStorage();
        },
        setTaskPriority(task, priority) {
            task.priority = priority;
            this.tasks.sort(this.orderTasks);
            this.updateLocalStorage();
        },
        updateLocalStorage() {
            localStorage.tasks = JSON.stringify(this.tasks);
        },
        searchTasks() {
            tasksToShow = this.tasks.filter(task => task.name.toLowerCase().includes(this.searchTask));
            if (this.priorityFilter) {
                tasksToShow = tasksToShow.filter(task => task.priority == this.priorityFilter);
            }
            return tasksToShow;
        },
        orderTasks(task1, task2) {
            let levels = ['low', 'normal', 'high'];
            if (levels.indexOf(task1.priority) > levels.indexOf(task2.priority)) {
                return -1;
            }
            if (levels.indexOf(task1.priority) < levels.indexOf(task2.priority)) {
                return 1;
            }
            return 0;
        }
    }
}).mount('#to_do_list');