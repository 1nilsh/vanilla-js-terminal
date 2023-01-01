const terminal_window = document.getElementById('terminal-window');
const terminal_prompt = document.getElementById('terminal-prompt');

let history_browse_counter = 0;
let cmd_history = JSON.parse(localStorage.getItem('terminal-history')) ?? [];
setCaret();

terminal_prompt.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();

        let command = terminal_prompt.innerHTML;

        terminal_window.innerHTML += '<div class="prompt-history">' + command + '</div>';
        terminal_prompt.innerHTML = "";

        terminal_window.innerHTML += '<div class="result-history">' + handleCommand(command) + '</div><br>';

        addToHistory(command);
        setCaret();
        history_browse_counter = 0;
    }

    if (event.key === "ArrowUp") {
        terminal_prompt.innerHTML = getFromHistory(history_browse_counter);
        history_browse_counter++;
        if (history_browse_counter > cmd_history.length) {
            history_browse_counter = cmd_history.length;
        }
    }

    if (event.key === "ArrowDown") {
        terminal_prompt.innerHTML = getFromHistory(history_browse_counter);
        history_browse_counter--;
        if (history_browse_counter < 0) {
            history_browse_counter = 0;
        }
    }
});

document.addEventListener('click', function (event) {
    if (event.target.closest('#' + terminal_prompt.id)) {
        return;
    }

    if (window.getSelection().toString()) {
        // The user was selecting text, so do nothing
        return;
    }

    setCaret(-1);
});

function setCaret(offset = 0) {
    if (terminal_prompt.innerHTML.length === 0) {
        offset = 0;
    }

    if (offset < 0) {
        offset = terminal_prompt.innerHTML.length + offset + 1;
    }

    var range = document.createRange()
    var sel = window.getSelection()

    range.setStart(terminal_prompt.childNodes[0], offset)
    range.collapse(true)

    sel.removeAllRanges()
    sel.addRange(range)
}

function handleCommand(cmd) {
    try {
        return eval('(' + cmd + ')');
    } catch (e) {
        return e.message;
    }
}

function addToHistory(cmd) {
    if (cmd === '') {
        return;
    }

    cmd_history.push(cmd);
    localStorage.setItem('terminal-history', JSON.stringify(cmd_history))
}

function getFromHistory(pos) {
    if (cmd_history.length === 0) {
        return '';
    }

    if (pos >= cmd_history.length) {
        pos = cmd_history.length - 1;
    }

    if (pos < 0) {
        pos = 0;
    }

    return cmd_history[cmd_history.length - pos - 1];
}
