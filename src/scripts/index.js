/* eslint-disable no-unused-vars */
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import $ from 'jquery';
import '../styles/index.scss';
import * as parser from './parser';
import { setEditor } from './editor';
import { Space } from './space';

const SPACE_ID = "space";

function renderSpace() {
    const program = sessionStorage.getItem('secret-coders-program');
    
    setEditor(program, (newProgram) => {
        sessionStorage.setItem('secret-coders-program', newProgram);
    });
    let space = new Space(SPACE_ID);
    connect();
}

function connect() {
    $("#run").click(run);
}

function run() {
    const program = window.editor.getValue();
    const space = new Space(SPACE_ID);

    try {
        const programTree = parser.parse(program);
        execute(programTree, space);
    } catch (e) {
        if (!(e instanceof parser.SyntaxError)) throw e;
        const location = e.location.end;
        Toastify({
            text: `${e.toString()}, Line ${location.line}, Column: ${location.column}`,
            duration: 6000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
          }).showToast();
    }
}

function execute(programTree, space) {
    for (let command of programTree) {
        if (command.command === "repeat") {
            for (let i = 0; i < command.number; i++) {
                execute(command.subcommands, space);
            }
        } else {
            executeCommand(command, space);
        }
    }
}

function executeCommand(command, space) {
    switch (command.command) {
        case "forward":
            space.forward(command.number);
            break;
        case "back":
            space.backward(command.number);
            break;
        case "left":
            space.left(command.number);
            break;
        case "right":
            space.right(command.number);
            break;
        case "pendown":
            space.setPenDown();
            break;
        case "penup":
            space.setPenUp();
            break;
        case "hide":
            space.hide();
            break;
        case "show":
            space.show(space);
            break;
    }

}

$(renderSpace());