const express = require('express')
const cors = require('cors')
const { uuid } = require('uuidv4')

const app = express()

app.use(cors())
app.use(express.json())

const projects = []

app.use((req, res, next) => {
  console.log(`${req.method} - ${req.originalUrl}`)
  next()
})

app.get('/projects', (req, res) => {
  return res.json(projects)
})

app.post('/projects', (request, response) => {
  const { title, owner } = request.body
  const project = {
    id: uuid(),
    title,
    owner
  }
  projects.push(project)

  return response.json({ ...project })
})

app.put('/projects/:id', (request, response) => {
  const { id } = request.params
  const { title, owner } = request.body

  const projectIndex = projects.findIndex((proj) => proj.id === id)
  if (projectIndex < 0)
    return response.status(400).json({ error: 'Project not found.' })

  const proj = projects[projectIndex]
  proj.title = title || proj.title
  proj.owner = owner || proj.owner

  return response.json(proj)
})

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params

  const projectIndex = projects.findIndex((proj) => proj.id === id)
  if (projectIndex < 0)
    return response.status(400).json({ error: 'Project not found.' })

  projects.splice(projectIndex, 1)

  return response.status(204).send()
})

app.listen(3333, () => {
  console.log('Running on localhost:3333')
})
