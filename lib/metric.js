import jsx from './jsx-quasi';
import React from 'react';

class MetricComponent {
    render() {
        return jsx`
            <div class="metric-wrapper">
                <h1 class="metric">${ this.props.value }</h1>
                <p class="description">${ this.props.description }</p>
            </div>
        `;
    }
}
MetricComponent.prototype.displayName = "MetricComponent";

export default React.createClass(MetricComponent.prototype);
