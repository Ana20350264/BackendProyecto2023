const usersModel = {
    getAll:`
            SELECT 
                * 
            FROM 
                best_selling`,

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

    getByEmail: `
            SELECT 
                id
            FROM
                best_selling
            WHERE
                Authors = ?
    `, 
//movi aqui
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

deleteRow: `
DELETE FROM
    best_selling
WHERE
    id = ?
`,
}

module.exports = usersModel;