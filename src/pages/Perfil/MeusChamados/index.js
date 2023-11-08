import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { database } from "../../../config";
import { useUser } from "../../../contexts/UserContext";

export default function MeusChamados({ navigation }) {
    const [chamados, setChamados] = useState([]); // Para atendente: chamados atribuídos
    const [chamadosAbertos, setChamadosAbertos] = useState([]); // Para cliente: chamados abertos por ele
    const [isViewingOpened, setIsViewingOpened] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isAtendente, setIsAtendente] = useState(false);
    const { userEmail } = useUser();

    async function getDados() {
        setLoading(true);
    
        try {
            const collecRef = collection(database, 'Chamados');
            let listaChamadosAtendente = [];
            let listaChamadosCliente = [];
            let listaChamadosAbertosAtendente = [];
    
            const atendenteRef = collection(database, "Atendentes");
            const atendenteQuery = query(atendenteRef, where("email", "==", userEmail));
            const atendenteSnapshot = await getDocs(atendenteQuery);
    
            if (!atendenteSnapshot.empty) {
                setIsAtendente(true);
                const atendenteData = atendenteSnapshot.docs[0].data();
                const atendenteNome = atendenteData.nome || null;
    
                if (atendenteNome) {
                    // Chamados atribuídos ao atendente
                    const atribuidoQuery = query(collecRef, where("atribuido", "==", atendenteNome));
                    const chamadosSnapshotAtribuido = await getDocs(atribuidoQuery);
                    chamadosSnapshotAtribuido.docs.forEach(doc => {
                        let obj = {
                            id: doc.id,
                            ...doc.data()
                        };
                        listaChamadosAtendente.push(obj);
                    });
    
                    // Chamados Abertos pelo atendente
                    const abertoAtendenteQuery = query(collecRef, where("atendente", "==", atendenteNome));
                    const chamadosSnapshotAbertoAtendente = await getDocs(abertoAtendenteQuery);
                    chamadosSnapshotAbertoAtendente.docs.forEach(doc => {
                        let obj = {
                            id: doc.id,
                            ...doc.data()
                        };
                        listaChamadosAbertosAtendente.push(obj);
                    });
    
                }
            } else {
                setIsAtendente(false);
                const clienteRef = collection(database, "Clientes");
                const clienteQuery = query(clienteRef, where("email", "==", userEmail));
                const clienteSnapshot = await getDocs(clienteQuery);
    
                if (!clienteSnapshot.empty) {
                    const clienteData = clienteSnapshot.docs[0].data();
                    const clienteNome = clienteData.nome || null;
    
                    if (clienteNome) {
                        // Chamados abertos pelo cliente
                        const clienteChamadoQuery = query(collecRef, where("cliente", "==", clienteNome));
                        const chamadosSnapshotCliente = await getDocs(clienteChamadoQuery);
                        chamadosSnapshotCliente.docs.forEach(doc => {
                            let obj = {
                                id: doc.id,
                                ...doc.data()
                            };
                            listaChamadosCliente.push(obj);
                        });
                    }
                }
            }
    
            setChamados(listaChamadosAtendente); // Chamados atribuídos ao atendente
            setChamadosAbertos(isAtendente ? listaChamadosAbertosAtendente : listaChamadosCliente); // Chamados abertos pelo atendente ou pelo cliente
    
        } catch (error) {
            console.error("Erro ao buscar chamados:", error);
        } finally {
            setLoading(false);
        }
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

                <Text style={styles.headerTitle}>Meus Chamados</Text>
                
                {isAtendente && (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                        <TouchableOpacity 
                            onPress={() => setIsViewingOpened(true)} 
                            style={isViewingOpened ? styles.activeButton : styles.inactiveButton}>
                            <Text>Chamados Abertos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setIsViewingOpened(false)} 
                            style={!isViewingOpened ? styles.activeButton : styles.inactiveButton}>
                            <Text>Chamados Atribuídos</Text>
                        </TouchableOpacity>
                    </View>
                )}
    
                <FlatList
                    showsVerticalScrollIndicator={true}
                    data={isViewingOpened ? chamadosAbertos : chamados}
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
            paddingTop: 60,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 15,
            color: '#99CC6A',
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
        activeButton: {
            marginHorizontal: 10,
            padding: 10,
            backgroundColor: '#99CC6A',
            borderRadius: 5
        },
        inactiveButton: {
            marginHorizontal: 10,
            padding: 10,
            backgroundColor: 'grey',
            borderRadius: 5
        },
    });
    