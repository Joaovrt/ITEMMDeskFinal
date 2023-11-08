import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, safe } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'

export default function Chamados() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ChamadosDeHoje")}
            >
                <Icon name="reorder" size={40} color="#99CC6A" />
                <Text style={styles.title}>Hoje</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ChamadosAbertos")}
            >
                <Icon name="reorder" size={40} color="#99CC6A" />
                <Text style={styles.title}>Abertos</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ChamadosEmAndamento")}
            >
                <Icon name="reorder" size={40} color="#99CC6A" />
                <Text style={styles.title}>Andamento</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ChamadosFinalizados")}
            >
                <Icon name="reorder" size={40} color="#99CC6A" />
                <Text style={styles.title}>Finalizados</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ChamadosAtrasados")}
            >
                <Icon name="reorder" size={40} color="#99CC6A" />
                <Text style={styles.title}>Atrasados</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#263868",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        width: "90%",
        height: 70,
        backgroundColor: "#2b2b2b",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        marginBottom: 35,
    },
    title: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 30,
        marginLeft: 20,
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
