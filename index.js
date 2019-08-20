const express = require('express')

const app = express()

let requestCount = 0
const projects = [
    {
        id: 1,
        title: 'Projeto 1',
        tasks: []
    },
    {
        id: 2,
        title: 'Projeto 2',
        tasks: []
    }
]

app.use(express.json())

app.use((req, res, next) => {
    requestCount++

    console.log(`Requisição número: ${requestCount}`)

    return next()
})

function checkProjectExisting(req, res, next) {
    const { id } = req.params

    if(!projects.find(proj => proj.id == id)) {
        return res.status(400).json({ msg: 'Project does not exists.' })
    }

    return next()
}

app.get('/projects', (req, res) => {
    return res.json(projects)
})

app.post('/projects', (req, res) => {
    const { id, title } = req.body

    if(!id || !title) {
        return res.status(400).json({ msg: 'Incorrect parameters.' })
    }

    if(projects.some(proj => proj.id === id)) {
        return res.status(400).json({ msg: 'Project already existing.' })
    }

    projects.push({
        id,
        title,
        tasks: []
    })

    return res.json(projects)
})

app.post('/projects/:id/tasks', checkProjectExisting, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    if(!title || !title.length) {
        return res.status(400).json({ msg: 'Invalid task title.' })
    }

    const project = projects.find(proj => proj.id == id)

    project.tasks.push(title)

    return res.json(projects)
})

app.put('/projects/:id', checkProjectExisting, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    if(!title || !title.length) {
        return res.status(400).json({ msg: 'Invalid parameter.' })
    }

    const project = projects.find(proj => proj.id == id)

    project.title = title

    return res.json(projects)
})

app.delete('/projects/:id', checkProjectExisting, (req, res) => {
    const { id } = req.params

    const project = projects.find(proj => proj.id == id)

    const position = projects.indexOf(project)

    projects.splice(position, 1)

    return res.json(projects)
})

app.listen(3000)