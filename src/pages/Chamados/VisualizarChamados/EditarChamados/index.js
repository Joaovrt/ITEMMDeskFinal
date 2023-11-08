import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { database } from "../../../../config";
import { Ionicons } from '@expo/vector-icons';

export default function EditarChamados({ navigation, route }) {
    const [departamento, setDepartamento] = useState("");
    const [categoria, setCategoria] = useState("");
    const [assunto, setAssunto] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [prazo, setPrazo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [status, setStatus] = useState("");
    const [atendente, setAtendente] = useState("");
    const [departamentos, setDepartamentos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [atendentes, setAtendentes] = useState([]);

    useEffect(() => {
        if (departamento) {
            const fetchAtendentes = async () => {
                try {
                    const atendenteData = await getDocs(collection(database, "Atendentes"));
                    const deptoAtendentes = atendenteData.docs.filter(doc => doc.data().departamento === departamento).map(doc => doc.data().nome);
                    setAtendentes(deptoAtendentes);
                } catch (error) {
                    console.error("Erro ao carregar atendentes:", error);
                }
            }
            fetchAtendentes();
        }
    }, [departamento]);

    useEffect(() => {
        if (route.params) {
            setDepartamento(route.params.departamento || "");
            setCategoria(route.params.categoria || "");
            setAssunto(route.params.assunto || "");
            setPrioridade(route.params.prioridade || "");
            setPrazo(route.params.prazo || "");
            setDescricao(route.params.descricao || "");
            setStatus(route.params.status || "");
            setAtendente(route.params.atribuido || ""); 

            const fetchData = async () => {
                try {
                    const deptoData = await getDocs(collection(database, "Departamento"));
                    const deptos = deptoData.docs.map(doc => doc.data().nome);
                    setDepartamentos(deptos);

                    const catData = await getDocs(collection(database, "Categoria"));
                    const cats = catData.docs.map(doc => doc.data().nome);
                    setCategorias(cats);
                } catch (error) {
                    console.error("Erro ao carregar dados:", error);
                }
            }
            fetchData();
        }
    }, []);

    function AllFieldsAreFilled() {
        let obj = {
            departamento: departamento,
            categoria: categoria,
            assunto: assunto,
            prioridade: prioridade,
            prazo: prazo,
            descricao: descricao,
            status: status,
            
        };
        for (let item in obj) {
            if (!obj[item]) {
                return false;
            }
        }
        return true;
    }

    function att() {
        if (!route.params || !route.params.id) {
            window.alert("ID não fornecido");
            return;
        }
        if (!AllFieldsAreFilled()) {
            window.alert("Preencha todos os campos");
            return;
        }
        const docRef = doc(database, "Chamados", `${route.params.id}`);
    
        const updateData = {
            departamento: departamento,
            categoria: categoria,
            assunto: assunto,
            prioridade: prioridade,
            prazo: prazo,
            descricao: descricao,
            status: status,
            atribuido: atendente
        };
        
        if (status === "Finalizado") {
            updateData.dataFinalizacao = Timestamp.now();
        }
    
        updateDoc(docRef, updateData);
    
        navigation.navigate("Chamados");
    }

    return (
        <ScrollView 
    style={{ flex: 1, backgroundColor: "#38a69d" }} 
    keyboardShouldPersistTaps="handled"
    >

      <View style={styles.container}>
        <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          <Text style={styles.label}>Departamento</Text>
                <Picker selectedValue={departamento} style={styles.picker} onValueChange={(itemValue) => setDepartamento(itemValue)}>
                    <Picker.Item label="Selecione" value="" />
                    {departamentos.map((depto, index) => (
                        <Picker.Item key={index} label={depto} value={depto} />
                    ))}
                </Picker>
                <Text style={styles.label}>Categoria</Text>
                <Picker selectedValue={categoria} style={styles.picker} onValueChange={(itemValue) => setCategoria(itemValue)}>
                    <Picker.Item label="Selecione" value="" />
                    {categorias.map((cat, index) => (
                        <Picker.Item key={index} label={cat} value={cat} />
                    ))}
                </Picker>
                <Text style={styles.label}>Assunto</Text>
                <TextInput style={styles.input} placeholder="Digite..." onChangeText={setAssunto} value={assunto} />

                <Text style={styles.label}>Prioridade</Text>
                <Picker selectedValue={prioridade} style={styles.picker} onValueChange={(itemValue) => setPrioridade(itemValue)}>
                    <Picker.Item label="Selecione" value="" />
                    <Picker.Item label="Baixa" value="Baixa" />
                    <Picker.Item label="Média" value="Média" />
                    <Picker.Item label="Alta" value="Alta" />
                </Picker>
                <Text style={styles.label}>Prazo</Text>
                <Picker selectedValue={prazo} style={styles.picker} onValueChange={(itemValue) => setPrazo(itemValue)}>
                    <Picker.Item label="Selecione o prazo limite" value="" />
                    <Picker.Item label="Menos de 1 dia" value="Menos de 1 dia" />
                    <Picker.Item label="Menos de 3 dias" value="Menos de 3 dias" />
                    <Picker.Item label="Menos de 5 dias" value="Menos de 5 dias" />
                    <Picker.Item label="Menos de 1 semana" value="Menos de 1 semana" />
                    <Picker.Item label="Sem prazo" value="Sem prazo" />
                </Picker>
                <Text style={styles.label}>Descrição</Text>
                <TextInput style={styles.input} placeholder="Digite sua descrição!" onChangeText={setDescricao} value={descricao} />
                <Text style={styles.label}>Atribuído</Text>
                <Picker selectedValue={atendente} style={styles.picker} onValueChange={(itemValue) => setAtendente(itemValue)}>
                    <Picker.Item label="Selecione o atendente" value="" />
                    {atendentes.map((atd, index) => (
                    <Picker.Item key={index} label={atd} value={atd} />
                    ))}
                </Picker>
                <Text style={styles.label}>Status</Text>
                {atendente === "" && (
                <Text style={{color: 'red', marginBottom: 5}}>Atribua a alguém antes de alterar o status.</Text>
                )}
                <Picker
                    selectedValue={status}
                    style={styles.picker}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    enabled={atendente !== ""}
                >
                    <Picker.Item label="Selecione" value="" />
                    <Picker.Item label="Aberto" value="Aberto" />
                    <Picker.Item label="Em Andamento" value="Em Andamento" />
                    <Picker.Item label="Finalizado" value="Finalizado" />
                    <Picker.Item label="Atrasado" value="Atrasado" />
                </Picker>

          <TouchableOpacity style={styles.buttonSend} onPress={att}>
              <Text style={styles.buttonText}>Confirmar </Text>
          </TouchableOpacity>
      </View>
      </ScrollView>
  
)
}

const styles = StyleSheet.create({

  container: {
      flexGrow: 1,
      backgroundColor: "#38a69d",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 70,  
      paddingBottom: 60,
  },
  label: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 5,
      color: 'orange'
  },
  input: {
      backgroundColor: "#f8f8f8",
      width: "80%",
      padding: 10,
      borderRadius: 10,
      color: "#000",
      marginBottom: 1,
      borderColor: "#c7c7c7",
      borderWidth: 2,
      borderWidth: 0,
  },
  buttonSend: {
      backgroundColor: "orange",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 30,
      marginTop: 5,
  },
  buttonText: {
      color: "#ffffff",
      fontWeight: "bold",
     
  },
  picker: {
      backgroundColor: "#f8f8f8",
      width: "80%",
      padding: 10,
      borderRadius: 10,
      color: "#000",
      marginBottom: 1,
      borderColor: "#c7c7c7",
      borderWidth: 2,
      borderWidth: 0,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 5,
    zIndex: 1, 
},
backButtonText: {
    color: '#ffffff',
    fontWeight: "bold"
}
});