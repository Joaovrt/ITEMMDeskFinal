import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, Feather } from '@expo/vector-icons';
import { useUser } from "../contexts/UserContext";

import Welcome from '../pages/Welcome';
import SignIn from '../pages/SignIn';
import Home from '../pages/Home';
import New from '../pages/New';
import Pesquisar from '../pages/Pesquisar';
import Filtro from '../pages/Pesquisar/Filtro';  
import Chamados from '../pages/Chamados';
import Perfil from '../pages/Perfil';
import ChamadosAbertos from "../pages/Chamados/ChamadosAbertos";
import ChamadosAtrasados from "../pages/Chamados/ChamadosAtrasados";
import ChamadosDeHoje from "../pages/Chamados/ChamadosDeHoje";
import ChamadosEmAndamento from "../pages/Chamados/ChamadosEmAndamento";
import ChamadosFinalizados from "../pages/Chamados/ChamadosFinalizados";
import ButtonNew from "../components/ButtonNew";
import MeusChamados from "../pages/Perfil/MeusChamados";
import Gestão from "../pages/Perfil/Gestão";
import Atendentes from "../pages/Perfil/Gestão/Atendentes";
import Categorias from "../pages/Perfil/Gestão/Categorias";
import Departamentos from "../pages/Perfil/Gestão/Departamentos";
import CadastrarAtendente from "../pages/Perfil/Gestão/Atendentes/CadastrarAtendente";
import CadastrarCategoria from "../pages/Perfil/Gestão/Categorias/CadastrarCategoria";
import CadastrarDepartamento from "../pages/Perfil/Gestão/Departamentos/CadastrarDepartamento";
import VisualizarAtendente from "../pages/Perfil/Gestão/Atendentes/VisualizarAtendente";
import EditarAtendente from "../pages/Perfil/Gestão/Atendentes/VisualizarAtendente/EditarAtendente";
import VisualizarChamados from "../pages/Chamados/VisualizarChamados";
import EditarChamados from "../pages/Chamados/VisualizarChamados/EditarChamados";
import Cadastro from "../pages/Cadastro";
import ListaClientes from "../pages/Perfil/ListaClientes";
import HomeCliente from "../pages/HomeCliente";
import VisualizarPerfil from "../pages/Perfil/VisualizarPerfil";
import EditarPerfil from "../pages/Perfil/VisualizarPerfil/EditarPerfil";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  const { isClient } = useUser();
  
  return (
    <Stack.Navigator>
      {
        isClient ? 
          <Stack.Screen name="HomeCliente" component={HomeCliente} options={{ headerShown: false }} />
          
        : 
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      }

      {/* Adicione a tela 'VisualizarChamados' para clientes */}
      {isClient && <Stack.Screen name="VisualizarChamados" component={VisualizarChamados} options={{ headerShown: false }} />}
      {isClient && <Stack.Screen name="MeusChamados" component={MeusChamados} options={{ headerShown: false }} />}
    </Stack.Navigator>
  );
}

function ChamadosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chamados" component={Chamados} options={{ headerShown: false }} />
      <Stack.Screen name="ChamadosDeHoje" component={ChamadosDeHoje} options={{ headerShown: false }} />
      <Stack.Screen name="ChamadosAbertos" component={ChamadosAbertos} options={{ headerShown: false }} />
      <Stack.Screen name="ChamadosEmAndamento" component={ChamadosEmAndamento} options={{ headerShown: false }} />
      <Stack.Screen name="ChamadosFinalizados" component={ChamadosFinalizados} options={{ headerShown: false }} />
      <Stack.Screen name="ChamadosAtrasados" component={ChamadosAtrasados} options={{ headerShown: false }} />
      <Stack.Screen name="VisualizarChamados" component={VisualizarChamados} options={{ headerShown: false }} />
      <Stack.Screen name="EditarChamados" component={EditarChamados} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false } } />
      <Stack.Screen name="MeusChamados" component={MeusChamados} options={{ headerShown: false }} />
      <Stack.Screen name="Gestão" component={Gestão} options={{ headerShown: false }} />
      <Stack.Screen name="Atendentes" component={Atendentes} options={{ headerShown: false }} />
      <Stack.Screen name="Categorias" component={Categorias} options={{ headerShown: false }} />
      <Stack.Screen name="Departamentos" component={Departamentos} options={{ headerShown: false }} />
      <Stack.Screen name="CadastrarAtendente" component={CadastrarAtendente} options={{ headerShown: false }} />
      <Stack.Screen name="CadastrarCategoria" component={CadastrarCategoria} options={{ headerShown: false }} />
      <Stack.Screen name="CadastrarDepartamento" component={CadastrarDepartamento} options={{ headerShown: false }} />
      <Stack.Screen name="VisualizarAtendente" component={VisualizarAtendente} options={{ headerShown: false }} />
      <Stack.Screen name="EditarAtendente" component={EditarAtendente} options={{ headerShown: false }} />
      <Stack.Screen name="ListaClientes" component={ListaClientes} options={{ headerShown: false }} />
      <Stack.Screen name="VisualizarPerfil" component={VisualizarPerfil} options={{ headerShown: false }} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function PesquisarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Pesquisar" component={Pesquisar} options={{ headerShown: false }} />
      <Stack.Screen name="Filtro" component={Filtro} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const { isAdmin, isClient } = useUser();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopColor: 'transparent',
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#fff',
      }}
    >
      <Tab.Screen name="HomeStack" component={HomeStack}
        options={{
          headerShown: false,
          tabBarLabel: "Início",
          tabBarIcon: ({ size, color }) => (
            <Entypo name="home" size={size} color={color} />
          )
        }}
      />

      {
        !isClient && 
        <Tab.Screen name="PesquisarStack" component={PesquisarStack}
          options={{
            tabBarLabel: 'Pesquisar',
            headerShown: false,
            tabBarIcon: ({ size, color }) => (
              <Feather name="search" size={size} color={color} />
            )
          }}
        />
      }

      {
        !isAdmin &&
        <Tab.Screen name="Novo" component={New}
          options={{
            headerShown: false,
            tabBarLabel: '',
            tabBarIcon: ({ focused, size }) => (
              <ButtonNew size={size} focused={focused} />
            )
          }}
        />
      }

      {
        !isClient &&
        <Tab.Screen name="ChamadosStack" component={ChamadosStack}
          options={{
            headerShown: false,
            tabBarLabel: 'Chamados',
            tabBarIcon: ({ size, color }) => (
              <Entypo name="list" size={size} color={color} />
            )
          }}
        />
      }

      <Tab.Screen name="PerfilStack" component={PerfilStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ size, color }) => (
            <Feather name="user" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}