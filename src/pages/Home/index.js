import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import { BarChart } from 'react-native-chart-kit';
import { getFirestore, collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import XLSX from 'xlsx';

import { database } from "../../config";

export default function Home() {
    const [data, setData] = useState({
        labels: ["Abertos", "Em Andamento", "Atrasados", "Finalizados"],
        datasets: [{ data: [0, 0, 0, 0] }]
    });

    const [yAxisValues, setYAxisValues] = useState([0, 3, 5, 10, 15]);

    const updateData = async () => {
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
    };

    async function createExcelFile(data) {
        try {
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Relatório'); // Nome da planilha

            // Salve o arquivo Excel em um local específico, ou realize outras ações necessárias com o arquivo Excel aqui

        } catch (error) {
            console.error('Erro ao criar o relatório:', error);
            alert('Erro ao criar o relatório.');
        }
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(database, 'Chamados'), () => {
            updateData();
        });

        return () => unsubscribe();  
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Bem-Vindo(a)</Text>
            <View style={styles.titleContainer}>
                <View style={styles.bullet} />
                <Text style={styles.title}>Gráfico geral de chamados</Text>
            </View>
            <View style={styles.chartContainer}>
                <View style={styles.chartWithYAxis}>
                    <BarChart
                        data={data}
                        width={Dimensions.get("window").width - 16}
                        height={220}
                        yAxisLabel=""
                        chartConfig={{
                            backgroundColor: 'black',
                            backgroundGradientFrom: 'black',
                            backgroundGradientTo: 'black',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 140, 0, ${opacity})`,
                            fillShadowGradient: 'rgb(255, 140, 0)',
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
                    <View style={styles.yAxis}>
                        {yAxisValues.map((value, index) => (
                            <Text key={index} style={styles.yAxisLabel}>{value}</Text>
                        ))}
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => createExcelFile(data)}>
                <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Emitir Relatório Excel</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#38a69D',
    },
    welcomeText: {
        marginTop: 15,
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'center',
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
        backgroundColor: 'orange',
        borderRadius: 5,
        marginRight: 8,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
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
        backgroundColor: 'orange',
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