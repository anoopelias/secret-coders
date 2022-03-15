import 'bootstrap';
import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import { SVG } from '@svgdotjs/svg.js';

const draw = SVG().addTo('#space').size('100%', '100%');
draw.rect('100%', '100%').attr({ fill: '#ebfaef' });

console.log('webpack starterkit');
