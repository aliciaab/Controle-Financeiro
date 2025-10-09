import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function MetaEconomia({ meta, registros, onSalvarMeta }) {
  const [descricao, setDescricao] = useState(meta?.descricao || '');
  const [valorMeta, setValorMeta] = useState(meta?.valor.toString() || '');

  // Calcula o saldo: receitas - despesas
  const saldo = registros.reduce((acc, reg) => {
    if (reg.tipo === 'receita') return acc + reg.valor;
    else if (reg.tipo === 'despesa') return acc - reg.valor;
    else return acc;
  }, 0);

  const progresso = Math.min((saldo / (parseFloat(valorMeta) || 1)) * 100, 100);

  useEffect(() => {
  if (progresso >= 100 && valorMeta) {
    Alert.alert('Parabéns!', 'Você alcançou sua meta de economia!');
  }
}, [progresso, valorMeta]);

  const salvar = () => {
    const valorNum = parseFloat(valorMeta.replace(',', '.'));
    if (!descricao || !valorNum || valorNum <= 0) {
      return Alert.alert('Erro', 'Por favor, preencha uma descrição e valor válido para a meta.');
    }
    onSalvarMeta({ descricao, valor: valorNum });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Meta de Economia</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Descrição da Meta"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor da Meta (R$)"
        keyboardType="numeric"
        value={valorMeta}
        onChangeText={setValorMeta}
      />

      <TouchableOpacity style={styles.botao} onPress={salvar}>
        <Text style={styles.botaoTexto}>Salvar Meta</Text>
      </TouchableOpacity>

      {valorMeta && (
        <View style={styles.progressoContainer}>
          <View style={[styles.barraProgresso, { width: `${progresso}%` }]} />
          <Text style={styles.progressoTexto}>{progresso.toFixed(1)}% atingido</Text>
        </View>
      )}

      {meta && (
        <Text style={styles.metaDescricao}>Meta: {meta.descricao} - R$ {meta.valor.toFixed(2)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#e6f0d4', borderRadius: 12, padding: 20, marginHorizontal: 15, marginBottom: 20, elevation: 6, shadowColor: '#405d27', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#405d27' },
  input: {
    borderWidth: 1,
    borderColor: '#a1b37d',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: 'white',
    color: '#405d27',
    fontWeight: '600',
  },
  botao: { backgroundColor: '#587330', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  botaoTexto: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  progressoContainer: {
    height: 20,
    backgroundColor: '#c3d09a',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  barraProgresso: {
    height: '100%',
    backgroundColor: '#405d27',
  },
  progressoTexto: {
    textAlign: 'center',
    color: '#405d27',
    fontWeight: '600',
  },
  metaDescricao: {
    textAlign: 'center',
    color: '#587330',
    fontWeight: '600',
    fontSize: 16,
  },
});
