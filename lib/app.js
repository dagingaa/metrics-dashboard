import jsx from './jsx-quasi';
import React from 'react';
import axios from 'axios';

import MetricComponent from './metric';

// TODO: Move this out into a module of its own
class Metric {
    constructor(path, description) {
        this.path = path.split(".");
        this.value = "0";
        this.description = description;
    }
}

class AppComponent {
    getInitialState() {
        return {
            metrics: System.appConfig.metrics.map(metric => new Metric(metric.path, metric.description))
        };
    }

    updateMetrics(newMetrics) {
        this.state.metrics.forEach(metric => {
            let value = metric.path.reduce((newMetric, path) => newMetric[path], newMetrics);
            metric.value = value + ""; // falsy values do not render
        });
        this.setState(this.state);
    }

    componentDidMount() {
        // Start polling the server for metrics data every pollingDuration
        setInterval(() => {
            axios.get(System.appConfig.metricsUrl)
                .then(response => this.updateMetrics(response.data))
        }, System.appConfig.pollingDuration);
    }

    render() {
        return jsx`
            <div>
                ${ this.state.metrics.map(metric => {
                    return jsx`
                        <${MetricComponent} value="${ metric.value }" description="${ metric.description }" />
                    `;
                })}
            </div>
        `;
    }
}
AppComponent.prototype.displayName = "AppComponent";

export default React.createClass(AppComponent.prototype);
