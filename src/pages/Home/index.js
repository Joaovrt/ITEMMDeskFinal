import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { BarChart } from 'react-native-chart-kit';
import { getFirestore, collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BackHandler } from 'react-native';

import { database } from "../../config";

export default function Home({navigation}) {
    const [data, setData] = useState({
        labels: ["Abertos", "Em Andamento", "Atrasados", "Finalizados"],
        datasets: [{ data: [0, 0, 0, 0] }]
    });

    const [carregar,setCarregar]=useState(true)

    const updateData = async () => {
        setCarregar(true)
        const collecRef = collection(database, 'Chamados');

        const getCount = async (status) => {
            const q = query(collecRef, where("status", "==", status));
            const snapshot = await getDocs(q);
            return snapshot.docs.length;
        };

        const abertos = await getCount("Aberto");
        const emAndamento = await getCount("Em Andamento");
        const atrasados = await getCount("Atrasado");
        const finalizados = await getCount("Finalizado");

        setData({
            labels: ["Abertos", "Em Andamento", "Atrasados", "Finalizados"],
            datasets: [{ data: [abertos, emAndamento, atrasados, finalizados] }]
        });

        setCarregar(false)
    };


    const getDateFormatted = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se o mês for menor que 10
        const day = String(now.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se o dia for menor que 10
        return `${year}-${month}-${day}`;
    };


    const generateExcel = async () => {
        try {
            const querySnapshot = await getDocs(collection(database, 'Chamados'));
            const temp = [];

            querySnapshot.forEach((doc) => {
                // Obtém o ID do documento
                const id = doc.id;
                // Obtém os dados do documento
                const data = doc.data();
                // Adiciona o ID ao objeto de dados
                const dataWithId = { id, ...data };
                // Adiciona o objeto de dados com o ID ao array temporário
                temp.push(dataWithId);
            });

            // Obtém os nomes dos atributos do primeiro objeto no array
            const attributeNames = Object.keys(temp[0]);
            const dataArray = [attributeNames]
            temp.forEach(obj => {
                const row = attributeNames.map(attr => obj[attr]);
                dataArray.push(row);
            });
            let wb = XLSX.utils.book_new();
            let ws = XLSX.utils.aoa_to_sheet(dataArray);

            XLSX.utils.book_append_sheet(wb, ws, "MyFirstSheet", true);

            const base64 = XLSX.write(wb, { type: "base64" });
            const currentDate = getDateFormatted();
            const filename = FileSystem.documentDirectory + `RelatorioChamados_${currentDate}.xlsx`;
            FileSystem.writeAsStringAsync(filename, base64, {
                encoding: FileSystem.EncodingType.Base64
            }).then(() => {
                Sharing.shareAsync(filename);
            });
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
        }
    };


    useEffect(() => {

        const unsubscribe = onSnapshot(collection(database, 'Chamados'), () => {
            updateData();
        });

        const handleBackButton = () => {
            // Impedir a ação de voltar
            return true;
        };

        // Adicionar um listener para o botão de voltar
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);


        return () => {
            unsubscribe();
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Bem-Vindo(a)</Text>
            <View style={styles.titleContainer}>
                <View style={styles.bullet} />
                <Text style={styles.title}>Gráfico geral de chamados</Text>
            </View>
            {carregar && <ActivityIndicator style={{marginTop:'5%'}} size="large" color="#99CC6A" />}
            {!carregar && <View style={styles.chartContainer}>
                <View style={styles.chartWithYAxis}>
                    <BarChart
                        data={data}
                        width={Dimensions.get("window").width - 30}
                        height={320}
                        yAxisLabel=""
                        chartConfig={{
                            backgroundColor: 'black',
                            backgroundGradientFrom: 'black',
                            backgroundGradientTo: 'black',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            fillShadowGradient: 'rgb(153, 204, 106)',
                            fillShadowGradientOpacity: 1,
                            style: {
                                borderRadius: 16,
                            },
                        }}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                </View>
            </View>}
            <TouchableOpacity style={styles.button} onPress={generateExcel}>
                <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Emitir Relatório Excel</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#263868',
    },
    welcomeText: {
        marginTop: 15,
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'center',
        color:'white'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 35,
        marginTop: 80,
    },
    bullet: {
        width: 10,
        height: 10,
        backgroundColor: '#99CC6A',
        borderRadius: 5,
        marginRight: 8,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color:'white'
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chartWithYAxis: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    yAxis: {
        marginLeft: 16,
    },
    yAxisLabel: {
        color: 'white',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#99CC6A',
        padding: 10,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
    },
});