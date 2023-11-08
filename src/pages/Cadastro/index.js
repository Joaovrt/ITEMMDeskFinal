import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Button, Alert } from "react-native";
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { database } from "../../config";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Cadastro({ navigation }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [imagem, setImagem] = useState("");
    const [senha, setSenha] = useState("");

    useEffect(() => {
        // Solicitar permissões no carregamento do componente
        requestGalleryPermission();
    }, []);

    const requestGalleryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permissão negada para acessar a galeria de imagens.');
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            // `result.assets[0].uri` contém o URI da imagem selecionada.
            console.log('Imagem selecionada:', result.assets[0].uri);
            setImagem(result.assets[0].uri); // Atualize o estado da imagem com o URI selecionado.
        }
    };

    const uploadImageAndAdd = async () => {
        if (!imagem) {
            Alert.alert("Selecione uma imagem antes de prosseguir.");
            return;
        }

        const storage = getStorage();
        const storageRef = ref(storage, 'uploads/' + Date.now() + '.jpg');

        try {
            const response = await fetch(imagem);
            const blob = await response.blob();
            await uploadBytes(storageRef, blob);

            // Após o upload bem-sucedido, obtenha a URL de download da imagem
            const downloadURL = await getDownloadURL(storageRef);

            // Continue com a adição do documento ao Firebase Firestore, usando a URL de download
            add(downloadURL);
        } catch (error) {
            console.error("Erro ao fazer o upload da imagem:", error);
            Alert.alert("Erro ao fazer o upload da imagem. Tente novamente. Erro: " + error.message);
        }
    };

    const add = (imagemURL) => {
        if (!AllFieldsAreFilled()) {
            Alert.alert("Preencha todos os campos");
            return;
        } else if (!isValidEmail(email)) {
            Alert.alert("Por favor, insira um e-mail válido");
            return;
        } else if (!isValidPassword(senha)) {
            Alert.alert("A senha deve ter pelo menos 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial");
            return;
        } else if (!isValidCPF(cpf)) {
            Alert.alert("O CPF deve ter 11 dígitos e conter apenas números");
            return;
        } else if (!isValidTelefone(telefone)) {
            Alert.alert("O telefone deve ter no mínimo 10 dígitos e conter apenas números");
            return;
        } else {
            const dataAtual = Timestamp.now();

            console.log("Adicionando documento ao Firestore...");

            addDoc(collection(database, "Clientes"), {
                nome: nome,
                email: email,
                cpf: cpf,
                telefone: telefone,
                senha: senha,
                registro: "Cliente",
                imagem: imagemURL,  // Use a URL da imagem aqui
            })
            .then(() => {
                console.log("Documento adicionado com sucesso.");
                navigation.navigate("SignIn");
            })
            .catch((error) => {
                console.error("Erro ao adicionar documento ao Firestore:", error);
                Alert.alert("Erro ao adicionar o documento ao Firestore. Tente novamente.");
            });
        }
    };

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
            email: email,
            cpf: cpf,
            telefone: telefone,
            senha: senha,
        };
        for (let item in obj) {
            if (obj[item] == null || obj[item] == "" || obj[item] == undefined) {
                return false;
            }
        }
        return true;
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