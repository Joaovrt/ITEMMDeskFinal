import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useUser } from '../../contexts/UserContext';


export default function HomeCliente({ navigation }){
    const { userName } = useUser();  

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
        backgroundColor: '#38a69D',
        flex: 1,
        alignItems: 'center',  
        justifyContent: 'center',
    },
    text:{
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20, 
    },
    button: {
        backgroundColor: 'orange',
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