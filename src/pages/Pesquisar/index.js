import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StatusBar,
    SafeAreaView,
    TextInput
} from "react-native";
import { Ionicons } from 'react-native-vector-icons';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { database } from "../../config";

export default function Pesquisar({ navigation }) {
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('');

    async function getDados() {
        setLoading(true);
        const collecRef = collection(database, 'Chamados');

        let lista = [];
        await getDocs(collecRef).then(snapshot => {
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
        const unsubscribe = navigation.addListener('focus', () => {
            getDados(); // Chama a função de busca de dados sempre que a tela está focada
        });

        // Cleanup da inscrição do evento quando o componente é desmontado
        return unsubscribe;
    }, [navigation]); 

    const filteredChamados = chamados.filter(item => String(item.identificador).includes(text));

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#99CC6A" />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                {/* <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity> */}
                <SafeAreaView style={styles.view}>
                    <View style={styles.cabecalho}>
                        <TextInput
                            style={styles.input}
                            placeholder="Pesquisar por id..."
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={text}
                            onChangeText={(value) => setText(value)}
                        />
                        <Ionicons
                            name="filter"
                            size={40}
                            color={"#99CC6A"}
                            onPress={() => navigation.navigate('Filtro')}
                        />
                    </View>
                </SafeAreaView>

                {filteredChamados.length === 0 && text !== '' ? (
                    <View style={styles.centeredMessage}>
                        <Text style={styles.notFoundText}>Nenhum chamado encontrado</Text>
                    </View>
                ) : (
                    <FlatList
                        showsVerticalScrollIndicator={true}
                        data={filteredChamados}
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
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#263868",
        paddingTop: 30,
        paddingBottom: 25,
    },
    view: {
        marginLeft: 20,
        marginTop: StatusBar.currentHeight,
        backgroundColor: "#263868",
    },
    cabecalho: {
        backgroundColor: "#263868",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    input: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        borderRadius: 25,
        fontSize: 20,
        paddingHorizontal: 20,
    },
    containerFlatlist: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 40,
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
    centeredMessage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFoundText: {
        fontSize: 20,
        color: "#99CC6A",
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