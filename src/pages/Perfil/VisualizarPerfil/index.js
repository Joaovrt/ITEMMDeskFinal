import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { database } from '../../../config';
import { doc, getDoc } from 'firebase/firestore'; 

function VisualizarPerfil({ route, navigation }) {
    const { id } = route.params; 

    const [clienteInfo, setClienteInfo] = useState(null);

    useEffect(() => {
        const fetchClienteInfo = async () => {
            try {
                const clienteRef = doc(database, 'Clientes', id); 
                const clienteDoc = await getDoc(clienteRef);

                if (clienteDoc.exists()) {
                    const clienteData = clienteDoc.data();
                    setClienteInfo(clienteData);
                } else {
                    console.error('Documento não encontrado');
                }
            } catch (error) {
                console.error('Erro ao buscar informações do cliente:', error);
            }
        };

        fetchClienteInfo();
    }, [id]);

    const goToEditPerfil = () => {
        navigation.navigate('EditarPerfil', {
            id: id,
            nome: clienteInfo?.nome,
            email: clienteInfo?.email,
            cpf: clienteInfo?.cpf,
            telefone: clienteInfo?.telefone,
            senha: clienteInfo?.senha,
            imagem: clienteInfo?.imagem,
        });
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.container}>
                <Text style={styles.label}>Nome Completo:</Text>
                <Text style={styles.data}>{clienteInfo?.nome}</Text>
    
                <Text style={styles.label}>E-mail:</Text>
                <Text style={styles.data}>{clienteInfo?.email}</Text>
    
                <Text style={styles.label}>CPF:</Text>
                <Text style={styles.data}>{clienteInfo?.cpf}</Text>
    
                <Text style={styles.label}>Telefone:</Text>
                <Text style={styles.data}>{clienteInfo?.telefone}</Text>
    
                <Text style={styles.label}>Senha:</Text>
                <Text style={styles.data}>{clienteInfo?.senha}</Text>
    
                <Image 
                    source={{ uri: clienteInfo?.imagem }} 
                    style={styles.profileImage}
                />
    
                <TouchableOpacity style={styles.button} onPress={goToEditPerfil}>
                    <Text style={styles.buttonText}>Ir para Edição</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: "#263868"
    },
    container: {
        padding: 20,
        marginTop: 50,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: "#99CC6A"
    },
    data: {
        fontSize: 16,
        marginTop: 1,
        marginBottom: 5,
        color: "#222",
        backgroundColor: "#E0E0E0",  
        padding: 5,  
        borderRadius: 5, 
        borderWidth: 0.5,  
        borderColor: "#777"  
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginVertical: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#99CC6A",
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: "#FFF",
        fontWeight: 'bold',
        fontSize: 16
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
});

export default VisualizarPerfil;