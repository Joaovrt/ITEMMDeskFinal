
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Image } from "react-native";
import { getFirestore, collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { database } from "../../../../config";
import { Ionicons } from '@expo/vector-icons';

export default function Atendentes({ navigation }) {
    const [atendentes, setAtendentes] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getDados() {
        setLoading(true)
        const collecRef = collection(database, 'Atendentes');
        let lista = [];
        await getDocs(collecRef).then((snapshot) => {
            for (let i = 0; i < snapshot.docs.length; i++) {
                let obj = {
                    id: snapshot.docs[i].id,
                    nome: snapshot.docs[i].data().nome,
                    telefone: snapshot.docs[i].data().telefone,
                    email: snapshot.docs[i].data().email,
                    cpf: snapshot.docs[i].data().cpf,
                    departamento: snapshot.docs[i].data().departamento,
                    senha: snapshot.docs[i].data().senha,
                    admin: snapshot.docs[i].data().admin,
                    ativo: snapshot.docs[i].data().ativo,
                }
                lista.push(obj)
            }
            setAtendentes(lista)
        })
        setLoading(false)
    }

    useEffect(() => {
        getDados()
    }, [])

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#99CC6A" />
            </View>
        );
    }
    else {
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
                    data={atendentes}
                    renderItem={(item) => {
                        return (
                            <View style={styles.containerFlatlist}>
                                <TouchableOpacity style={styles.content} onPress={() => navigation.navigate("VisualizarAtendente", {
                                    id: item.item.id,
                                    nome: item.item.nome,
                                    telefone: item.item.telefone,
                                    email: item.item.email,
                                    cpf: item.item.cpf,
                                    departamento: item.item.departamento,
                                    senha: item.item.senha,
                                    admin: item.item.admin,
                                    ativo: item.item.ativo,
                                })}>
                                    
                                    <Text
                                        style={styles.description}
                                    >
                                        {item.item.nome}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />
                <TouchableOpacity
                    style={styles.buttonNew}
                    onPress={() => navigation.navigate("CadastrarAtendente")}
                >
                    <Text style={styles.iconButton}>+</Text>
                </TouchableOpacity>
            </View>
        )
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
        justifyContent: 'center',
        backgroundColor: "#000",
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        marginBottom: 20,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginBottom: 10,
    },
    description: {
        fontSize: 20,
        color: "#f8f8f8",
        fontWeight: "bold",
    },
    icon: {
        marginRight: 5,
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