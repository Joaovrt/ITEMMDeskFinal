import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { database } from "../../../../../config"
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc } from 'firebase/firestore'

export default function CadastrarCategoria({ navigation }) {

    const [nome, setNome] = useState("");

    function AllFieldsAreFilled() {
        let obj = {
            nome: nome,
        }
        for (let item in obj) {
            if (obj[item] == null || obj[item] == "" || obj[item] == undefined) {
                return false;
            }
            else return true;
        }
    }

    function add() {
        if (!AllFieldsAreFilled()) {
            window.alert("Preencha o campo solicitado!");
            return;
        } else {
            addDoc(collection(database, "Categoria"), {
                nome: nome,
            });
            navigation.navigate("Gestão");
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.topContainer}>
                <Text style={styles.label}>Nome da Categoria</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite aqui..."
                    onChangeText={setNome}
                    value={nome}
                />
                <TouchableOpacity style={styles.buttonSend} onPress={add}>
                    <Text style={styles.buttonText}>Criar</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        backgroundColor: "#263868",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 70,
        paddingBottom: 60,
    },

    topContainer: {
        alignItems: "center",
    },

    label: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        color: '#99CC6A',
    },

    input: {
      backgroundColor: "#f8f8f8",
      width: "95%",  
      height: 50,
      fontSize: 18,
      padding: 10,
      borderRadius: 10,
      color: "#000",
      marginBottom: 10,
      borderColor: "#c7c7c7",
      borderWidth: 2,
      marginHorizontal: "2.5%",  
  },

    buttonSend: {
        backgroundColor: "#99CC6A",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        marginTop: 5,
    },

    buttonText: {
        color: "#ffffff",
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