import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, Button, StyleSheet, Alert, ScrollView, Image, TextInput } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [book, setBook] = useState(null); // Inicialize como null para evitar erro ao tentar renderizar
  const [isbn, setIsbn] = useState(null); // Inicial

  const handleLogout = () => {
    // Simplesmente navega de volta para a tela de login
    navigation.replace('LoginScreen');
  };

  const getBook = async () => {
    if (!isbn) {
      Alert.alert('Erro', 'Por favor, insira um ISBN válido.');
      return;
    }

    try {
      const response = await axios.get(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      );
      const bookData = response.data[`ISBN:${isbn}`]; // Acessa a chave correta do objeto retornado
      if (bookData) {
        setBook(bookData); // Define os dados do livro
      } else {
        Alert.alert('Erro', 'Nenhum livro encontrado para este ISBN.');
      }
    } catch (error) {
      Alert.alert('Erro ao buscar informações do livro:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {book ? (
          // Renderiza as informações do livro, garantindo que o objeto seja acessado corretamente
          <View>
            {book.cover && book.cover.large ? (
              <Image
                source={{ uri: book.cover.large }} // Exibe a capa do livro
                style={styles.bookCover} // Aplica o estilo
              />
            ) : (
              <Text>Imagem de capa não disponível</Text>
            )}
            <Text style={styles.title}>Título: {book.title}</Text>
            <Text>Autor(es): {book.authors.map(author => author.name).join(', ')}</Text>
            <Text>Número de Páginas: {book.number_of_pages}</Text>
            <Text>Publicado em: {book.publish_date}</Text>
          </View>
        ) : (
          <Text style={styles.title}>Clique no botão para buscar o livro</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="ISBN"
          value={isbn}
          onChangeText={setIsbn}
        />
        <Button title="Buscar Livro" onPress={getBook} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  bookCover: {
    width: 150, // Define a largura da imagem
    height: 200, // Define a altura da imagem
    marginBottom: 20, // Espaçamento entre a imagem e o texto
  },
});

export default HomeScreen;