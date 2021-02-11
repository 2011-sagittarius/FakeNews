import React from 'react'
import {Pie, Doughnut, Bar} from 'react-chartjs-2'

const Chart = props => {
  return (
    <div className="chart">
      <Bar
        data={props.chartData}
        options={{
          title: {
            display: props.displayTitle,
            text: 'News Content Analysis',
            fontSize: 20,
            fontFamily: "'Vollkorn', serif",
            marginBottom: '1rem'
          },
          legend: {
            display: false
          }
        }}
      />
    </div>
  )
}

export default Chart
