function selectAllUsers(pool) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) { 
                reject(err) 
            }
            connection.query('select * from users', (err, rows) => {
                if (err) { 
                    reject(err) 
                
                resolve(rows)
                connection.release()
                console.log("Connection released")
                }
            })
        })
    })
}
function selectSingleUser(pool, email) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) { 
                reject(err) 
            }
            connection.query(`select * from users where email like '${email}'`, (err, rows) => {
                if (err) { 
                    reject(err) 
                    return
                }
                if(rows.length > 0){
                    resolve(rows)
                }else {reject(rows)}
                //console.log('consulta: ', rows)
                
                connection.release()
                //console.log("Connection released")

            })
        })
    })
}
function selectSingleUserObj(pool, user) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) { 
                reject(err) 
            }
            connection.query(`select * from users where email like '${user.email}'`, (err, rows) => {
                if (err) { 
                    reject(err) 
                    return
                }
                resolve(rows)
                connection.release()

            })
        })
    })
}
function NewUser(pool, user) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) { 
                console.log('erro na conexao: ' + err)
                reject(err) 
            }
            var insert = `insert into users values ('${user.id}', '${user.name}', '${user.aadObjectId}', '${user.givenName}', '${user.surname}', '${user.email}', '${user.userPrincipalName}', '${user.tenantId}', '${user.userRole}', 'null')`
            connection.query(insert, (err, rows) => {
                if (err) { 
                    console.log('Erro: ' + err)
                    reject(err) 
                    return
                }
                console.log('inserido: ', rows)
                resolve(rows)
                connection.release()
                

            })
        })
    })
}
function UpdateSession(pool, user, session_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) { 
                console.log('erro na conexao: ' + err)
                reject(err) 
            }
            var update = `update users set session_id = '${session_id}' where id = '${user.id}'`
            connection.query(update, (err, rows) => {
                if (err) { 
                    console.log('Erro: ' + err)
                    reject(err) 
                    return
                }
                console.log('inserido: ', rows)
                resolve(rows)
                connection.release()


            })
        })
    })
}
function SelectSession(pool, user) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) { 
                console.log('erro na conexao: ' + err)
                reject(err) 
            }
            var update = `select session_id from users where id = '${user.id}'`
            connection.query(update, (err, rows) => {
                if (err) { 
                    console.log('Erro: ' + err)
                    reject(err) 
                    return
                }
                console.log('selecao session antiga: ', rows)
                resolve(rows)
                connection.release()
                

            })
        })
    })
}
module.exports = {
    selectAllUsers, 
    selectSingleUser,
    NewUser,
    selectSingleUserObj, 
    UpdateSession, 
    SelectSession
}

