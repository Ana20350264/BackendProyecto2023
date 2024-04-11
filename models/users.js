const usersModel = {
    getAll:`
            SELECT 
                * 
            FROM 
                best_selling`,

    getByName: `
        SELECT 
            * 
        FROM 
            best_selling
        WHERE 
            Authors LIKE CONCAT('%', ?, '%')
    `,

    getByID : `
            SELECT
                *
            FROM
                best_selling
            WHERE
                id = ?
            `,
    
updateRow: `
    UPDATE 
        best_selling
    SET
        Book = ?,
        Authors = ?,
        Original_language = ?,
        First_published = ?,
        Approximate_sales_in_millions = ?,
        Genre = ?
    WHERE
        id = ?
`,
    
    getByUsername: `
            SELECT 
                id 
            FROM
                best_selling
            WHERE
                Book = ?
    `,

    getByExist: `
    SELECT 
    * 
    FROM
        best_selling
    WHERE 
    Book = ?
    `,
 
    addRow: `
  INSERT INTO best_selling (
    Book,
    Authors,
    Original_language,
    First_published,
    Approximate_sales_in_millions,
    Genre
  ) VALUES (?, ?, ?, ?, ?, ?)
`,


deleteRow: `
DELETE FROM
    best_selling
WHERE
    id = ?
`,

updatePartialRow: `
    UPDATE 
        best_selling
    SET
        Book = IFNULL(?, Book),
        Authors = IFNULL(?, Authors),
        Original_language = IFNULL(?, Original_language),
        First_published = IFNULL(?, First_published),
        Approximate_sales_in_millions = IFNULL(?, Approximate_sales_in_millions),
        Genre = IFNULL(?, Genre)
    WHERE
        id = ?
`,
}

module.exports = usersModel;