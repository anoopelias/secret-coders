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

    constructor(id) {
        $('#' + id).empty();
        this.draw = SVG().addTo('#' + id).size('100%', '100%');
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.relx = 0;
        this.time = 0;
    }

    async init() {
        this.draw.rect('100%', '100%').attr({ fill: '#ebfaef' });
        this.draw.svg(await getImage('arrow-right.svg'));
        this.arrow = this.draw.findOne("#arrow-right");
        this.arrow.timeline(this.draw.timeline());
    }

    backward(n) {
        this.forward(-n);
    }

    left(n) {
        this.right(-n);
    }

    forward(n) {
        this.x += n * Math.cos(rad(this.angle));
        this.y += n * Math.sin(rad(this.angle));
        this.relx += n;
        console.log("forward", n, this.x, this.y, this.angle, this.time);
        this.arrow.animate(ANIMATION_TIME, this.time, 'relative').x(this.relx);
        this.time += ANIMATION_TIME;
    }

    right(n) {
        this.angle += n;
        console.log("right", n, this.x, this.y, this.angle, this.time);
        this.arrow.animate(ANIMATION_TIME, this.time, 'relative').transform({
            rotate: this.angle,
            origin: [this.relx, 0],
            position: [this.x, this.y],
        });
        this.time += ANIMATION_TIME;
    }

}

$(renderSpace());