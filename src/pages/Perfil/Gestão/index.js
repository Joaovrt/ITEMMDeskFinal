import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, safe } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';

export default function Gestão() {
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
                onPress={() => navigation.navigate("Atendentes")}
            >
                <Icon name="user" size={40} color="#99CC6A" />
                <Text style={styles.title}>Atendentes</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Departamentos")}
            >
                <Icon name="reorder" size={40} color="#99CC6A" />
                <Text style={styles.title}>Departamentos</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Categorias")}
            >
                <Icon name="reorder" size={40} color="#99CC6A" />
                <Text style={styles.title}>Categorias</Text>
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
