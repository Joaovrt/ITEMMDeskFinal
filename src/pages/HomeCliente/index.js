import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { BackHandler } from 'react-native';


export default function HomeCliente({ navigation }){
    const { userName } = useUser(); 
    
    useEffect(() => {
        const handleBackButton = () => {
            // Impedir a ação de voltar
            return true;
        };

        // Adicionar um listener para o botão de voltar
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);


        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);

    const navigateToMeusChamados = () => {
        navigation.navigate('MeusChamados');
    };

    return(
        <View style={styles.container}>
            <Text style={styles.text}>Seja Bem-Vindo, {userName ? userName : "Usuário"}!</Text>

            {/* Adicione o botão aqui */}
            <TouchableOpacity style={styles.button} onPress={navigateToMeusChamados}>
                <Text style={styles.buttonText}>Meus Chamados</Text>
            </TouchableOpacity>

        </View>

    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#263868',
        flex: 1,
        alignItems: 'center',  
        justifyContent: 'center',
    },
    text:{
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20, 
        color:'white'
    },
    button: {
        backgroundColor: '#99CC6A',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'center', 
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    }
});