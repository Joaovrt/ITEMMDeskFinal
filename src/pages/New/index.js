import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { database } from "../../config";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc, Timestamp, query, where } from 'firebase/firestore';
import { useUser } from '../../contexts/UserContext'; 
import { Ionicons } from '@expo/vector-icons';


export default function New({ navigation }) {
    const [identificador, setIdentificador] = useState("");
    const [cliente, setCliente] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [categoria, setCategoria] = useState("");
    const [assunto, setAssunto] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [prazo, setPrazo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [departamentos, setDepartamentos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [clientName, setClientName] = useState('');
    const { userEmail } = useUser();
    const [isAtendente, setIsAtendente] = useState(false);
    const [atendenteName, setAtendenteName] = useState('');

    const getNumberOfChamados = async () => {
        try {
            const chamadosSnapshot = await getDocs(collection(database, "Chamados"));
            return chamadosSnapshot.size;
        } catch (error) {
            console.error("Erro ao obter número de chamados:", error);
            return 0; 
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const deptoData = await getDocs(collection(database, "Departamento"));
                const deptos = deptoData.docs.map(doc => doc.data().nome);

                const catData = await getDocs(collection(database, "Categoria"));
                const cats = catData.docs.map(doc => doc.data().nome);

                setDepartamentos(deptos);
                setCategorias(cats);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        }

        const fetchUserType = async () => {
            const qCliente = query(collection(database, "Clientes"), where("email", "==", userEmail));
            const qAtendente = query(collection(database, "Atendentes"), where("email", "==", userEmail));

            const clientSnapshot = await getDocs(qCliente);
            const atendenteSnapshot = await getDocs(qAtendente);

            if (!clientSnapshot.empty) {
                setClientName(clientSnapshot.docs[0].data().nome);
            } else if (!atendenteSnapshot.empty) {
                setIsAtendente(true);
                setAtendenteName(atendenteSnapshot.docs[0].data().nome);
            }
        }


        fetchData();
        fetchUserType();
    }, [userEmail]);

    const AllFieldsAreFilled = () => {
        const obj = {
            cliente: clientName,
            departamento: departamento,
            categoria: categoria,
            assunto: assunto,
            prioridade: prioridade,
            prazo: prazo,
            descricao: descricao
        };
        
        if (isAtendente) {
            delete obj.cliente;
        }
    
        return Object.values(obj).every(value => value);
    }

    const resetFields = () => {
        setIdentificador("");
        setCliente("");
        setDepartamento("");
        setCategoria("");
        setAssunto("");
        setPrioridade("");
        setPrazo("");
        setDescricao("");
    };

    const add = async () => {
        try {
            if (!AllFieldsAreFilled()) {
                window.alert("Preencha todos os campos");
                return;
            } else {
                const dataAtual = Timestamp.now();
                const tipoChamado = isAtendente ? 'Interno' : 'Externo';
                const counterDocRef = doc(database, "Config", "chamadosCounter");
                const counterSnapshot = await getDoc(counterDocRef);
                let currentId = counterSnapshot.exists ? counterSnapshot.data().currentId : 0;
    
                currentId += 1;
    
                let chamadoData = {
                    identificador: currentId,
                    intouext: tipoChamado,
                    cliente: clientName,
                    departamento: departamento,
                    categoria: categoria,
                    assunto: assunto,
                    prioridade: prioridade,
                    prazo: prazo,
                    descricao: descricao,
                    atribuido: "",
                    status: "Aberto",
                    dataCriacao: dataAtual
                };
    
                if (isAtendente) {
                    chamadoData.atendente = atendenteName;
                }
    
                await addDoc(collection(database, "Chamados"), chamadoData);
                await setDoc(counterDocRef, { currentId: currentId });
    
                resetFields();
    
                if (isAtendente) {
                    navigation.navigate("Home");
                } else {
                    navigation.navigate("HomeCliente");
                }
            }
        } catch (error) {
            console.error("Erro ao adicionar chamado:", error);
        }
    };

    return (
        <ScrollView style={{flex: 1, backgroundColor: "#263868"}}>
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
                <TouchableOpacity style={styles.buttonSend} onPress={add}>
                    <Text style={styles.buttonText}>Criar Chamado</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 70,  
        paddingBottom: 60,
    },
    label: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: '#99CC6A'
    },
    input: {
        backgroundColor: "#f8f8f8",
        width: "80%",
        padding: 10,
        borderRadius: 10,
        color: "#000",
        marginBottom: 10,
        borderColor: "#c7c7c7",
        borderWidth: 1,
    },
    buttonSend: {
        backgroundColor: "#99CC6A",
        paddingHorizontal: 35,
        paddingVertical: 15,
        borderRadius: 40,
        marginTop: 15
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    picker: {
        backgroundColor: "#f8f8f8",
        width: "80%",
        paddingHorizontal: 15,
        borderRadius: 10,
        color: "#000",
        marginBottom: 10,
        borderColor: "#c7c7c7",
        borderWidth: 1,
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
        backgroundColor: '#99CC6A',
        borderRadius: 5,
        zIndex: 1  
    },
    backButtonText: {
        color: '#ffffff',
        fontWeight: "bold"
    }
});