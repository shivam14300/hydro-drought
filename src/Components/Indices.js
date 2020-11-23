import React, { Component } from 'react'
import { LineChart,  CartesianGrid, Line, XAxis, YAxis, Legend } from 'recharts';

export default class Indices extends Component {
        render() {
            return (
                <LineChart
                    className='mx-auto'
                    width={this.props.width}
                    height={this.props.height}
                    data={this.props.data}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Legend />
                    <Line isAnimationActive={false} dot={false} dataKey="spi" stroke="red" />
                    <Line isAnimationActive={false} dot={false} dataKey="sdi" stroke="green" />
                </LineChart>
            );
        }
    }

