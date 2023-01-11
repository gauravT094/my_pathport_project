const mysql=require('mysql')

const conn=mysql.createConnection(
    {
        host: "localhost",
        user: 'root',
        password: '',
        database: 'pathports',
    }
)

conn.connect(function(err) {
    if (err) throw err;
    console.log("database Connected!");
  });
  
  function queryDb(query) {
      return new Promise((resolve, reject) => {
        conn.query(query, (err, result) => {
              if (err) {
                  return reject(err);
              }
              resolve(result);
        });
        
      })
  }