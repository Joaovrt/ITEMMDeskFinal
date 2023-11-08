import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { deleteDoc, doc } from 'firebase/firestore';
import { database } from "../../../config";
import { useUser } from '../../../contexts/UserContext'; 
import { Ionicons } from '@expo/vector-icons';

function VisualizarChamados({ route, navigation }) {
    const { id, identificador, intouext, cliente, atendente, departamento, categoria, assunto, prioridade, prazo, descricao, atribuido, status, dataCriacao, dataFinalizacao } = route.params;
    const { isClient } = useUser(); 

    const goToEditChamado = () => {
        navigation.navigate('EditarChamados', {
            id: id,
            departamento: departamento,
            categoria: categoria,
            assunto: assunto,
            prioridade: prioridade,
            prazo: prazo,
            descricao: descricao,
            atribuido: atribuido,
            status: status,
        });
    };

    async function handleDelete(id) {
        Alert.alert(
            "Excluir Chamado",
            "Tem certeza que deseja excluir este chamado?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(database, 'Chamados', id));
                            if (isClient) {
                                navigation.navigate('HomeCliente');
                            } else {
                                navigation.navigate('Chamados');
                            }
                        } catch (error) {
                            console.error("Erro ao excluir o chamado: ", error);
                        }
                    }
                }
            ]
        );
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return ""; 
        const date = timestamp.toDate();
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };
    
    const calculateDaysDifference = (startTimestamp, endTimestamp) => {
        if (!startTimestamp || !endTimestamp) return "";
        const oneDay = 24 * 60 * 60 * 1000;
        const startDate = startTimestamp.toDate();
        const endDate = endTimestamp.toDate();
        
        const difference = Math.round((endDate - startDate) / oneDay);
        
        return difference;
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
                <Text style={styles.label}>ID do Chamado:</Text>
                <Text style={styles.data}>{identificador}</Text>
    
                <Text style={styles.label}>Tipo de Chamado:</Text>
                <Text style={styles.data}>{intouext}</Text>
    
                <Text style={styles.label}>Nome:</Text>
                <Text style={styles.data}>{atendente ? atendente : cliente}</Text>
    
                <Text style={styles.label}>Departamento:</Text>
                <Text style={styles.data}>{departamento}</Text>
    
                <Text style={styles.label}>Categoria:</Text>
                <Text style={styles.data}>{categoria}</Text>
    
                <Text style={styles.label}>Assunto:</Text>
                <Text style={styles.data}>{assunto}</Text>
    
                <Text style={styles.label}>Prioridade:</Text>
                <Text style={styles.data}>{prioridade}</Text>
    
                <Text style={styles.label}>Prazo:</Text>
                <Text style={styles.data}>{prazo}</Text>
    
                <Text style={styles.label}>Descrição:</Text>
                <Text style={styles.data}>{descricao}</Text>
    
                <Text style={styles.label}>Atribuído:</Text>
                <Text style={styles.data}>{atribuido}</Text>
    
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.data}>{status}</Text>

                <Text style={styles.label}>Data de Criação:</Text>
                <Text style={styles.data}>{formatDate(dataCriacao)}</Text>
    
                {status === "Finalizado" && (
                <>
                    <Text style={styles.label}>Data de Finalização:</Text>
                    <Text style={styles.data}>{formatDate(dataFinalizacao)}</Text>
                    
                    <Text style={styles.label}>Tempo de Finalização:</Text>
                    <Text style={styles.data}>{calculateDaysDifference(dataCriacao, dataFinalizacao)} dias</Text>
                </>
            )}
    
                {!isClient && ( 
                    <TouchableOpacity style={styles.button} onPress={goToEditChamado}>
                        <Text style={styles.buttonText}>Editar Chamado</Text>
                    </TouchableOpacity>
                )}
                
                <TouchableOpacity style={styles.buttonex} onPress={() => handleDelete(id)}>
                    <Text style={styles.buttonText}>Excluir</Text>
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

export default VisualizarChamados;






