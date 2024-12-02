const db = require('../config');

class SubjectController {

    // Создание предмета
    async createSubject(req, res) {
        const { name } = req.body;
    
        // Сначала проверим, существует ли уже предмет с таким названием
        const checkSubjectSql = "SELECT * FROM subjects WHERE name = ?";
        
        db.get(checkSubjectSql, [name], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
    
            // Если предмет с таким названием уже существует
            if (row) {
                return res.status(400).json({ error: 'Subject with this name already exists' });
            }
    
            // Если название уникально, продолжаем с созданием предмета
            const insertSubjectSql = "INSERT INTO subjects (name) VALUES (?)";
    
            db.run(insertSubjectSql, [name], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create subject' });
                } else {
                    return res.status(201).json({ id: this.lastID, name: name }); // Возвращаем ID нового предмета
                }
            });
        });
    }

    // Получение всех предметов
    async getSubjects(req, res) {
        const sql = "SELECT * FROM subjects";
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(rows);
        });
    }

    // Получение предмета по ID
    async getSubjectById(req, res) {
        const { id } = req.params;
    
        // Проверяем, существует ли предмет с данным ID
        const checkSubjectSql = 'SELECT * FROM subjects WHERE id = ?';
    
        db.get(checkSubjectSql, [id], (err, subject) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
    
            // Если предмет не существует, возвращаем ошибку
            if (!subject) {
                return res.status(404).json({ message: 'Subject not found' });
            }
    
            return res.json(subject); // Возвращаем предмет по ID
        });
    }
    async updateSubject(req, res) {
        const { subject_id, name } = req.body;

        // Проверяем, указаны ли все необходимые данные
        if (!subject_id || !name) {
            return res.status(400).json({ error: 'Subject ID and name are required' });
        }

        // Проверяем, существует ли предмет с данным ID
        const checkSubjectSql = 'SELECT * FROM subjects WHERE id = ?';
        db.get(checkSubjectSql, [subject_id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err });
            }

            // Если предмет не существует
            if (!row) {
                return res.status(404).json({ message: 'Subject not found' });
            }

            // Обновляем данные предмета
            const updateSubjectSql = 'UPDATE subjects SET name = ? WHERE id = ?';

            db.run(updateSubjectSql, [name, subject_id], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update subject', details: err });
                }

                // Проверим, были ли внесены изменения
                if (this.changes === 0) {
                    return res.status(404).json({ message: 'No changes made to the subject' });
                }

                return res.json({ message: 'Subject updated successfully', updated_id: subject_id });
            });
        });
    }

    // Удаление предмета
    async deleteSubject(req, res) {
        const { id } = req.body;
    
        // Проверяем, указан ли id и является ли он числом
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid subject ID' });
        }
    
        // Проверяем, существует ли предмет с данным ID
        const checkSubjectSql = 'SELECT * FROM subjects WHERE id = ?';
    
        db.get(checkSubjectSql, [id], (err, subject) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
    
            // Если предмет не существует, возвращаем ошибку
            if (!subject) {
                return res.status(404).json({ message: 'Subject not found' });
            }
    
            // Удаляем предмет
            const deleteSql = 'DELETE FROM subjects WHERE id = ?';
    
            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
    
                // Проверяем, сколько записей было удалено
                if (this.changes === 0) {
                    return res.status(404).json({ message: 'Subject not found' });
                }
    
                return res.json({ message: 'Subject deleted successfully' });
            });
        });
    }
}

module.exports = new SubjectController();
