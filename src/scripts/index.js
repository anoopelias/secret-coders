/* eslint-disable no-unused-vars */
import 'bootstrap';
import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import { SVG } from '@svgdotjs/svg.js';

const SPACE_ID = "space";
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
                commands.push(space.forward.bind(space, n));
                break;
            case "BACKWARD":
                commands.push(space.backward.bind(space, n));
                break;
            case "LEFT":
                commands.push(space.left.bind(space, n));
                break;
            case "RIGHT":
                commands.push(space.right.bind(space, n));
                break;
        }
    });

    return commands;
}

async function getImage(name) {
    return $.get('images/' + name, () => { }, 'text');
}

class Space {
    draw;
    arrow;
    x;
    y;
    angle;

    constructor(id) {
        $('#' + id).empty();
        this.draw = SVG().addTo('#' + id).size('100%', '100%');
        this.x = 0;
        this.y = 0;
        this.angle = 0;
    }

    async init() {
        this.draw.rect('100%', '100%').attr({ fill: '#ebfaef' });
        this.draw.svg(await getImage('arrow-right.svg'));
        this.arrow = this.draw.findOne("#arrow-right");
    }

    left(n) {
        this.turn(-n);
    }

    right(n) {
        this.turn(n);
    }

    forward(n) {
        this.x += Math.cos(this.angle) * n;
        this.y += Math.sin(this.angle) * n;
        console.log(this.x, this.y);
        this.arrow.animate(2000, 0, 'after').move(this.x, this.y);
    }

    turn(n) {
        this.arrow.animate(2000, 0, 'after').transform({
            rotate: n,
            origin: [this.x, this.y],
        });
        this.angle = (n / 180) * Math.PI;
    }

}

$(renderSpace());