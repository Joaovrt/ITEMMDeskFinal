import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { deleteDoc, doc } from 'firebase/firestore';
import { database } from "../../../../../config";
import { Ionicons } from '@expo/vector-icons';

function VisualizarAtendente({ route, navigation }) {
    const { id, nome, telefone, email, cpf, departamento, senha, imagem } = route.params;

    const goToEditProfile = () => {
        navigation.navigate('EditarAtendente', {
            id: id,
            nome: nome,
            telefone: telefone,
            email: email,
            cpf: cpf,
            departamento: departamento,
            imagem: imagem,
            senha: senha,
        });
    };

    async function handleDelete(id) {
        Alert.alert(
            "Excluir Atendente",
            "Tem certeza que deseja excluir este atendente?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                { 
                    text: "Confirmar", 
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(database, 'Atendentes', id));
                            navigation.navigate('Gestão');
                        } catch (error) {
                            console.error("Erro ao excluir o atendente: ", error);
                        }
                    }
                }
            ]
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.data}>{nome}</Text>

            <Text style={styles.label}>E-mail:</Text>
            <Text style={styles.data}>{email}</Text>

            <Text style={styles.label}>CPF:</Text>
            <Text style={styles.data}>{cpf}</Text>

            <Text style={styles.label}>Telefone:</Text>
            <Text style={styles.data}>{email}</Text>

            <Text style={styles.label}>Telefone:</Text>
            <Text style={styles.data}>{cpf}</Text>

            <Text style={styles.label}>Departamento:</Text>
            <Text style={styles.data}>{departamento}</Text>

            <Text style={styles.label}>Senha:</Text>
            <Text style={styles.data}>{senha}</Text>

            <TouchableOpacity style={styles.button} onPress={goToEditProfile}>
                <Text style={styles.buttonText}>Editar Atendente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonex} onPress={() => handleDelete(id)}>
                <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 70,  
        paddingBottom: 60,
        backgroundColor: "#263868"
    },
    contentContainer: {
        padding: 20,
        paddingTop: 70,
        paddingBottom: 60,
        backgroundColor: "#263868"
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
    button: {
        marginTop: 20,
        backgroundColor: "#99CC6A",
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonex: {
        marginTop: 20,
        backgroundColor: "red",
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
    backButtonText: {
        color: '#ffffff',
        fontWeight: "bold"
    }
});

export default VisualizarAtendente;