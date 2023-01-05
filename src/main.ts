import {Chart, registerables} from 'chart.js';
import json from '../static/community-plugin-stats.json';
import mostDownloaded from './mostDownloaded';

Chart.register(...registerables);

mostDownloaded(json);

export {};