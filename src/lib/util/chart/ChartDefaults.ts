import { Chart, registerables } from 'chart.js';

export type ChartDefaults = {
    fillColor: string;
    fillColorHighlight: string;
    lineColor: string;
    lineColorHighlight: string;
    lineWidth: number;
    fontSize: number;
    fontColor: string;
    fontColorHighlight: string;
    gridColor: string;
    borderRadius: number;
};

let lineDefaults: ChartDefaults = null;
let barDefaults: ChartDefaults = null;

export function lineChartDefaults(): ChartDefaults {
    if (lineDefaults === null && barDefaults === null) Chart.register(...registerables);
    if (lineDefaults !== null) return lineDefaults;
    return (barDefaults = commonDefaults());
}

export function barChartDefaults(): ChartDefaults {
    if (lineDefaults === null && barDefaults === null) Chart.register(...registerables);
    if (barDefaults !== null) return barDefaults;
    return (barDefaults = commonDefaults());
}

function commonDefaults(): ChartDefaults {
    const style = getComputedStyle(document.body);
    const defaults: ChartDefaults = {
        lineWidth: parseInt(style.getPropertyValue('--chart-line-width')),
        lineColor: style.getPropertyValue('--chart-line-color'),
        lineColorHighlight: style.getPropertyValue('--chart-line-color-highlight'),
        fontSize: parseInt(style.getPropertyValue('--chart-font-size')),
        fontColor: style.getPropertyValue('--chart-font-color'),
        fontColorHighlight: style.getPropertyValue('--chart-font-color-highlight'),
        fillColor: style.getPropertyValue('--chart-fill-color'),
        fillColorHighlight: style.getPropertyValue('--chart-fill-color-highlight'),
        gridColor: style.getPropertyValue('--chart-grid-color'),
        borderRadius: parseInt(style.getPropertyValue('--border-radius-without-unit'))
    };
    return defaults;
}
