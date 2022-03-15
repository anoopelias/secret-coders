import '../styles/index.scss';

import { SVG } from '@svgdotjs/svg.js';

const draw = SVG().addTo('body').size(300, 300);
draw.rect(100, 100).attr({ fill: '#f06' });

console.log('webpack starterkit');
