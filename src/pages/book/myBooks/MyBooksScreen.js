import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image } from 'react-native';

const MyBooksScreen = ({ navigation }) => {
  const [myBooks, setMyBooks] = useState([
    // Lista de exemplo. Você pode substituir por dados reais do backend ou localStorage
    {
      title: 'Livro Exemplo 1',
      author: 'Autor Exemplo',
      cover: null,
      pages: 350,
      publishDate: '2021',
    },
    {
      title: 'Livro Exemplo 2',
      author: 'Outro Autor',
      cover: null,
      pages: 210,
      publishDate: '2020',
    },
  ]);

  const goToHome = () => {
    navigation.replace('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Livros</Text>
      
      <ScrollView>
        {myBooks.length > 0 ? (
          myBooks.map((book, index) => (
            <View key={index} style={styles.bookItem}>
              {book.cover ? (
                <Image source={{ uri: book.cover }} style={styles.bookCover} />
              ) : (
                <Text>Imagem de capa indisponível</Text>
              )}
              <Text style={styles.bookTitle}>Título: {book.title}</Text>
              <Text>Autor: {book.author}</Text>
              <Text>Páginas: {book.pages}</Text>
              <Text>Publicado em: {book.publishDate}</Text>
            </View>
          ))
        ) : (
          <Text>Nenhum livro cadastrado.</Text>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Voltar para Home" onPress={goToHome} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bookItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookCover: {
    width: 100,
    height: 150,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default MyBooksScreen;
