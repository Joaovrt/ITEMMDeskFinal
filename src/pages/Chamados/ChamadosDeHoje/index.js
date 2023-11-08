import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Image } from "react-native";
import { getFirestore, collection, getDocs, query, where, Timestamp } from 'firebase/firestore'
import { database } from "../../../config";
import { Ionicons } from '@expo/vector-icons';

export default function ChamadosDeHoje({ navigation }) {
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(false);

    function getStartAndEndOfToday() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        return {
            start: Timestamp.fromDate(startOfDay),
            end: Timestamp.fromDate(endOfDay)
        }
    }

    async function getDados() {
        setLoading(true);
        const collecRef = collection(database, 'Chamados');
        const today = getStartAndEndOfToday();
        const q = query(
            collecRef,
            where("dataCriacao", ">=", today.start),
            where("dataCriacao", "<=", today.end)
        );
        
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
                <Text style={styles.headerTitle}>Chamados de Hoje</Text>
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
        backgroundColor: "#38a69D",
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
        color: 'orange',
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
        backgroundColor: 'orange',
        borderRadius: 5,
        zIndex: 1  
    },
    backButtonText: {
        color: '#ffffff',
        fontWeight: "bold"
    }
});