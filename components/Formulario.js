import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Formulario({ onSave, onCancel, registroEmEdicao }) {
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    if (registroEmEdicao) {
      setValor(String(registroEmEdicao.valor));
      setCategoria(registroEmEdicao.categoria);
      setDescricao(registroEmEdicao.descricao || '');
    } else {
      setValor('');
      setCategoria('');
      setDescricao('');
    }
  }, [registroEmEdicao]);

  const handleSaveClick = () => {
    onSave(valor, categoria, descricao);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>
        {registroEmEdicao ? 'Editando Registro' : 'Novo Registro'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Valor (ex: 100 ou -50)"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />
      <TextInput
        style={styles.input}
        placeholder="Categoria (ex: Alimentação)"
        value={categoria}
        onChangeText={setCategoria}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição (opcional)"
        value={descricao}
        onChangeText={setDescricao}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSaveClick}>
        <Text style={styles.botaoTexto}>
          {registroEmEdicao ? 'Atualizar Registro' : 'Salvar Registro'}
        </Text>
      </TouchableOpacity>

      {registroEmEdicao && (
        <TouchableOpacity style={styles.botaoCancelar} onPress={onCancel}>
          <Text style={styles.botaoTexto}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#e6f0d4', borderRadius: 12, padding: 20, marginHorizontal: 15, marginBottom: 20, elevation: 6, shadowColor: '#405d27', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  subtitulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#405d27' },
  input: { 
    borderWidth: 1, 
    borderColor: '#a1b37d', 
    borderRadius: 10, 
    padding: 14, 
    fontSize: 16, 
    marginBottom: 15, 
    backgroundColor: 'white',
    color: '#405d27',
    fontWeight: '600'
  },
  botao: { backgroundColor: '#587330', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 5 },
  botaoTexto: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  botaoCancelar: { backgroundColor: '#8a9a5b', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 },
});
