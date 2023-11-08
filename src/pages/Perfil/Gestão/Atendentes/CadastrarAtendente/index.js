import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Button } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc, Timestamp, query, where } from 'firebase/firestore';
import { database } from "../../../../../config";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function CadastrarAtendente({ navigation }) {
    const [nome, setNome] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [departamentos, setDepartamentos] = useState([]);
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [imagem, setImagem] = useState("");
    const [senha, setSenha] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const deptoData = await getDocs(collection(database, "Departamento"));
                const deptos = deptoData.docs.map(doc => doc.data().nome);

                setDepartamentos(deptos);
                
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        }
        fetchData();
        
    },[]);

    function capitalizeName(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    function isValidEmail(email) {
        const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return pattern.test(email);
    }

    function isValidPassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar;
    }

    function isValidCPF(cpf) {
        return cpf.length === 11 && /^\d+$/.test(cpf);
    }

    function isValidTelefone(telefone) {
        return telefone.length >= 10 && /^\d+$/.test(telefone);
    }

    function AllFieldsAreFilled() {
        let obj = {
            nome: nome,
            departamento: departamento,
            email: email,
            cpf: cpf,
            telefone: telefone,
            senha: senha,
            //imagem: imagem,
        };
        for (let item in obj) {
            if (obj[item] == null || obj[item] == "" || obj[item] == undefined) {
                return false;
            }
        }
        return true;
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.cancelled) {
            setImagem(result.uri);
        }
    };

    const uploadImageAndAdd = async () => {
        if (imagem) {
            const storage = getStorage();
            const storageRef = ref(storage, 'uploads/' + Date.now() + '.jpg');
            const result = await fetch(imagem);
            const blob = await result.blob();
    
            await uploadBytes(storageRef, blob).catch((error) => {
                console.error("Erro ao carregar a imagem:", error);
            });
    
            const downloadURL = await getDownloadURL(storageRef).catch((error) => {
                console.error("Erro ao obter URL de download:", error);
            });
    
            if (downloadURL) {
                setImagem(downloadURL);
    
                // Agora você pode adicionar os dados do atendente, incluindo a URL da imagem
                add();
            }
        } else {
            // Se nenhuma imagem foi selecionada, você pode adicionar os dados do atendente diretamente
            add();
        }
    };

    function add() {
        if (!AllFieldsAreFilled()) {
            window.alert("Preencha todos os campos");
            return;
        } else if (!isValidEmail(email)) {
            window.alert("Por favor, insira um e-mail válido");
            return;
        } else if (!isValidPassword(senha)) {
            window.alert("A senha deve ter pelo menos 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial");
            return;
        } else if (!isValidCPF(cpf)) {
            window.alert("O CPF deve ter 11 dígitos e conter apenas números");
            return;
        } else if (!isValidTelefone(telefone)) {
            window.alert("O telefone deve ter no mínimo 10 dígitos e conter apenas números");
            return;
        } else {
            const dataAtual = Timestamp.now();
    
            // Adicione os dados do atendente, incluindo a URL da imagem
            addDoc(collection(database, "Atendentes"), {
                nome: nome,
                email: email,
                departamento: departamento,
                cpf: cpf,
                telefone: telefone,
                senha: senha,
                registro: "Atendente",
                imagem: imagem, // Inclua a URL da imagem aqui
            });
            navigation.navigate("SignIn");
        }
    }


    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#38a69d" }}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.container}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Digite..." 
                    onChangeText={(text) => setNome(capitalizeName(text))} 
                    value={nome} 
                />

                <Text style={styles.label}>Departamento</Text>
                <Picker selectedValue={departamento} style={styles.picker} onValueChange={(itemValue) => setDepartamento(itemValue)}>
                    <Picker.Item label="Selecione" value="" />
                    {departamentos.map((depto, index) => (
                        <Picker.Item key={index} label={depto} value={depto} />
                    ))}
                </Picker>

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} placeholder="Digite..." onChangeText={(text) => setEmail(text.toLowerCase())} value={email} />

                <Text style={styles.label}>Cpf</Text>
                <TextInput style={styles.input} placeholder="Digite..." onChangeText={setCpf} value={cpf} keyboardType="numeric" />

                <Text style={styles.label}>Telefone</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Digite com o DDD" 
                    onChangeText={setTelefone} 
                    value={telefone} 
                    keyboardType="numeric"
                />

                

                <Text style={styles.label}>Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite..."
                    onChangeText={setSenha}
                    value={senha}
                    secureTextEntry={true}
                />

                {imagem && <Image source={{ uri: imagem }} style={{width: 100, height: 100}} />}
                <Button title="Escolher Imagem" onPress={pickImage} />

                <TouchableOpacity style={styles.buttonSend} onPress={uploadImageAndAdd}>
                    <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
                
               
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: 'orange'
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
        backgroundColor: "orange",
        paddingHorizontal: 35,
        paddingVertical: 15,
        borderRadius: 40,
        marginTop: 60
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
        backgroundColor: 'orange',
        borderRadius: 5,
        zIndex: 1  
    },
    backButtonText: {
        color: '#ffffff',
        fontWeight: "bold"
    }
});