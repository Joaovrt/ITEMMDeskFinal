import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { database } from "../../config";
import { useUser } from '../../contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';

export default function SignIn() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [carregar,setCarregar]=useState(false);
    const [password, setPassword] = useState('');
    const { handleLogin } = useUser();

    const handleSignIn = async () => {
        setCarregar(true)
        const senhaHash = await Crypto.digestStringAsync(
              Crypto.CryptoDigestAlgorithm.SHA512,
              password
        );
        const clientQuery = query(
            collection(database, "Clientes"),
            where("email", "==", email),
            where("senha", "==", senhaHash)
        );

        const attendantQuery = query(
            collection(database, "Atendentes"),
            where("email", "==", email),
            where("senha", "==", senhaHash)
        );

        const adminQuery = query(
            collection(database, "Admin"),
            where("email", "==", email),
            where("senha", "==", password)
        );

        const clientSnapshot = await getDocs(clientQuery);
        const attendantSnapshot = await getDocs(attendantQuery);
        const adminSnapshot = await getDocs(adminQuery);

        if (!clientSnapshot.empty || !attendantSnapshot.empty || !adminSnapshot.empty) {
            await handleLogin(email);
            setCarregar(false)
            navigation.navigate('Main', {
                screen: 'Perfil'
            });

            setEmail('');
            setPassword('');
        } else {
            setCarregar(false)
            Alert.alert('Erro', 'E-mail ou senha incorretos.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}> Bem-vindo(a) </Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}> E-mail </Text>
                <TextInput
                    placeholder="Digite um email..."
                    style={styles.input}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                    value={email}
                />

                <Text style={styles.title}> Senha </Text>
                <TextInput
                    placeholder="Sua senha"
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />

                {!carregar && <TouchableOpacity 
                    style={styles.button}
                    onPress={handleSignIn}
                >
                    <Text style={styles.buttonText}> Acessar </Text>
                </TouchableOpacity>}

                {!carregar && <TouchableOpacity 
                    style={styles.buttonRegister}
                    onPress={() => navigation.navigate('Cadastro')}
                >
                    <Text style={styles.registerText}> Não possui uma conta? Cadastre-se</Text>
                </TouchableOpacity>}
                {carregar && <ActivityIndicator style={{marginTop:'5%'}} size="large" color="#263868" />}
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#263868',
        paddingTop: 40,
    },
    containerHeader: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff'
    },
    containerForm: {
        backgroundColor: '#fff',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    title: {
        fontSize: 20,
        marginTop: 28,
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#263868',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister: {
        marginTop: 14,
        alignSelf: 'center'
    },
    registerText: {
        color: '#a1a1a1'
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