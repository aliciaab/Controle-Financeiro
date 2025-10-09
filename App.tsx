import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';

import Grafico from './components/Grafico';
import * as Database from './services/Database';
import Formulario from './components/Formulario';
import ListaRegistros from './components/ListaRegistros';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Estado para controle da ordenação
  const [ordenacao, setOrdenacao] = useState('recentes');

  useEffect(() => {
    const init = async () => {
      const dados = await Database.carregarDados();
      setRegistros(dados);
      setCarregando(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!carregando) {
      Database.salvarDados(registros);
    }
  }, [registros, carregando]);

  const handleSave = (valor, categoria, descricao) => {
    const valorNum = parseFloat(String(valor).replace(',', '.'));
    if (isNaN(valorNum)) {
      Alert.alert("Erro", "Informe um valor numérico válido");
      return;
    }
    if (!categoria.trim()) {
      Alert.alert("Erro", "Informe a categoria");
      return;
    }

    if (editingId) {
      const registrosAtualizados = registros.map(reg =>
        reg.id === editingId ? { ...reg, valor: valorNum, categoria, descricao } : reg
      );
      setRegistros(registrosAtualizados);
    } else {
      const novoRegistro = {
        id: new Date().getTime(),
        valor: valorNum,
        categoria,
        descricao,
        data: new Date().toLocaleDateString(),
      };
      setRegistros([...registros, novoRegistro]);
    }
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setRegistros(registros.filter(reg => reg.id !== id));
  };

  const handleEdit = (registro) => {
    setEditingId(registro.id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const exportarDados = async () => {
  const fileUri = Database.fileUri;

  if (Platform.OS === 'web') {
    const jsonString = JSON.stringify(registros, null, 2);
    if (registros.length === 0) {
      return Alert.alert("Aviso", "Nenhum dado para exportar.");
    }
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dados_financeiros.json';
    a.click();
    URL.revokeObjectURL(url);
  } else {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      return Alert.alert("Aviso", "Nenhum dado para exportar.");
    }
    if (!(await Sharing.isAvailableAsync())) {
      return Alert.alert("Erro", "Compartilhamento não disponível.");
    }
    await Sharing.shareAsync(fileUri);
  }
};

  // Ordenação da lista de registros com base no estado 'ordenacao'
  let registrosExibidos = [...registros];
  if (ordenacao === 'maior_valor') {
    registrosExibidos.sort((a, b) => b.valor - a.valor);
  } else {
    registrosExibidos.sort((a, b) => b.id - a.id);
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
      <Text style={styles.titulo}>Controle Financeiro</Text>
      <Grafico registros={registrosExibidos} />  {/* <-- gráfico aqui */}
      <Text style={styles.subtituloApp}>Gerencie suas finanças facilmente</Text>
        <Formulario
          onSave={handleSave}
          onCancel={handleCancel}
          registroEmEdicao={registros.find(r => r.id === editingId) || null}
        />

        <View style={styles.botoesOrdenacaoContainer}>
        <TouchableOpacity style={styles.botaoOrdenacao} onPress={() => setOrdenacao('recentes')}>
        <Text style={styles.botaoTextoOrdenacao}>Mais Recentes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoOrdenacao} onPress={() => setOrdenacao('maior_valor')}>
        <Text style={styles.botaoTextoOrdenacao}>Maior Valor</Text>
        </TouchableOpacity>
        </View>


        <ListaRegistros
          registros={registrosExibidos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <View style={styles.card}>
          <Text style={styles.subtitulo}>Exportar Dados</Text>
          <TouchableOpacity style={styles.botaoExportar} onPress={exportarDados}>
            <Text style={styles.botaoTexto}>Exportar arquivo dados_financeiros.json</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0, backgroundColor: '#f5f7f3' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f7f3' },
  titulo: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#405d27' },
 subtituloApp: {
  textAlign: 'center',
  fontSize: 16,
  color: '#66794d',
  marginTop: 30, 
  marginBottom: 20,
  fontStyle: 'italic',
},
botoesOrdenacaoContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginBottom: 10,
  gap: 10,
},
botaoOrdenacao: {
  backgroundColor: '#587330',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  elevation: 3,
},
botaoTextoOrdenacao: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 14,
},
  card: { backgroundColor: '#e6f0d4', borderRadius: 12, padding: 20, marginHorizontal: 15, marginBottom: 20, elevation: 6, shadowColor: '#405d27', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  subtitulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#405d27' },
  botaoExportar: { backgroundColor: '#587330', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 5 },
  botaoTexto: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
