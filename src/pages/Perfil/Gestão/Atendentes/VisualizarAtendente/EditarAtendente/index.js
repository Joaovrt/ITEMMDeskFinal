import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { database } from "../../../../../../config";
import { Ionicons } from '@expo/vector-icons';

export default function EditarAtendente({ navigation, route }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cpf, setCpf] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [departamentos, setDepartamentos] = useState([]);
    const [imagem, setImagem] = useState("");
    const [senha, setSenha] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");
    const [originalSenha, setOriginalSenha] = useState("");
    const [originalCpf, setOriginalCpf] = useState("");
    const [originalTelefone, setOriginalTelefone] = useState("");
    const [originalNome, setOriginalNome] = useState("");

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
        if(imagem) {
            const storage = getStorage();
            const storageRef = ref(storage, 'uploads/' + route.params.id + '.jpg');  
            const result = await fetch(imagem);
            const blob = await result.blob();
        
            await uploadBytes(storageRef, blob).catch(error => {
                console.error("Erro ao carregar a imagem:", error);
            });
        
            const downloadURL = await getDownloadURL(storageRef).catch(error => {
                console.error("Erro ao obter URL de download:", error);
            });
        
            if (downloadURL) {
                setImagem(downloadURL);
                
                // Atualizar imediatamente no Firestore
                const docRef = doc(database, "Atendentes", `${route.params.id}`);
                await updateDoc(docRef, {
                    imagem: downloadURL
                });
            }
        }
        att();  
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
        const docRef = doc(database, "Atendentes", `${route.params.id}`);
        updateDoc(docRef, {
            nome: nome,
            email: email,
            telefone: telefone,
            cpf: cpf,
            departamento: departamento,
            senha: senha,
        });
        navigation.navigate("Gestão");
    }

    useEffect(() => {
        if (route.params) {
            setNome(route.params.nome || "");
            setEmail(route.params.email || "");
            setTelefone(route.params.telefone || "");
            setCpf(route.params.cpf || "");
            setDepartamento(route.params.departamento || "");
            setSenha(route.params.senha || "");
            setOriginalNome(route.params.nome || "");
            setOriginalEmail(route.params.email || "");
            setOriginalTelefone(route.params.telefone || "");
            setOriginalCpf(route.params.cpf || "");
            setOriginalSenha(route.params.senha || "");
        }
    }, []);

    return (
        <ScrollView 
        contentContainerStyle={{ 
          flexGrow: 1, 
          alignItems: "center", 
          justifyContent: "center", 
          paddingBottom: 60, 
          paddingTop: 70 
        }}
        style={styles.container}
      >
        <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          <Text style={styles.label}>Nome</Text>
          <TextInput
              style={styles.input}
              placeholder="Digite aqui..."
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

          <Text style={styles.label}>Departamento</Text>
                <Picker selectedValue={departamento} style={styles.picker} onValueChange={(itemValue) => setDepartamento(itemValue)}>
                    <Picker.Item label="Selecione" value="" />
                    {departamentos.map((depto, index) => (
                        <Picker.Item key={index} label={depto} value={depto} />
                    ))}
                </Picker>
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
              <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
      </ScrollView>
  
)
}

const styles = StyleSheet.create({

  container: {
      backgroundColor: "#38a69d",
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
    zIndex: 1  
},
backButtonText: {
    color: '#ffffff',
    fontWeight: "bold"
}
});