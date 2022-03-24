/* eslint-disable no-unused-vars */
import 'bootstrap';
import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import { SVG } from '@svgdotjs/svg.js';
import * as parser from './parser';
import { setEditor } from './editor';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const SPACE_ID = "space";
const ANIMATION_TIME = 2000;
const ANIMATION_TIME_FAST = 100;
const ARROW_SIDE = 16;

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

function rad(angle) {
    return (angle / 180) * Math.PI;
}

class Space {
    draw;
    arrow;
    x;
    y;
    relx;
    angle;
    time;
    penDown;

    constructor(id) {
        $('#' + id).empty();
        this.draw = SVG().addTo('#' + id).size('100%', '100%');
        this.relx = 100;
        this.x = this.relx * Math.cos(Math.PI / 4);
        this.y = this.relx * Math.sin(Math.PI / 4);
        this.angle = 0;
        this.time = 0;
        this.penDown = false;

        this.draw.rect('100%', '100%').attr({ fill: '#ebfaef' });
        this.arrow = this.drawArrow();
    }

    drawArrow() {
        const group = this.draw.group();
        group.line(2, 8, 16.5, 8)
            .stroke({ color: '#00731f', width: 1 });
        group.line(11, 2, 16.5, 8)
            .stroke({ color: '#00731f', width: 1 });
        group.line(11, 14, 16.5, 8)
            .stroke({ color: '#00731f', width: 1 });

        group.transform({ angle: 45, position: this.adjustArrow([0, 0]) });
        group.x(this.relx);
        group.transform({ angle: -45, position: this.adjustArrow([this.x, this.y]) });
        return group;
    }

    setPenDown() {
        this.penDown = true;
    }

    setPenUp() {
        this.penDown = false;
    }

    adjustArrow([x, y]) {
        return [x + ARROW_SIDE, y + (ARROW_SIDE / 2)];
    }

    backward(n) {
        this.forward(-n);
    }

    left(n) {
        this.right(-n);
    }

    forward(n) {
        const [startX, startY] = this.adjustArrow([this.x, this.y]);

        this.x += n * Math.cos(rad(this.angle));
        this.y += n * Math.sin(rad(this.angle));
        this.relx += n;
        const [endX, endY] = this.adjustArrow([this.x, this.y]);

        console.log("forward", n, this.x, this.y, this.angle, this.time);
        this.arrow.animate(ANIMATION_TIME, this.time, 'relative')
            .x(this.relx);


        if (this.penDown) {
            const line = this.draw.line(startX, startY, startX, startY)
                .stroke({ color: '#ebfaef', width: 2, linecap: 'round' });
            line.timeline(this.draw.timeline());
            line.animate(ANIMATION_TIME, this.time, 'relative')
                .plot(startX, startY, endX, endY)
                .animate(ANIMATION_TIME, this.time, 'relative')
                .stroke({ color: '#f06' });

        }

        this.time += ANIMATION_TIME;
    }

    right(n) {
        this.angle += n;
        console.log("right", n, this.x, this.y, this.angle, this.time);
        this.arrow.animate(ANIMATION_TIME, this.time, 'relative').transform({
            rotate: this.angle,
            origin: this.adjustArrow([this.relx, 0]),
            position: this.adjustArrow([this.x, this.y]),
        });
        this.time += ANIMATION_TIME;
    }

    hide() {
        this.arrow.animate(ANIMATION_TIME_FAST, this.time, 'relative').attr({ opacity: 0 });
        this.time += ANIMATION_TIME_FAST;
    }

    show() {
        this.arrow.animate(ANIMATION_TIME_FAST, this.time, 'relative').attr({ opacity: 100 });
        this.time += ANIMATION_TIME_FAST;
    }

}

$(renderSpace());