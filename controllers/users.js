const { request, response } = require('express');
const usersModel = require('../models/users');
const pool = require('../db');


/* #####################################  LISTADO TODOS  ####################################################3*/  

const listUsers = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const users = await conn.query(usersModel.getAll, (err) => {
      if (err) {
        throw err;
      }
    });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
}

/* #####################################  LISTADO POR ID  ####################################################3*/  

const listUserByID = async (req = request, res = response) => {
    const {id} = req.params;

    if (isNaN(id)) {
        res.status(400).json({msg:'Invalid ID'});
        return;
    }

    let conn;
        try {
            conn = await pool.getConnection();
            const [user] = await conn.query(usersModel.getByID, [id], (err) => { 
                if (err) {
                    throw err
                }     
            });

            if (!user) {
                res.status(404).json({msg: 'User no found'});
                return;
            }

            res.json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}

const nameSearch = async (req = request, res = response) => {
  
  const { author } = req.params;

  if (!author) {
    res.status(400).json({ msg: 'Author parameter is required' });
    return;
  }

  let conn;

  try {
    conn = await pool.getConnection();
    const authors = await conn.query(usersModel.getByName, [author]);
    
    if (!authors || authors.length === 0) {
      res.status(404).json({ msg: `Author not found with this name: ${author}` });
      return;
    }

    res.json({ msg: 'RESULT:', authors });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
}
/*
            Book = ?,
            Author(s) = ?,
            Original language = ?,
            First published = ?,
            Approximate sales in millions = ?,
            Genre = ?
*/

/* #####################################  AGREGAR  ####################################################3*/  

const addUser = async (req = request, res = response) => {

  const {
    Book,
    Authors,
    Original_language,
    First_published,
    Approximate_sales_in_millions,
    Genre = ''
} = req.body;

if (!Book || !Authors || !Original_language || !First_published || !Approximate_sales_in_millions || !Genre) {
    res.status(400).json({msg: 'Missing information'});
    return;
}

const user = [Book, Authors, Original_language, First_published, Approximate_sales_in_millions, Genre];

    let conn;

    try {
        conn = await pool.getConnection();

        const [bookito] = await conn.query(
            usersModel.getByExist,
            [Book],
            (err) => {if (err) throw err;}
        );

        if (bookito) {
          res.status(409).json({ msg: `Book with name ${Book} already exists` });
          return;
      }

        const userAdded= await conn.query(usersModel.addRow, [...user], (err) => {
            if (err) throw err;
        });

        if (userAdded.affectedRows == 0) throw new Error ({message: 'Failed to add user'});
        res.json({msg:'User added succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
  }

/* #####################################  UPDATE  ####################################################3*/  
const updateUser = async (req = request, res = response) => {
  let conn; //variable 'conn' para almacenar una conexión a la bd

  //Extrae el parámetro 'character_name' de la solicitud HTTP
  const { id } = req.params; //id

  const { //Extrae los datos actualizados del personaje del body
    Book,
    Authors,
    Original_language,
    First_published,
    Approximate_sales_in_millions,
    Genre
  } = req.body;

  let book = [ //arreglo 'character' con los datos actualizados del personaje.
  Book,
  Authors,
  Original_language,
  First_published,
  Approximate_sales_in_millions,
  Genre
  ];

  try {
      conn = await pool.getConnection(); // conexión a la base de datos utilizando el objeto 'pool

      //verificar si el personaje con el id proporcionado existe.
      const [bookExists] = await conn.query(
          usersModel.getByID,
          [id],
          (err) => { throw err; }
      );

      //Si el personaje no existe, devuelve un mensaje indicando que el personaje no se encontró
      if (!bookExists) {
          res.status(404).json({ msg: 'Book not found' });
          return;
      }
      
          //arreglo 'oldCharacter
      let oldBook = [ //muestra los datos actuales del personaje antes de la actualización
        bookExists.Book,
        bookExists.Authors,
        bookExists.Original_language,
        bookExists.First_published,
        bookExists.Approximate_sales_in_millions,
        bookExists.Genre
      ];

      //Reemplaza los datos actualizados con los datos antiguos si los datos actualizados son nulos
      book.forEach((bookData, index) => {
          if (!bookData) {
              book[index] = oldBook[index];
          }
      });

      //consulta SQL para actualizar el personaje con los datos proporcionados
      const bookUpdated = await conn.query(usersModel.updateRow, [...book, id], (err) => {
          if (err) throw err;
      });

      //Si la consulta no afecta ninguna fila, se lanza un error indicando que el personaje no se actualizó.
      if (bookUpdated.affectedRows === 0) {
          throw new Error('Book not updated');
      }

      //respuesta JSON indicando que el personaje se ha actualizado correctamente
      res.json({ msg: 'Book updated successfully', ...oldBook });
  } catch (error) {
      res.status(409).json(error);
      return;
  } finally {
      if (conn) conn.end();
  }
}

/* #####################################  BORRAR  ####################################################3*/  

const deleteUser = async (req = request, res = response) => {
  let conn;
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).json({ msg: 'Invalid ID' });
    return;
  }

  try {
    conn = await pool.getConnection();

    const [bookExists] = await conn.query(
      usersModel.getByID,
      [id],
      (err) => { throw err; }
    );

    if (!bookExists || bookExists.is_active == 0) {
      res.status(404).json({ msg: 'Book not found' });
      return;
    }

    const userDeleted = await conn.query(
      usersModel.deleteRow,
      [id],
      (err) => { if (err) throw err; }
    );

    if (userDeleted.affectedRows == 0) {
      throw new Error({ message: 'Failed to delete Book' });
    }

    res.json({ msg: 'Book deleted successfully' });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
};


/* #####################################  MODULOS  ####################################################3*/  

module.exports = {
  listUsers,
  nameSearch,
  listUserByID,
  addUser,
  updateUser,
  deleteUser
};