const db = require('../config');

class TeacherController {

    // Создание преподавателя
    async createTeacher(req, res) {
        const { fio, login, pass } = req.body;

        // Сначала проверим, существует ли уже преподаватель с таким логином
        const checkTeacherSql = "SELECT * FROM teachers WHERE login = ?";
        
        db.get(checkTeacherSql, [login], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Если преподаватель с таким логином уже существует
            if (row) {
                return res.status(400).json({ error: 'Teacher with this login already exists' });
            }

            // Если логин уникален, продолжаем с созданием преподавателя
            const insertTeacherSql = "INSERT INTO teachers (fio, login, pass) VALUES (?, ?, ?)";

            db.run(insertTeacherSql, [fio, login, pass], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create teacher' });
                } else {
                    return res.status(201).json({ id: this.lastID, fio: fio, login: login }); // Возвращаем ID нового преподавателя
                }
            });
        });
    }

    // Получение преподавателя по логину и паролю
    async getTeacher(req, res) {
        const { login, pass } = req.body;
        const sql = "SELECT * FROM teachers WHERE login = ? AND pass = ?";

        db.all(sql, [login, pass], (err, rows) => {
            if (err) return res.json(err);
            if (rows.length === 0) return res.json('Incorrect credentials. Please check and try again.');
            else res.json(rows);
        });
    }

    // Удаление преподавателя
    async deleteTeacher(req, res) {
        const { id } = req.body;

        // Проверяем, указан ли id и является ли он числом
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid teacher ID' });
        }

        // Проверяем, существует ли преподаватель с данным ID
        const checkTeacherSql = 'SELECT * FROM teachers WHERE id = ?';

        db.get(checkTeacherSql, [id], (err, teacher) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Если преподаватель не существует, возвращаем ошибку
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found' });
            }

            // Удаляем преподавателя
            const deleteSql = 'DELETE FROM teachers WHERE id = ?';

            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                // Проверяем, сколько записей было удалено
                if (this.changes === 0) {
                    return res.status(404).json({ message: 'Teacher not found' });
                }

                return res.json({ message: 'Teacher deleted successfully' });
            });
        });
    }
}

module.exports = new TeacherController();
