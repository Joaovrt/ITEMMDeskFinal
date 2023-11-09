import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { database } from "../../../../config";
import { Ionicons } from '@expo/vector-icons';

export default function Categorias({ navigation }) {
    const [categoria, setCategoria] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getDados() {
        setLoading(true);
        const collecRef = collection(database, 'Categoria');
        const snapshot = await getDocs(collecRef);
        const lista = snapshot.docs.map(doc => ({
            id: doc.id,
            nome: doc.data().nome,
        }));
        setCategoria(lista);
        setLoading(false);
    }

    async function handleDelete(id) {
        Alert.alert(
            "Excluir Categoria",
            "Tem certeza que deseja excluir?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                { 
                    text: "OK", 
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await deleteDoc(doc(database, 'Categoria', id));
                            getDados();
                        } catch (error) {
                            setLoading(false);
                            console.error("Erro ao excluir a categoria: ", error);
                        }
                    } 
                }
            ],
            { cancelable: true }
        );
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getDados(); // Chama a função de busca de dados sempre que a tela está focada
        });

        // Cleanup da inscrição do evento quando o componente é desmontado
        return unsubscribe;
    }, [navigation]); 

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#99CC6A" />
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
                    data={categoria}
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
                <TouchableOpacity
                    style={styles.buttonNew}
                    onPress={() => navigation.navigate("CadastrarCategoria")}
                >
                    <Text style={styles.iconButton}>+</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#263868",
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
        backgroundColor: "#99CC6A",
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
        backgroundColor: '#99CC6A',
        borderRadius: 5,
        zIndex: 1  
    },
    backButtonText: {
        color: '#ffffff',
        fontWeight: "bold"
    }
});