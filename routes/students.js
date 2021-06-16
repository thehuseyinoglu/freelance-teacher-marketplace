const { studentDatabase, teacherDatabase } = require('../database')
const flatted = require('flatted')
const student = require('../models/student')

const router = require('express').Router()

router.get('/', async (req, res) => {    // hangi url , callback fonksiyonu
    const students = await studentDatabase.load()
    
    res.render('students', {students})
})

router.post('/', async (req, res) => {
    const student = await studentDatabase.insert(req.body) //insertte create yaptigimiz için req.body kullanabildik

    res.send(student)
})

router.delete('/:studentId', async (req, res) =>{
    studentDatabase.removeBy('_id', req.params.studentId)

    res.send('ok')
})

router.get('/:studentId', async (req, res) => {
    const student = await studentDatabase.find(req.params.studentId)
    if(!student) return res.status(404).send('Cannot find student')
    res.render('student', {student})
})

router.post('/:studentId/bookings', async (req, res) =>{
    const { studentId } = req.params
    const { teacherId, subject, date} = req.body

    const student = await studentDatabase.find(studentId)
    const teacher = await teacherDatabase.find(teacherId)

    student.book(teacher, subject, date)

    await studentDatabase.update(student)
    await teacherDatabase.update(teacher)
    
    res.send('ok')
})

router.patch('/:studentId', async (req,res) =>{
    const {studentId} = req.params
    const {name} = req.body

    await studentDatabase.update(studentId, {name})
})

module.exports = router