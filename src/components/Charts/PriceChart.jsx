import React from 'react';
import { Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const styles = {
  chartContainer: {
    height: '400px',
    marginTop: '20px',
  },
  tooltip: {
    backgroundColor: '#fff',
    padding: '0px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    color: '#ffa500',
  }
};

const PriceChart = ({ chartData, loadingChart, selectedCrypto }) => {
  if (loadingChart) return <Spin />;
  if (!selectedCrypto) return null;

  return (
    <div style={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={styles.tooltip}
            labelFormatter={(label) => `Fecha: ${label}`} 
            formatter={(value) => [`Precio: ${value}`, 'Precio']} 
          />
          <Line 
            type="Linear" 
            dataKey="price" 
            stroke="#8884d8" 
            dot={true} 
            strokeWidth={3} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;