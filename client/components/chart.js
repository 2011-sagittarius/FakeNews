import React, {Component} from 'react'
import {Pie, Doughnut, Bar} from 'react-chartjs-2'

class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartData: props.chartData
    }
  }

  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendPosition: 'left'
  }

  render() {
    return (
      <div className="chart">
        <Pie
          data={this.props.chartData}
          options={{
            title: {
              display: this.props.displayTitle,
              text: 'News Content Analysis',
              fontSize: 25
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition
            }
          }}
        />
      </div>
    )
  }
}

export default Chart
