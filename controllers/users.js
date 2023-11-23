const { request, response } = require('express');
const usersModel = require('../models/users');
const pool = require('../db');

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
/*
{
    username: 'admin',
    email: 'admin@example.com',
    password: '123',
    name: 'Administrador',
    lastname: 'Del Sitio',
    phone_number: '5555',
    role_id: '1',
    is_active: '1'
}
*/ 

/*
            Book = ?,
            Author(s) = ?,
            Original language = ?,
            First published = ?,
            Approximate sales in millions = ?,
            Genre = ?
*/


const addUser = async (req = request, res = response) => {

  const {
    Book,
    Authors,
    Original_language,
    First_published,
    Approximate_sales_in_millions,
    Genre = '',
} = req.body;

if (!Book || !Authors || !Original_language || !First_published || !Approximate_sales_in_millions || !Genre) {
    res.status(400).json({msg: 'Missing information'});
    return;
}

const saltRounds = 10;

const user = [Book, Authors, Original_language, First_published, Approximate_sales_in_millions, Genre];

    let conn;

    try {
        conn = await pool.getConnection();

        const [usernameUser] = await conn.query(
            usersModel.getByUsername,
            [Book],
            (err) => {if (err) throw err;}
        );
        if (usernameUser) {
            res.status(409).json({msg: `Book ${Book} alredy exist`});
            return;
        }

        const [emailUser] = await conn.query(
            usersModel.getByEmail,
            [Authors],
            (err) => {if (err) throw err;}
        );
        if (emailUser) {
            res.status(409).json({msg: `Author ${Authors} alredy exist`});
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

//incia movida    
const updateUser = async (req = request, res = response) => {
  let conn;
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).json({ msg: 'Invalid ID' });
    return;
  }

  const {
    Book,
    Authors,
    Original_language,
    First_published,
    Approximate_sales_in_millions,
    Genre
  } = req.body;

  let user = {
    Book,
    Authors,
    Original_language,
    First_published,
    Approximate_sales_in_millions,
    Genre
  };

  try {
    conn = await pool.getConnection();

    const [userExist] = await conn.query(
      usersModel.getByID,
      [id]
    );

    const [usernameUser] = await conn.query(
      usersModel.getByUsername,
      [Book]
    );

    const [emailUser] = await conn.query(
      usersModel.getByEmail,
      [Authors]
    );

    let oldUser = {
      Book: userExist.Book,
      Authors: userExist.Authors,
      Original_language: userExist.Original_language,
      First_published: userExist.First_published,
      Approximate_sales_in_millions: userExist.Approximate_sales_in_millions,
      Genre: userExist.Genre
    };

    for (const prop in user) {
      if (!user[prop]) {
        user[prop] = oldUser[prop];
      }
    }

    await conn.query(
      usersModel.updateRow,
      [user.Book, user.Authors, user.Original_language, user.First_published, user.Approximate_sales_in_millions, user.Genre, id]
    );

    res.json({ msg: 'User updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
}
//termina movida



const deleteUser = async (req = request, res = response) => {
  let conn;
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).json({ msg: 'Invalid ID' });
    return;
  }

  try {
    conn = await pool.getConnection();

    const [userExists] = await conn.query(
      usersModel.getByID,
      [id],
      (err) => { throw err; }
    );

    if (!userExists || userExists.is_active == 0) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }

    const userDeleted = await conn.query(
      usersModel.deleteRow,
      [id],
      (err) => { if (err) throw err; }
    );

    if (userDeleted.affectedRows == 0) {
      throw new Error({ message: 'Failed to delete user' });
    }

    res.json({ msg: 'User deleted successfully' });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
};

module.exports = {
                  listUsers, 
                  listUserByID, 
                  addUser, 
                  updateUser, 
                  deleteUser, 
                };