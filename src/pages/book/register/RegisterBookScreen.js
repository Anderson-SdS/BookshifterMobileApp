import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, Button, StyleSheet, Alert, ScrollView, Image, TextInput } from 'react-native';

const RegisterBookScreen = () => {
  const [book, setBook] = useState(null); // Estado para exibir livro buscado
  const [isbn, setIsbn] = useState(''); // ISBN para buscar livro
  const [newBook, setNewBook] = useState({ title: '', author: '', pages: '', publishDate: '', cover: '' }); // Estado para cadastro de novo livro


  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  // Função para buscar livro por ISBN
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
        // Preenche os campos de cadastro com os dados retornados
        setNewBook({
          title: bookData.title || '',
          author: bookData.authors ? bookData.authors.map(author => author.name).join(', ') : '',
          pages: bookData.number_of_pages || '',
          publishDate: bookData.publish_date || '',
          isbn: bookData.isbn || '',
          cover: bookData.cover ? bookData.cover.large : '' // Preenche a URL da capa
        });
        setIsbn(''); // Limpa o campo ISBN
      } else {
        Alert.alert('Erro', 'Nenhum livro encontrado para este ISBN.');
      }
    } catch (error) {
      Alert.alert('Erro ao buscar informações do livro:', error.message);
    }
  };

  // Função para cadastrar novo livro no banco de dados
  const handleRegisterBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.publishDate) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // Fazendo a requisição para cadastrar o livro na API do backend
      const response = await axios.post('http://10.0.2.2:3000/books', {
        title: newBook.title,
        writer: newBook.author,
        page_number: newBook.pages ? parseInt(newBook.pages, 10) : null, // Converte para número ou null
        publish_date: formatDate(newBook.publishDate), // Formata a data corretamente
        isbn: newBook.isbn,
        cover: newBook.cover
      });

      Alert.alert('Sucesso', 'Livro cadastrado com sucesso!');

      // Limpa o formulário de cadastro após salvar
      setNewBook({ title: '', author: '', pages: '', publishDate: '', cover: '' });
    } catch (error) {
      Alert.alert('Erro ao cadastrar livro:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {book ? (
          <View>
            {book.cover ? (
              <Image
                source={{ uri: book.cover.large }} // Exibe a capa do livro, se disponível
                style={styles.bookCover} // Aplica o estilo da imagem
              />
            ) : (
              <Text>Imagem de capa não disponível</Text>
            )}
            <Text style={styles.title}>Título: {book.title}</Text>
            {book.authors ? (
              <Text>Autor(es): {book.authors.map(author => author.name).join(', ')}</Text>
            ) : (
              <Text>Autor desconhecido</Text>
            )}
            <Text>Número de Páginas: {book.number_of_pages || 'Desconhecido'}</Text>
            <Text>Publicado em: {book.publish_date || 'Data não disponível'}</Text>
          </View>
        ) : (
          <Text style={styles.title}>Clique no botão para buscar o livro</Text>
        )}

        {/* Campo para digitar o ISBN */}
        <TextInput
          style={styles.input}
          placeholder="ISBN"
          value={isbn}
          onChangeText={setIsbn}
          keyboardType="numeric" // Teclado numérico para ISBN
        />

        {/* Botão para buscar o livro */}
        <Button title="Buscar Livro" onPress={getBook} />

        {/* Formulário para cadastrar um novo livro */}
        <Text style={styles.sectionTitle}>Cadastrar Novo Livro</Text>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={newBook.title}
          onChangeText={(text) => setNewBook({ ...newBook, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Autor"
          value={newBook.author}
          onChangeText={(text) => setNewBook({ ...newBook, author: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de Páginas (opcional)"
          value={newBook.pages}
          onChangeText={(text) => setNewBook({ ...newBook, pages: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Publicação"
          value={newBook.publishDate}
          onChangeText={(text) => setNewBook({ ...newBook, publishDate: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="URL da Capa (opcional)"
          value={newBook.cover}
          onChangeText={(text) => setNewBook({ ...newBook, cover: text })}
        />

        {/* Botão para cadastrar o novo livro */}
        <Button title="Cadastrar Livro" onPress={handleRegisterBook} color="green" />
      </ScrollView>
    </View>
  );
};

// Estilos do componente
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
  sectionTitle: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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

export default RegisterBookScreen;
