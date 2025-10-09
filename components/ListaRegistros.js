import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ListaRegistros({ registros, onEdit, onDelete }) {
  const totalSaldo = registros.reduce((acc, reg) => acc + reg.valor, 0);

  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>Registros Financeiros</Text>
      <Text style={styles.totalSaldo}>Saldo Total: R$ {totalSaldo.toFixed(2)}</Text>

      {registros.length > 0 ? registros.map(reg => (
        <View key={reg.id} style={styles.itemHistorico}>
          <View>
            <Text style={styles.itemTexto}>Valor: R$ {reg.valor.toFixed(2)}</Text>
            <Text style={styles.itemTexto}>Categoria: {reg.categoria}</Text>
            {reg.descricao ? <Text style={styles.itemTexto}>Descrição: {reg.descricao}</Text> : null}
            <Text style={styles.itemTexto}>Data: {reg.data}</Text>
          </View>
          <View style={styles.botoesAcao}>
            <TouchableOpacity style={styles.botaoEditar} onPress={() => onEdit(reg)}>
              <Text style={styles.botaoTextoAcao}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoDelete} onPress={() => onDelete(reg.id)}>
              <Text style={styles.botaoTextoAcao}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      )) : (
        <Text style={styles.itemTexto}>Nenhum registro encontrado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#e6f0d4', borderRadius: 12, padding: 20, marginHorizontal: 15, marginBottom: 20, elevation: 6, shadowColor: '#405d27', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  subtitulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#405d27' },
  totalSaldo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#4b662e' },
  itemHistorico: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#a1b37d' },
  itemTexto: { fontSize: 16, color: '#405d27', fontWeight: '600' },
  botoesAcao: { flexDirection: 'row' },
  botaoEditar: { backgroundColor: '#a9b77d', borderRadius: 20, width: 35, height: 35, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  botaoDelete: { backgroundColor: '#8a9a5b', borderRadius: 20, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' },
  botaoTextoAcao: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
