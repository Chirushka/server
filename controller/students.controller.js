const db = require('../config')




class StudentsController{

    //Создание пользователя
    async createStudent(req, res) {
        const { fio, login, pass, token, group_id } = req.body;
    
        // Сначала проверим, существует ли уже пользователь с таким логином
        const checkStudentSql = "SELECT * FROM students WHERE login = ?";
        
        db.get(checkStudentSql, [login], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
    
            // Если пользователь с таким логином уже существует
            if (row) {
                return res.status(400).json({ error: 'User with this login already exists' });
            }
    
            // Если логин уникален, продолжаем с созданием пользователя
            const insertStudentSql = "INSERT INTO students (fio, login, pass, token, group_id) VALUES (?, ?, ?, ?, ?)";
    
            db.run(insertStudentSql, [fio, login, pass, "token", group_id], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create user' });
                } else {
                    return res.status(201).json({ id: this.lastID, login: login }); // Возвращаем ID нового пользователя
                }
            });
        });
    }
    

    //Получение пользователя
    async getStudent(req,res){
        const { login, password} = req.body
        const sql = (
            `select * from students where (login=? AND pass=?);`
        )
        db.all(sql,[login, password], (err,rows) => {
            if (err) return res.json(err)
            if(rows.length === 0) return res.json('Данные не совпадают! Проверьте и повторите попытку')
            else res.json(rows)
    })
    }


    //Удаление пользователя
    async deleteStudent(req, res) {
        const { id } = req.body;
    
        // Проверяем, указан ли id и является ли он числом
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
    
        // Проверяем, существует ли пользователь с данным ID
        const checkUserSql = 'SELECT * FROM students WHERE id = ?';
    
        db.get(checkUserSql, [id], (err, user) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
    
            // Если пользователь не существует, возвращаем ошибку
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Удаляем пользователя
            const deleteSql = 'DELETE FROM students WHERE id = ?';
    
            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
    
                // Проверяем, сколько записей было удалено
                if (this.changes === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }
    
                return res.json({ message: 'User deleted successfully' });
            });
        });
    }
    
    
    
    //Установка токена телефона к юзеру
    async setStudentToken(req,res){
        const {user, token} =req.body
        
        const sql = (
            ` update students set token=? where id=?;`
        )

        db.all(sql,[token, user], (err,rows) => {
            if (err) return res.json(err)
            else res.json(rows)
        })
    }

    async setStudentGrp(req,res){
        const {user, group_id} =req.body
        
        const sql = (
            ` update users set group_id=? where id=?;`
        )

        db.all(sql,[group_id, user], (err,rows) => {
            if (err) return res.json(err)
            else res.json(rows)
        })
    }
    
}



module.exports = new StudentsController()