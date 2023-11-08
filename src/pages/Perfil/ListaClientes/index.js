import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { database } from "../../../config";
import { Ionicons } from '@expo/vector-icons';

export default function ListaClientes({ navigation }) {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getDados() {
        setLoading(true);
        const collecRef = collection(database, 'Clientes');
        const snapshot = await getDocs(collecRef);
        const lista = snapshot.docs.map(doc => ({
            id: doc.id,
            nome: doc.data().nome,
        }));
        setClientes(lista);
        setLoading(false);
    }

    async function handleDelete(id) {
        try {
            await deleteDoc(doc(database, 'Clientes', id));
            getDados();
        } catch (error) {
            console.error("Erro ao excluir o cliente: ", error);
        }
    }

    useEffect(() => {
        getDados();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="orange" />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
                <FlatList
                    showsVerticalScrollIndicator={true}
                    data={clientes}
                    renderItem={({ item }) => (
                        <View style={styles.containerFlatlist}>
                            <TouchableOpacity style={styles.content}>
                                <Text style={styles.description}>
                                    {item.nome}
                                </Text>
                                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                                    <Text style={styles.deleteButtonText}>X</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={item => item.id}
                />
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#38a69D",
        paddingTop: 70,
        paddingBottom: 60,
    },
    containerFlatlist: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 5,
    },
    content: {
        width: "90%",
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#000",
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        marginBottom: 20,
        flexDirection: 'row'
    },
    description: {
        fontSize: 20,
        color: "#f8f8f8",
        fontWeight: "bold",
    },
    deleteButton: {
        marginLeft: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    buttonNew: {
        width: 60,
        height: 60,
        position: "absolute",
        bottom: 30,
        right: 20,
        backgroundColor: "orange",
        borderRadius: 20,
        alignItems: "center",
    },
    iconButton: {
        color: "#ffffff",
        fontSize: 40,
        fontWeight: "bold"
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