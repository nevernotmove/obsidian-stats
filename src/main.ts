import {Chart, registerables} from 'chart.js';
import json from '../static/community-plugin-stats.json';
import mostDownloaded from './mostDownloaded';

// Bundling fails if missing
Chart.register(...registerables);

// Set default colors
Chart.defaults.backgroundColor = '#1E1E1E';
Chart.defaults.borderColor = 'rgb(139, 108, 239, 1)';
Chart.defaults.color = '#B4B4B4';

mostDownloaded(json);

export {};