class Task {
    constructor(name, id) {
        this.id = id;
        this.name = name;
        this.priority = 'normal';
        this.done = false;
        this.time = Date.now();
    }
}
class Controller {
    //Model
    static newTask(task_name) {
        let task = new Task(task_name, this.getNewId());
        this.showTask(task);
        let lc_tasks = JSON.parse(localStorage.getItem('tasks'));
        if (lc_tasks) {
            lc_tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(lc_tasks))
        } else {
            let task_list = [task];
            task_list = JSON.stringify(task_list);
            localStorage.setItem('tasks', task_list)
        }
    }
    static getNewId() {
        let id = 0;
        let tasks = Controller.getAllTasks();
        if (tasks) {
            if (tasks.length !== 0) {
                id = tasks[tasks.length - 1].id + 1;
            }
        }
        return id;
    }
    static getNotFinishedTasks() {
        let done_tasks = 0;
        let tasks = Controller.getAllTasks();
        if (tasks) {
            for (let task of tasks) {
                if (!task.done) {
                    done_tasks++;
                }
            }
        } else done_tasks = 0;

        return done_tasks;
    }
    static getAllTasksNum() {
        if (Controller.getAllTasks()) {
            return Controller.getAllTasks().length;
        }
        return 0;
    }
    static getAllTasks() {
        return JSON.parse(localStorage.getItem('tasks'));
    }
    static orderTasks(task1, task2) {
            let levels = ['low', 'normal', 'high'];
            if (levels.indexOf(task1.priority) > levels.indexOf(task2.priority)) {
                return -1;
            }
            if (levels.indexOf(task1.priority) < levels.indexOf(task2.priority)) {
                return 1;
            }
            return 0;
        }
        //View
    static showTask(task) {
        let task_div = $('<div class="task" id=' + task.id + '><div class="task_head"><img src="./img/not_checked.svg" class="do_btn"><h2>' + task.name + '</h2><img src="./img/delete.png" class="delete_task"></div><div class="priority">Prioridad:<div class="low">Low</div><div class="normal">Normal</div><div class="high">High</div><div class="time"><img src="./img/clock.svg">Añadido hace ' + Math.round((Date.now() - task.time) / 1000 / 60) + ' minutos</div></div></div>');
        $('#tasks').append(task_div);
        if (task.done) {
            $('.do_btn').last().attr('src', './img/checked.svg');
            $("h2").last().css({ "text-decoration": "line-through", "color": "#00BC8C" })
        }
        $('.do_btn').last()[0].id = task.id;
        $('.do_btn').last().click(function() {
            let tasks = Controller.getAllTasks();
            for (let elem of tasks) {
                if (elem.id == $(this)[0].id) {
                    var tasks_id = tasks.indexOf(elem);
                }
            }
            tasks[tasks_id].done = !tasks[tasks_id].done;
            localStorage['tasks'] = JSON.stringify(tasks);
            if (tasks[tasks_id].done) {
                $(this).find('.do_btn').attr('src', './img/checked.svg');
                $(this).find('h2').css({ "text-decoration": "line-through", "color": "#00BC8C" });
            } else {
                $(this).find('.do_btn').attr('src', './img/not_checked.svg');
                $(this).find('h2').css({ "text-decoration": "none", "color": "white" })
            }
            Controller.updateTasks();
        })
        $('.delete_task').last()[0].id = task.id;
        $('.delete_task').last().click(function(e) {
            let tasks = Controller.getAllTasks();
            $('#' + task.id).remove();
            let new_tasks = [];
            new_tasks = tasks.filter(item => item.id != $(this)[0].id);
            localStorage.setItem('tasks', JSON.stringify(new_tasks));
            Controller.updateTasks();
        })
        $('.low').last()[0].id = task.id;
        $('.low').last().click(function(e) {
            let tasks = Controller.getAllTasks();
            for (let elem of tasks) {
                if (elem.id == $(this)[0].id) {
                    var tasks_id = tasks.indexOf(elem);
                }
            }
            tasks[tasks_id].priority = 'low';
            localStorage['tasks'] = JSON.stringify(tasks);
            Controller.updateTasks();
            Controller.animateTask($(this).attr('id'));
        })
        $('.normal').last()[0].id = task.id;
        $('.normal').last().click(function(e) {
            let tasks = Controller.getAllTasks();
            for (let elem of tasks) {
                if (elem.id == $(this)[0].id) {
                    var tasks_id = tasks.indexOf(elem);
                }
            }
            tasks[tasks_id].priority = 'normal';
            tasks.sort(Controller.orderTasks)
            localStorage['tasks'] = JSON.stringify(tasks);
            Controller.updateTasks();
            Controller.animateTask($(this).attr('id'));
        })
        $('.high').last()[0].id = task.id;
        $('.high').last().click(function(e) {
            let tasks = Controller.getAllTasks();
            for (let elem of tasks) {
                if (elem.id == $(this)[0].id) {
                    var tasks_id = tasks.indexOf(elem);
                }
            }
            tasks[tasks_id].priority = 'high';
            tasks.sort(Controller.orderTasks);
            console.log($(this).attr('id'));
            localStorage['tasks'] = JSON.stringify(tasks);
            Controller.updateTasks();
            Controller.animateTask($(this).attr('id'));
        })
        if (task.priority == 'normal') {
            $('.priority').last().addClass('selected_normal');
        } else if (task.priority == 'high') {
            $('.priority').last().addClass('selected_high');
        } else {
            $('.priority').last().addClass('selected_low');
        }
    }

    static showAllTasks() {
        let tasks = Controller.getAllTasks();
        if (tasks) {
            tasks.sort(Controller.orderTasks);
            for (let task of tasks) {
                this.showTask(task);
            }
        }

    }
    static animateTask(task_id) {
        $("#" + task_id).addClass("animation");
        setTimeout(() => { $("#" + task_id).removeClass('animation'); }, 1000);
    }
    static updateTasks() {
        $('#pending_tasks').text(Controller.getNotFinishedTasks());
        $('#total_tasks').text(Controller.getAllTasksNum());
        $('#tasks').html('');
        this.showAllTasks();
    }
}

window.onload = () => {
    Controller.updateTasks();
    $('#add_task').keypress(function(e) {
        if (e.keyCode === 13) {
            if ($(this).val().trim() != '') {
                Controller.newTask($(this).val());
                Controller.updateTasks();
                $(this).val('');
            }
            Controller.animateTask(Controller.getNewId() - 1);
        }
    });
    $("#clear_tasks").click(function() {
        tasks = Controller.getAllTasks();
        let new_tasks = [];
        for (task of tasks) {
            if (!task.done) {
                new_tasks.push(task);
            }
        }
        localStorage.setItem('tasks', JSON.stringify(new_tasks));
        Controller.updateTasks();
    });

}