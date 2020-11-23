import React, { Component } from 'react'
import { BarChart, CartesianGrid, Bar, XAxis, YAxis, Legend } from 'recharts';

export default class YearlyIndices extends Component {
    render() {
        return (
            <BarChart
                className='mx-auto'
                width={this.props.width}
                height={this.props.height}
                data={this.props.data}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Legend />
                <Bar isAnimationActive={false}  dataKey="sdi" fill="red"/>
                <Bar isAnimationActive={false}  dataKey="spi" fill="green" />
            </BarChart>
        );
    }
}
;