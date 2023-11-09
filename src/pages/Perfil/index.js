import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'; // Adicione a importação do componente Image
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import ButtonCustom from "../../components/ButtonCustom";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { database } from '../../config';
import { useUser } from '../../contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';

export default function Perfil({ navigation }) {
    const { userEmail } = useUser();
    const { userId } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [userName, setUserName] = useState("");
    const [isAtendent, setIsAtendent] = useState(false);
    const [userImage, setUserImage] = useState(null);
    const [carregar, setCarregar] = useState(true)

    const checkRoles = async () => {
        const adminQuery = query(
            collection(database, "Admin"),
            where("email", "==", userEmail)
        );
        const clientQuery = query(
            collection(database, "Clientes"),
            where("email", "==", userEmail)
        );
        const atendentQuery = query(
            collection(database, "Atendentes"),
            where("email", "==", userEmail)
        );

        const adminSnapshot = await getDocs(adminQuery);
        const clientSnapshot = await getDocs(clientQuery);
        const atendentSnapshot = await getDocs(atendentQuery);

        if (!adminSnapshot.empty) {
            setIsAdmin(true);
            setUserName("Conta Admin");
        } else if (!clientSnapshot.empty) {
            setIsClient(true);
            const clientData = clientSnapshot.docs[0]?.data();
            setUserName(clientData?.nome || "Nome Desconhecido");
            setUserImage(clientData?.imagem);
        } else if (!atendentSnapshot.empty) {
            setIsAtendent(true);
            const atendentData = atendentSnapshot.docs[0]?.data();
            setUserName(atendentData?.nome || "Nome Desconhecido");
            setUserImage(atendentData?.imagem);
        }
        setCarregar(false)
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkRoles(); // Chama a função de busca de dados sempre que a tela está focada
        });

        // Cleanup da inscrição do evento quando o componente é desmontado
        return unsubscribe;
    }, [navigation]); 

    function handlerMeusChamados() {
        navigation.navigate("MeusChamados");
    }

    function handlerGestão() {
        navigation.navigate("Gestão");
    }

    function handlerExit() {
        navigation.navigate("SignIn");
    }

    function handlerListaClientes() {
        navigation.navigate("ListaClientes");
    }
    function handlerEditarPerfil() {
        navigation.navigate("VisualizarPerfil", { id: userId });
    }

    if (!carregar) {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <ScrollView>
                    <View style={styles.innerContainer}>
                        {!isAdmin && (
                            <View style={styles.iconContainer}>
                                {userImage ? (
                                    <Image
                                        source={{ uri: userImage }}
                                        style={{ width: 200, height: 200, borderRadius: 100, resizeMode: 'cover' }}
                                    />
                                ) : (
                                    <FontAwesome name="user" size={160} color="black" />
                                )}
                            </View>
                        )}
                        <View style={styles.infoContainer}>
                            <Text style={styles.nameText}>{userName}</Text>
                            {
                                isClient && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={handlerEditarPerfil}
                                        activeOpacity={0.7}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <FontAwesome5 name="edit" size={24} color="white" style={{ marginRight: 10 }} />
                                            <Text style={styles.editProfileText}>Editar Perfil</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }

                            <View style={styles.divider} />
                            <View style={styles.actionsContainer}>
                                {!isAdmin && !isClient && (
                                    <View style={styles.actionButton}>
                                        <ButtonCustom label="Meus Chamados" onPress={handlerMeusChamados} transparent={true}>
                                            <View style={styles.iconSpacing}>
                                                <FontAwesome5 name="list" size={24} color="white" />
                                            </View>
                                            <Text style={{ color: 'white' }}>Meus Chamados</Text>
                                        </ButtonCustom>
                                    </View>
                                )}
                                {isAdmin && (
                                    <View style={[styles.actionButton, styles.thirdButton]}>
                                        <ButtonCustom label="Gestão" onPress={handlerGestão} transparent={true}>
                                            <View style={styles.iconSpacing}>
                                                <FontAwesome5 name="star" size={24} color="white" />
                                            </View>
                                            <Text style={{ color: 'white' }}>Gestão</Text>
                                        </ButtonCustom>
                                    </View>
                                )}
                                {isAdmin && (
                                    <View style={[styles.actionButton, styles.thirdButton]}>
                                        <ButtonCustom label="Lista de Clientes" onPress={handlerListaClientes} transparent={true}>
                                            <View style={styles.iconSpacing}>
                                                <FontAwesome5 name="users" size={24} color="white" />
                                            </View>
                                            <Text style={{ color: 'white' }}>Lista de Clientes</Text>
                                        </ButtonCustom>
                                    </View>
                                )}
                                <View style={[styles.actionButton, styles.exitButton]}>
                                    <ButtonCustom label="Sair" onPress={handlerExit} transparent={true}>
                                        <View style={styles.iconSpacing}>
                                            <MaterialCommunityIcons name="exit-run" size={24} color="white" />
                                        </View>
                                        <Text style={{ color: 'white' }}>Sair</Text>
                                    </ButtonCustom>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
    else{
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#99CC6A" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 60,
        backgroundColor: '#263868',
    },
    innerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 200,
        height: 200,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        elevation: 10,
    },
    infoContainer: {
        width: '100%',
        marginTop: -80,
        paddingTop: 80,
        borderRadius: 10,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    nameText: {
        marginTop: 20,
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
    editProfileText: {
        color: 'white',
        fontSize: 20,
    },
    buttonContainer: {
        marginVertical: 30,
        width: '100%',
        paddingHorizontal: 20,
    },
    divider: {
        width: '90%',
        height: 5,
        backgroundColor: '#000',
        borderRadius: 10,
        marginTop: 15,
    },
    actionsContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    actionButton: {
        marginTop: 15,
        backgroundColor: '#000',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 40,
    },
    thirdButton: {
        backgroundColor: '#000',
    },
    exitButton: {
        backgroundColor: 'red',
        marginTop: 90,
    },
    iconSpacing: {
        marginRight: 20,
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