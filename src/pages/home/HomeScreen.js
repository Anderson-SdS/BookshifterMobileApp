import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, Button, StyleSheet, Alert, ScrollView, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [book, setBook] = useState(null); // Inicialize como null para evitar erro ao tentar renderizar

  const handleLogout = () => {
    // Simplesmente navega de volta para a tela de login
    navigation.replace('LoginScreen');
  };

  const getBook = async () => {
    try {
      const response = await axios.get(
        'https://openlibrary.org/api/books?bibkeys=ISBN:9780140328721&format=json&jscmd=data'
      );
      const bookData = response.data['ISBN:9780140328721']; // Acessa a chave correta do objeto retornado
      setBook(bookData); // Define os dados do livro
    } catch (error) {
      Alert.alert('Erro ao buscar informações do livro:', error.message);
    }
  };

  const goRegister = () => {
    navigation.replace('RegisterBookScreen')
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {book ? (
          // Renderiza as informações do livro, garantindo que o objeto seja acessado corretamente
          <View>
            <Image>{book.large}</Image>
            <Text style={styles.title}>Título: {book.title}</Text>
            <Text>Autor(es): {book.authors.map(author => author.name).join(', ')}</Text>
            <Text>Número de Páginas: {book.number_of_pages}</Text>
            <Text>Publicado em: {book.publish_date}</Text>
          </View>
        ) : (
          <Text style={styles.title}>Clique no botão para buscar o livro</Text>
        )}
        <Button title="Buscar Livro" onPress={getBook} />
        <Button title="Cadastrar Livro" onPress={goRegister} />
        <View style={styles.container}>
          <Text style={styles.title}>Bem-vindo à Tela Inicial!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
