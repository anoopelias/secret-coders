/* eslint-disable no-unused-vars */
import 'bootstrap';
import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import { SVG } from '@svgdotjs/svg.js';

const SPACE_ID = "space";
const ANIMATION_TIME = 2000;
const ARROW_SIDE = 16;

async function renderSpace() {
    let space = new Space(SPACE_ID);
    await space.init();

    connect(space);
}

function connect(space) {
    $("#run").click(run.bind(null, space));
}

async function run() {
    const program = $('#program').val();
    const space = new Space(SPACE_ID);
    await space.init();

    const commands = parse(program, space);
    for (let command of commands) {
        command();
    }
}

function parse(program, space) {
    const commands = [];
    program.split("\n").map(line => {
        const splits = line.split(" ");
        const n = parseInt(splits[1]);
        switch (splits[0]) {
            case "FORWARD":
            case "forward":
            case "Forward":
                commands.push(space.forward.bind(space, n));
                break;
            case "BACK":
            case "back":
            case "Back":
                commands.push(space.backward.bind(space, n));
                break;
            case "LEFT":
            case "left":
            case "Left":
                commands.push(space.left.bind(space, n));
                break;
            case "RIGHT":
            case "right":
            case "Right":
                commands.push(space.right.bind(space, n));
                break;
            case "PENDOWN":
            case "pendown":
            case "PenDown":
                commands.push(space.setPenDown.bind(space));
                break;
            case "PENUP":
            case "penup":
            case "PenUp":
                commands.push(space.setPenUp.bind(space));
                break;
        }
    });

    return commands;
}

function rad(angle) {
    return (angle / 180) * Math.PI;
}

async function getImage(name) {
    return $.get('images/' + name, () => { }, 'text');
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
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.relx = 0;
        this.time = 0;
        this.penDown = true;
    }

    async init() {
        this.draw.rect('100%', '100%').attr({ fill: '#ebfaef' });
        this.draw.svg(await getImage('arrow-right.svg'));
        this.arrow = this.draw.findOne("#arrow-right");
        this.arrow.timeline(this.draw.timeline());
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
                .stroke({ color: '#f06', width: 1, linecap: 'round' });
            line.timeline(this.draw.timeline());
            line.animate(ANIMATION_TIME, this.time, 'relative')
                .plot(startX, startY, endX, endY);

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

}

$(renderSpace());