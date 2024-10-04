import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Button, StyleSheet, Alert, ScrollView, Image, TextInput } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [book, setBook] = useState(null); // Livro buscado por ISBN
  const [searchQuery, setSearchQuery] = useState(''); // Estado para a barra de busca
  const [dbBooks, setDbBooks] = useState([]); // Estado para armazenar livros do banco de dados

  const handleLogout = () => {
    navigation.replace('LoginScreen');
  };

  const getBook = async () => {
    try {
      const response = await axios.get(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${searchQuery}&format=json&jscmd=data`
      );
      const bookData = response.data[`ISBN:${searchQuery}`];
      setBook(bookData);
    } catch (error) {
      Alert.alert('Erro ao buscar informações do livro:', error.message);
    }
  };

  const goRegister = () => {
    navigation.replace('RegisterBookScreen');
  };

  // Função para buscar livros cadastrados no banco de dados
  const getDbBooks = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/books'); // Altere para o IP correto se necessário
      setDbBooks(response.data);
    } catch (error) {
      Alert.alert('Erro ao buscar livros cadastrados:', error.message);
    }
  };

  useEffect(() => {
    getDbBooks(); // Busca os livros cadastrados ao carregar a tela
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <Button title="Cadastrar Livro" onPress={goRegister} />
        <Button title="Meus Livros" onPress={() => navigation.replace('MyBooksScreen')} />
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Buscar Livro por ISBN"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Buscar Livro" onPress={getBook} />

      <ScrollView>
        {book ? (
          <View style={styles.bookDetails}>
            {book.cover && book.cover.large ? (
              <Image source={{ uri: book.cover.large }} style={styles.bookCover} />
            ) : (
              <Text>Imagem de capa não disponível</Text>
            )}
            <Text style={styles.title}>Título: {book.title}</Text>
            <Text>Autor(es): {book.authors.map(author => author.name).join(', ')}</Text>
            <Text>Número de Páginas: {book.number_of_pages}</Text>
            <Text>Publicado em: {book.publish_date}</Text>
          </View>
        ) : (
          <Text style={styles.title}>Digite um ISBN para buscar o livro</Text>
        )}

        <Text style={styles.carouselTitle}>Livros Cadastrados</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dbBooks.length > 0 ? (
            dbBooks.map((dbBook, index) => (
              <View key={index} style={styles.dbBookItem}>
                {dbBook.cover ? (
                  <Image source={{ uri: dbBook.cover }} style={styles.bookCover} />
                ) : (
                  <Text>Imagem indisponível</Text>
                )}
                <Text style={styles.bookTitle}>{dbBook.title}</Text>
              </View>
            ))
          ) : (
            <Text>Carregando livros cadastrados...</Text>
          )}
        </ScrollView>

        <View style={styles.logoutContainer}>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookDetails: {
    marginBottom: 20,
  },
  bookCover: {
    width: 100,
    height: 150,
    marginBottom: 10,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  dbBookItem: {
    width: 120,
    marginRight: 10,
    alignItems: 'center',
  },
  bookTitle: {
    textAlign: 'center',
    fontSize: 14,
  },
  logoutContainer: {
    marginTop: 20,
  },
});

export default HomeScreen;
