const express = require('express')
const groupRouter = require('./routes/groups.routes')
const studentsRouter = require('./routes/students.routes')
const subjectsRouter = require('./routes/subjects.routes')
const teachersRouter = require('./routes/teachers.routes')
const timetableRouter = require('./routes/timetable.routes')

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080

const app = express()

app.use(bodyParser.json({limit: '500mb'}))
app.use('/api',groupRouter)
app.use('/api',studentsRouter)
app.use('/api',subjectsRouter,)
app.use('/api',teachersRouter,)
app.use('/api',timetableRouter)



app.listen(PORT, () => console.log(`Сервер запущен с портом: ${PORT}`))


