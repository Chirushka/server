const db = require('../config');

class groupsController {

    // Создание группы
    async createGroup(req, res) {
        const { name } = req.body;
    
        // Сначала проверим, существует ли группа с таким же названием
        const checkGroupSql = "SELECT * FROM groups WHERE name = ?";
        
        db.get(checkGroupSql, [name], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
    
            // Если группа с таким названием уже существует
            if (row) {
                return res.status(400).json({ error: 'Group with this name already exists' });
            }
    
            // Если группа уникальна, создаем новую
            const insertGroupSql = "INSERT INTO groups (name) VALUES (?)";
    
            db.run(insertGroupSql, [name], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create group' });
                } else {
                    return res.status(201).json({ id: this.lastID, name: name }); // Возвращаем ID новой группы
                }
            });
        });
    }
    async updateGroup(req, res) {
        const { group_id, name } = req.body;

        // Проверяем, указаны ли все необходимые данные
        if (!group_id || !name) {
            return res.status(400).json({ error: 'Group ID and name are required' });
        }

        // Проверяем, существует ли группа с данным ID
        const checkGroupSql = 'SELECT * FROM groups WHERE id = ?';
        db.get(checkGroupSql, [group_id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err });
            }

            // Если группа не существует
            if (!row) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Обновляем данные группы
            const updateGroupSql = 'UPDATE groups SET name = ? WHERE id = ?';

            db.run(updateGroupSql, [name, group_id], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update group', details: err });
                }

                // Проверим, были ли внесены изменения
                if (this.changes === 0) {
                    return res.status(404).json({ message: 'No changes made to the group' });
                }

                return res.json({ message: 'Group updated successfully', updated_id: group_id });
            });
        });
    }

    // Получение списка групп
    async getGroups(req, res) {
        const sql = "SELECT * FROM groups";
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(rows);
        });
    }

    // Удаление группы
    async deleteGroup(req, res) {
        const { id } = req.body;
    
        // Проверяем, указан ли id и является ли он числом
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid group ID' });
        }
    
        // Проверяем, существует ли группа с данным ID
        const checkGroupSql = 'SELECT * FROM groups WHERE id = ?';
    
        db.get(checkGroupSql, [id], (err, group) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
    
            // Если группа не существует, возвращаем ошибку
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }
    
            // Удаляем группу
            const deleteSql = 'DELETE FROM groups WHERE id = ?';
    
            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
    
                // Проверяем, сколько записей было удалено
                if (this.changes === 0) {
                    return res.status(404).json({ message: 'Group not found' });
                }
    
                return res.json({ message: 'Group deleted successfully' });
            });
        });
    }
}

module.exports = new groupsController();
