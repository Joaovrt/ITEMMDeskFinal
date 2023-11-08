import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity,Button, StyleSheet, Image } from "react-native";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc, updateDoc  } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database } from "../../../../config";
import * as ImagePicker from 'expo-image-picker'; // Importe o ImagePicker
import { Ionicons } from '@expo/vector-icons';

export default function EditarPerfil({ navigation, route }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [imagem, setImagem] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");
    const [originalSenha, setOriginalSenha] = useState("");
    const [originalCpf, setOriginalCpf] = useState("");
    const [originalTelefone, setOriginalTelefone] = useState("");
    const [originalNome, setOriginalNome] = useState("");
    
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
        };
        for (let item in obj) {
            if (!obj[item]) {
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
    
        if (!result.canceled) {
            setImagem(result.assets[0].uri);
        }
    };

    const uploadImageAndAtt = async () => {
        if (imagem) {
            const storage = getStorage();
            const storageRef = ref(storage, 'uploads/' + route.params.id + '.jpg'); // Usar o ID do usuário
            const result = await fetch(imagem);
            const blob = await result.blob();
    
            await uploadBytes(storageRef, blob).catch((error) => {
                console.error('Erro ao carregar a imagem:', error);
            });
    
            const downloadURL = await getDownloadURL(storageRef).catch((error) => {
                console.error('Erro ao obter URL de download:', error);
            });
    
            if (downloadURL) {
                setImagem(downloadURL);
    
                // Atualize o documento do cliente com a nova imagem
                const docRef = doc(database, 'Clientes', `${route.params.id}`);
                await updateDoc(docRef, {
                    imagem: downloadURL,
                });
    
                att();
            }
        } else {
            att();
        }
    };

    function att() {
        if (!AllFieldsAreFilled()) {
            window.alert("Preencha todos os campos");
            return;
        }
        if (nome !== originalNome && nome.trim() === "") {
            window.alert("Por favor, insira um nome válido");
            return;
        }
        if (email !== originalEmail && !isValidEmail(email)) {
            window.alert("Por favor, insira um e-mail válido");
            return;
        } 
        if (senha !== originalSenha && !isValidPassword(senha)) {
            window.alert("A senha deve ter pelo menos 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial");
            return;
        } 
        if (cpf !== originalCpf && !isValidCPF(cpf)) {
            window.alert("O CPF deve ter 11 dígitos e conter apenas números");
            return;
        } 
        if (telefone !== originalTelefone && !isValidTelefone(telefone)) {
            window.alert("O telefone deve ter no mínimo 10 dígitos e conter apenas números");
            return;
        }
    
        const updatedFields = {
            nome: nome !== originalNome ? nome : undefined,
            email: email !== originalEmail ? email : undefined,
            telefone: telefone !== originalTelefone ? telefone : undefined,
            cpf: cpf !== originalCpf ? cpf : undefined,
            senha: senha !== originalSenha ? senha : undefined,
            imagem: imagem 
        };
    
        Object.keys(updatedFields).forEach(key => updatedFields[key] === undefined && delete updatedFields[key]);
    
        const docRef = doc(database, "Clientes", `${route.params.id}`);
        updateDoc(docRef, updatedFields);
        
        navigation.navigate("SignIn");
    }

    useEffect(() => {
        if (route.params) {
            setNome(route.params.nome || "");
            setEmail(route.params.email || "");
            setTelefone(route.params.telefone || "");
            setCpf(route.params.cpf || "");
            setSenha(route.params.senha || "");
            setOriginalNome(route.params.nome || "");
            setOriginalEmail(route.params.email || "");
            setOriginalTelefone(route.params.telefone || "");
            setOriginalCpf(route.params.cpf || "");
            setOriginalSenha(route.params.senha || "");
            
        }
    }, []);

    return (
      <View style={styles.container}>
        <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput 
                    style={styles.input} 
                    placeholder="Digite..." 
                    onChangeText={(text) => setNome(capitalizeName(text))} 
                    value={nome} 
                />
          <Text style={styles.label}>E-mail</Text>
          <TextInput style={styles.input} placeholder="Digite..." onChangeText={(text) => setEmail(text.toLowerCase())} value={email} />

          <Text style={styles.label}>Telefone</Text>
          <TextInput 
                    style={styles.input} 
                    placeholder="Digite com o DDD" 
                    onChangeText={setTelefone} 
                    value={telefone} 
                    keyboardType="numeric"
                />
          <Text style={styles.label}>CPF</Text>
          <TextInput style={styles.input} placeholder="Digite..." onChangeText={setCpf} value={cpf} keyboardType="numeric" />
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

          <TouchableOpacity style={styles.buttonSend} onPress={uploadImageAndAtt}>
              <Text style={styles.buttonText}>Atualizar</Text>
          </TouchableOpacity>
      </View>
  
)
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#38a69D',
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