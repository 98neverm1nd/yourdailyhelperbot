'use strict';

const Telegram = require('telegram-node-bot');

class TodoController extends Telegram.TelegramBaseController {
    addHandler($) {
        let todo = $.message.text.split(' ').slice(1).join(' ');

        if (!todo) return $.sendMessage('*Use /add like this: \'/add My first task.\'*',{ parse_mode: 'Markdown' });

        $.getUserSession('todos')
            .then(todos => {
                if (!Array.isArray(todos)) $.setUserSession('todos', [todo]);
                else $.setUserSession('todos', todos.concat([todo]));
                $.sendMessage('*Added new todo!*', { parse_mode: 'Markdown' });
            });
    }
    getHandler($) {
        $.getUserSession('todos').then(todos => {
            $.sendMessage(this._serializeList(todos), { parse_mode: 'Markdown' });
        });
    }

    checkHandler($) {
        let index = parseInt($.message.text.split(' ').slice(1)[0]);
        if (isNaN(index-1)) return $.sendMessage('*Sorry, you didn\'t pass a valid index. For example, removing the first item will be \'/check 1\'*',{ parse_mode: 'Markdown' });

        $.getUserSession('todos')
            .then(todos => {
                if (index-1 >= todos.length) return $.sendMessage('*Sorry, you didn\'t pass a valid index.*',{ parse_mode: 'Markdown' });
                todos.splice(index-1, 1);
                $.setUserSession('todos', todos);
                $.sendMessage('*Checked todo!*',{ parse_mode: 'Markdown' });
            });
    }
    startHandler($) {
        $.sendMessage('Welcome! Let\'s begin.');
    }

    get routes() {
        return {
            'addCommand': 'addHandler',
            'getCommand': 'getHandler',
            'checkCommand': 'checkHandler',
            'startCommand': 'startHandler'
        };
    }

    _serializeList(todoList) {
        let serialized = '*Your Todos*\n\n';
        todoList.forEach((t, i) => {
            serialized += `*[${i+1}]* - ${t}\n`;
        });
        if (serialized == '*Your Todos*\n\n') {
            return '*Your Todolist is currently empty.*';
        }
        return serialized;
    }
}

module.exports = TodoController;