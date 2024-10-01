import BaseMetric = require("./base");
import CounterMetric = require("./counter");
import GaugeMetric = require("./gauge");
import HistogramMetric = require("./histogram");
import InfoMetric = require("./info");

export {
	BaseMetric as Base,
	CounterMetric as Counter,
	GaugeMetric as Gauge,
	HistogramMetric as Histogram,
	InfoMetric as Info
};

export declare function resolve(
	opt: string
): typeof CounterMetric | typeof GaugeMetric | typeof HistogramMetric | typeof InfoMetric;
export declare function register(name: string, value: BaseMetric<any>): void;
