import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity,Button, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";
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
    const [carregar, setCarregar] = useState(false)
    
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
        const cpfStr = cpf?.replace(/[^\d]+/g, '');

        if (cpfStr === '') return false;

        if (cpfStr?.length !== 11)
            return false;

        if (cpfStr === "00000000000" ||
            cpfStr === "11111111111" ||
            cpfStr === "22222222222" ||
            cpfStr === "33333333333" ||
            cpfStr === "44444444444" ||
            cpfStr === "55555555555" ||
            cpfStr === "66666666666" ||
            cpfStr === "77777777777" ||
            cpfStr === "88888888888" ||
            cpfStr === "99999999999")
            return false;

        var soma;
        var resto;

        soma = 0;

        for (let i = 1; i <= 9; i++)
            soma += parseInt(cpfStr.substring(i - 1, i)) * (11 - i);

        resto = (soma * 10) % 11;

        if ((resto == 10) || (resto == 11)) resto = 0;

        if (resto != parseInt(cpfStr.substring(9, 10))) return false;

        soma = 0;

        for (let i = 1; i <= 10; i++)
            soma += parseInt(cpfStr.substring(i - 1, i)) * (12 - i);

        resto = (soma * 10) % 11;

        if ((resto == 10) || (resto == 11)) resto = 0;

        if (resto != parseInt(cpfStr.substring(10, 11))) return false;

        return true;
    }

    function isValidTelefone(telefone) {
        return telefone.length == 15;
    }

    function AllFieldsAreFilled() {
        let obj = {
            nome: nome,
            email: email,
            cpf: cpf,
            telefone: telefone,
            senha: senha
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
            Alert.alert("CPF invalido");
            return;
        } else if (!isValidTelefone(telefone)) {
            Alert.alert("Celular invalido");
            return;
        }
        setCarregar(true)
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
                att();
            }
        } else {
            // Se nenhuma imagem foi selecionada, você pode adicionar os dados do atendente diretamente
            att();
        }
    };

    function att() {
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
        updateDoc(docRef, updatedFields)
        .then(() => {
            setCarregar(false)
            console.log("Documento atualizado com sucesso.");
            navigation.pop(2);
        })
        .catch((error) => {
            setCarregar(false)
            console.error("Erro ao adicionar documento ao Firestore:", error);
            Alert.alert("Erro ao atualizar o documento ao Firestore. Tente novamente.");
        });
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
            setImagem(route.params.imagem|| "")
        }
    }, []);

    const formatCpf = (text) => {
        // Remove qualquer caractere não numérico do texto
        const cleanedText = text.replace(/\D/g, '');

        // Formata o CPF (###.###.###-##)
        const match = cleanedText.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
        let formattedText = '';
        if (match) {
            formattedText = match[1];
            if (match[2]) formattedText += `.${match[2]}`;
            if (match[3]) formattedText += `.${match[3]}`;
            if (match[4]) formattedText += `-${match[4]}`;
        }
        return formattedText;
    };

    const formatPhoneNumber = (phoneNumber) => {
        // Remove qualquer caractere não numérico do número de telefone
        const cleanedNumber = phoneNumber.replace(/\D/g, '');

        // Formata o número de telefone (XX) 99999-9999
        const match = cleanedNumber.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
        let formattedNumber = '';
        if (match) {
            formattedNumber = `(${match[1]})`;
            if (match[2]) formattedNumber += ` ${match[2]}`;
            if (match[3]) formattedNumber += `-${match[3]}`;
        }
        return formattedNumber;
    };

    const handleCpfChange = (text) => {
        const formattedCpf = formatCpf(text);
        setCpf(formattedCpf);
    };

    const handlePhoneChange = (text) => {
        const formattedNumber = formatPhoneNumber(text);
        setTelefone(formattedNumber);
    };

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

          <Text style={styles.label}>Celular</Text>
          <TextInput 
                    style={styles.input} 
                    placeholder="Digite com o DDD" 
                    onChangeText={handlePhoneChange} 
                    value={telefone} 
                    keyboardType="numeric"
                    maxLength={15}
                />
          <Text style={styles.label}>CPF</Text>
          <TextInput style={styles.input} placeholder="Digite..." onChangeText={handleCpfChange} value={cpf} keyboardType="numeric" maxLength={14}/>
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

          {!carregar &&<TouchableOpacity style={styles.buttonSend} onPress={uploadImageAndAtt}>
              <Text style={styles.buttonText}>Atualizar</Text>
          </TouchableOpacity>}
          {carregar &&
                    <View style={{marginTop:15}}>
                        <ActivityIndicator size="large" color="#99CC6A" />
                    </View>
                }
      </View>
  
)
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#263868',
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
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
        backgroundColor: '#99CC6A',
        borderRadius: 5,
        zIndex: 1 
    },
    backButtonText: {
        color: '#ffffff',
        fontWeight: "bold"
    }
});