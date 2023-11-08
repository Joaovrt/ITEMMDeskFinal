import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Image } from "react-native";
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'
import { database } from "../../../config";
import { Ionicons } from '@expo/vector-icons';

export default function ChamadosAbertos({ navigation }) {
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getDados() {
        setLoading(true);
        const collecRef = collection(database, 'Chamados');
        const q = query(collecRef, where("status", "==", "Aberto"));
        
        let lista = [];
        await getDocs(q).then((snapshot) => {
            snapshot.docs.forEach(doc => {
                let obj = {
                    id: doc.id,
                    ...doc.data()
                };
                lista.push(obj);
            });
            
            lista.sort((a, b) => a.identificador - b.identificador);
            
            setChamados(lista);
        });
        setLoading(false);
    }

    useEffect(() => {
        getDados();
    }, []);

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
                <Text style={styles.headerTitle}>Chamados Abertos</Text>
                <FlatList
                    showsVerticalScrollIndicator={true}
                    data={chamados}
                    renderItem={({ item }) => (
                        <View style={styles.containerFlatlist}>
                            <TouchableOpacity 
                                style={styles.content}
                                onPress={() => navigation.navigate("VisualizarChamados", item)}>
                                <Text style={styles.description}>ID: {item.identificador}</Text>
                                <Text style={styles.description}>Tipo: {item.intouext}</Text>
                                <Text style={styles.description}>Aberto por: {item.atendente ? item.atendente : item.cliente}</Text>
                                <Text style={styles.description}>Assunto: {item.assunto}</Text>
                                <Text style={styles.description}>Status: {item.status}</Text>
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
        backgroundColor: "#263868",
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
        color: '#99CC6A',
        marginTop: 60,
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
        justifyContent: 'center',
        backgroundColor: "#000",
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        marginBottom: 20,
    },
    description: {
        fontSize: 20,
        color: "#f8f8f8",
        fontWeight: "bold",
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