import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, StatusBar, ScrollView } from "react-native";
import { Ionicons } from 'react-native-vector-icons';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { database } from "../../../config";

export default function Filtro({ navigation }) {
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    async function getDados() {
        setLoading(true);
        const collecRef = collection(database, 'Chamados');

        if (selectedDepartment) {
            const q = query(collecRef, where("departamento", "==", selectedDepartment));
            const snapshot = await getDocs(q);

            let lista = [];
            snapshot.docs.forEach(doc => {
                let obj = {
                    id: doc.id,
                    ...doc.data()
                };
                lista.push(obj);
            });
            lista.sort((a, b) => a.identificador - b.identificador);
            setChamados(lista);
        } else {
            const snapshot = await getDocs(collecRef);
            let lista = [];
            snapshot.docs.forEach(doc => {
                let obj = {
                    id: doc.id,
                    ...doc.data()
                };
                lista.push(obj);
            });
            lista.sort((a, b) => a.identificador - b.identificador);
            setChamados(lista);
        }

        setLoading(false);
    }

    async function loadDepartments() {
        const departRef = collection(database, 'Departamento');
        const snapshot = await getDocs(departRef);

        const departs = snapshot.docs.map(doc => doc.data().nome);
        setDepartamentos(departs);
    }

    useEffect(() => {
        loadDepartments();
        getDados();
    }, [selectedDepartment]);

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

                <Text style={styles.filterByText}>Filtrar por Departamentos:</Text>

                <TouchableOpacity
                    style={styles.dropdownHeader}
                    onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <Text style={styles.departmentText}>
                        {selectedDepartment || "Selecione"}
                    </Text>
                </TouchableOpacity>

                {isDropdownOpen && (
                    <ScrollView style={styles.view}>
                        <TouchableOpacity
                            style={!selectedDepartment ? styles.departmentSelected : styles.dropdownItem}
                            onPress={() => {
                                setSelectedDepartment(null);
                                getDados();
                                setIsDropdownOpen(false);
                            }}
                        >
                            <Text style={styles.departmentText}>Selecione</Text>
                        </TouchableOpacity>
                        {departamentos.map(department => (
                            <TouchableOpacity
                                key={department}
                                style={department === selectedDepartment ? styles.departmentSelected : styles.dropdownItem}
                                onPress={() => {
                                    setSelectedDepartment(department);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                <Text style={styles.departmentText}>{department}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {chamados.length === 0 && (
                    <View style={styles.centeredMessage}>
                        <Text style={styles.notFoundText}>Nenhum chamado encontrado</Text>
                    </View>
                )}

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
        paddingTop: 30,
        paddingBottom: 25,
    },
    dropdownHeader: {
        backgroundColor: 'white',
        padding: 10,
        marginHorizontal: 20,
        marginTop: StatusBar.currentHeight,
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 1
    },
    view: {
        marginLeft: 20,
        marginTop: 5,
        backgroundColor: "#263868",
    },
    departmentText: {
        color: 'black',
        fontSize: 16
    },
    departmentSelected: {
        backgroundColor: '#99CC6A',
        padding: 10,
        margin: 5,
        borderRadius: 5
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
    dropdownItem: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1
    },
    filterByText: {
        marginLeft: 20,
        marginTop: 50,
        marginBottom: 5,
        fontSize: 30,
        color: '#99CC6A',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});