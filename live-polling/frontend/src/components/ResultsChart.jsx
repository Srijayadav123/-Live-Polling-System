import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from 'recharts';

export default function ResultsChart({ options }) {
  if (!options) return null;

  const colors = ['#382ec3ff', '#382ec3ff', '#382ec3ff', '#382ec3ff', '#3B82F6'];

  const data = options.map((o, i) => ({
    name: o.text,
    votes: o.votes,
    color: colors[i % colors.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="votes" label={{ position: 'top', fill: '#333' }}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

