import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function Grafico({ registros }) {
  const { width } = useWindowDimensions();

  if (registros.length < 2) {
    return (
      <Text style={{ textAlign: 'center', margin: 10, color: '#405d27', fontWeight: '600' }}>
        Adicione pelo menos 2 registros para ver o gráfico.
      </Text>
    );
  }

  const data = {
    labels: registros
      .map(reg => new Date(reg.id).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }))
      .reverse(),
    datasets: [
      {
        data: registros.map(reg => reg.valor).reverse(),
        color: (opacity = 1) => `rgba(64, 93, 39, ${opacity})`, // cor da linha (verde escuro)
        strokeWidth: 3,
      },
    ],
  };

  // Define altura proporcional à largura (exemplo: 40% da largura)
  const chartHeight = width * 0.55;

  return (
    <View>
      <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: '#405d27', marginBottom: 8 }}>
        Evolução (Valor)
      </Text>
      <LineChart
        data={data}
        width={width - 40}  // 20 padding de cada lado
        height={chartHeight}
        yAxisSuffix=" R$"
        chartConfig={{
          backgroundColor: '#e6f0d4',
          backgroundGradientFrom: '#e6f0d4',
          backgroundGradientTo: '#a9b77d',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(64, 93, 39, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(64, 93, 39, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#8a9a5b',
            fill: '#a9b77d',
          },
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </View>
  );
}
