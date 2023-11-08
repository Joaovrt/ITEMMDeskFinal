import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

function ButtonCustom({ label, onPress, transparent = false, children }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={[
                    styles.button, 
                    transparent ? styles.transparentBackground : styles.secondBackground
                ]}
                onPress={onPress}
            >
                {children ? children : <Text style={styles.labelText}>{label}</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    transparentBackground: {
        backgroundColor: 'transparent',
    },
    secondBackground: {
        backgroundColor: '#000',
    },
    labelText: {
        color: '#fff',
        fontSize: 16,
    }
});

export default ButtonCustom;