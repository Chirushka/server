const db = require('../config');

class TimetableController {

    // Создание записи о расписании
    async createTimetable(req, res) {
        const { subject_id, group_id, teacher_id, day, placeInDay, start_time, end_time, place } = req.body;

        // Проверим, существует ли запись с таким расписанием для данной группы и дня
        const checkTimetableSql = "SELECT * FROM timetable WHERE day = ? AND group_id = ? AND placeInDay = ?";
        
        db.get(checkTimetableSql, [day, group_id, placeInDay], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Если расписание для данной группы в этот день уже существует
            if (row) {
                return res.status(400).json({ error: 'Timetable for this group and day already exists' });
            }

            // Если запись уникальна, продолжаем с добавлением нового расписания
            const insertTimetableSql = `
                INSERT INTO timetable (subject_id, group_id, teacher_id, day, placeInDay, start_time, end_time, place)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
        
            db.run(insertTimetableSql, [subject_id, group_id, teacher_id, day, placeInDay, start_time, end_time, place], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create timetable' });
                } else {
                    return res.status(201).json({ id: this.lastID, message: 'Timetable created successfully' });
                }
            });
        });
    }

    // Получение расписания по дню и группе
    async getTimetable(req, res) {
        const { day, group_id } = req.params; // Получаем day и group_id из параметров запроса

        const query = `
            SELECT 
                t.day,
                t.placeInDay,
                t.start_time,
                t.end_time,
                s.name AS subject_name,
                g.name AS group_name,
                te.fio AS teacher_fio,
                t.place AS place
            FROM timetable t
            JOIN subjects s ON t.subject_id = s.id
            JOIN groups g ON t.group_id = g.id
            JOIN teachers te ON t.teacher_id = te.id
            WHERE t.day = ? AND t.group_id = ?
        `;
        
        db.all(query, [day, group_id], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err });
            }
            if (rows.length === 0) {
                return res.status(404).json({ message: 'No timetable found for the given day and group' });
            }
            res.json(rows);
        });
    }
    async getTimetableByGroup(req, res) {
        const { group_id } = req.params; // Извлекаем идентификатор группы из параметров запроса

        // Проверяем, что group_id существует и является числом
        if (!group_id || isNaN(group_id)) {
            return res.status(400).json({ error: 'Invalid group ID' });
        }

        // SQL запрос для получения расписания по группе
        const query = `
            SELECT 
                t.id,
                t.day,
                t.placeInDay,
                t.start_time,
                t.end_time,
                s.name AS subject_name,
                g.name AS group_name,
                te.fio AS teacher_fio
            FROM timetable t
            JOIN subjects s ON t.subject_id = s.id
            JOIN groups g ON t.group_id = g.id
            JOIN teachers te ON t.teacher_id = te.id
            WHERE t.group_id = ?
            ORDER BY t.day, t.placeInDay;
        `;

        // Выполняем запрос
        db.all(query, [group_id], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error', details: err });
            }

            // Если расписание для группы не найдено
            if (rows.length === 0) {
                return res.status(404).json({ message: 'No timetable found for the group' });
            }

            // Если расписание найдено, возвращаем его
            return res.json({ timetable: rows });
        });
    }
    async getTimetableByTeacher(req, res) {
        const { teacher_id } = req.params; // Извлекаем идентификатор преподавателя из параметров запроса

        // Проверяем, что teacher_id существует и является числом
        if (!teacher_id || isNaN(teacher_id)) {
            return res.status(400).json({ error: 'Invalid teacher ID' });
        }

        // SQL запрос для получения расписания по преподавателю
        const query = `
            SELECT 
                t.id,
                t.day,
                t.placeInDay,
                t.start_time,
                t.end_time,
                s.name AS subject_name,
                g.name AS group_name,
                te.fio AS teacher_fio
            FROM timetable t
            JOIN subjects s ON t.subject_id = s.id
            JOIN groups g ON t.group_id = g.id
            JOIN teachers te ON t.teacher_id = te.id
            WHERE t.teacher_id = ?
            ORDER BY t.day, t.placeInDay;
        `;

        // Выполняем запрос
        db.all(query, [teacher_id], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error', details: err });
            }

            // Если расписание для преподавателя не найдено
            if (rows.length === 0) {
                return res.status(404).json({ message: 'No timetable found for the teacher' });
            }

            // Если расписание найдено, возвращаем его
            return res.json({ timetable: rows });
        });
    }
    async getTimetableByPlace(req, res) {
        const { place } = req.params; // Извлекаем место (аудиторию или локацию) из параметров запроса

        // Проверяем, что place существует
        if (!place) {
            return res.status(400).json({ error: 'Invalid place' });
        }

        // SQL запрос для получения расписания по месту
        const query = `
            SELECT 
                t.id,
                t.day,
                t.placeInDay,
                t.start_time,
                t.end_time,
                s.name AS subject_name,
                g.name AS group_name,
                te.fio AS teacher_fio
            FROM timetable t
            JOIN subjects s ON t.subject_id = s.id
            JOIN groups g ON t.group_id = g.id
            JOIN teachers te ON t.teacher_id = te.id
            WHERE t.place = ?
            ORDER BY t.day, t.placeInDay;
        `;

        // Выполняем запрос
        db.all(query, [place], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error', details: err });
            }

            // Если расписание для места не найдено
            if (rows.length === 0) {
                return res.status(404).json({ message: 'No timetable found for this place' });
            }

            // Если расписание найдено, возвращаем его
            return res.json({ timetable: rows });
        });
    }
    async updateTimetable(req, res) {
        const { id, subject_id, group_id, teacher_id, place, day, placeInDay, start_time, end_time } = req.body;

        // Проверка на наличие всех необходимых данных
        if (!id || !subject_id || !group_id || !teacher_id || !place || !day || !placeInDay || !start_time || !end_time) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // SQL запрос для обновления записи в расписании
        const updateQuery = `
            UPDATE timetable
            SET 
                subject_id = ?, 
                group_id = ?, 
                teacher_id = ?, 
                place = ?, 
                day = ?, 
                placeInDay = ?, 
                start_time = ?, 
                end_time = ?
            WHERE id = ?;
        `;

        // Выполнение запроса
        db.run(updateQuery, [subject_id, group_id, teacher_id, place, day, placeInDay, start_time, end_time, id], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error', details: err.message });
            }

            // Проверяем, была ли изменена хотя бы одна запись
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Timetable entry not found' });
            }

            // Возвращаем успешный ответ
            return res.json({ message: 'Timetable updated successfully' });
        });
    }


    // Удаление записи расписания
    async deleteTimetable(req, res) {
        const { id } = req.body;

        // Проверим, существует ли запись с таким id
        const checkTimetableSql = 'SELECT * FROM timetable WHERE id = ?';
        
        db.get(checkTimetableSql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err });
            }
            // Если запись не существует
            if (!row) {
                return res.status(404).json({ message: 'Timetable entry not found' });
            }

            // Удалим запись
            const deleteTimetableSql = 'DELETE FROM timetable WHERE id = ?';

            db.run(deleteTimetableSql, [id], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete timetable entry', details: err });
                }
                return res.json({ message: 'Timetable entry deleted successfully' });
            });
        });
    }

}

module.exports = new TimetableController();
