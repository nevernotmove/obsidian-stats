import {Chart, registerables} from 'chart.js';

export type ChartDefaults = {
    fillColor: string,
    fillColorHighlight: string,
    lineColor: string,
    lineColorHighlight: string,
    lineWidth: number,
    fontSize: number,
    fontColor: string,
    fontColorHighlight: string,
    gridColor: string,
}

let defaults: ChartDefaults = null;

export function chartDefaults(): ChartDefaults {
    if (defaults !== null) {
        return defaults;
    }

    // Bundling fails if missing
    Chart.register(...registerables);

    // Get default values
    const style = getComputedStyle(document.body);
    const lineWidth = parseInt(style.getPropertyValue('--chart-line-width'));
    const lineColor = style.getPropertyValue('--chart-line-color');
    const lineColorHighlight = style.getPropertyValue('--chart-line-color-highlight');
    const fontSize = parseInt(style.getPropertyValue('--chart-font-size'));
    const fontColor = style.getPropertyValue('--chart-font-color');
    const fontColorHighlight = style.getPropertyValue('--chart-font-color-highlight');
    const fillColor = style.getPropertyValue('--chart-fill-color');
    const fillColorHighlight = style.getPropertyValue('--chart-fill-color-highlight');
    const gridColor = style.getPropertyValue('--chart-grid-color');

    defaults = {
        lineWidth,
        lineColor,
        lineColorHighlight,
        fontSize,
        fontColor,
        fontColorHighlight,
        fillColor,
        fillColorHighlight,
        gridColor,
    };

    return defaults;
}
