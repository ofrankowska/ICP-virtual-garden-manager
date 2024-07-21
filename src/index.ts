import { v4 as uuidv4 } from 'uuid'
import { Server, StableBTreeMap, ic } from 'azle'
import express, { Request, Response, NextFunction } from 'express'

class Plant {
  id: string
  name: string
  species: string
  lastWatered: Date
  waterFrequencyDays: number
  notes: string
  createdAt: Date
  updatedAt: Date | null
}

const plantManager = StableBTreeMap<string, Plant>(0)

const app = express()
app.use(express.json())

// Middleware for error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// Middleware for validating plant data
const validatePlant = (req: Request, res: Response, next: NextFunction) => {
  const { name, species, waterFrequencyDays } = req.body
  if (typeof name !== 'string' || typeof species !== 'string' || typeof waterFrequencyDays !== 'number') {
    return res.status(400).send('Invalid data format')
  }
  next()
}

// Create a new plant
app.post('/plants', validatePlant, (req, res) => {
  const plant: Plant = {
    ...req.body,
    id: uuidv4(),
    lastWatered: getCurrentDate(),
    createdAt: getCurrentDate(),
    updatedAt: null
  }
  plantManager.insert(plant.id, plant)
  res.json(plant)
})

// Get all plants
app.get('/plants', (req, res) => {
  res.json(plantManager.values())
})

// Get plants that need watering
app.get('/plants/need-watering', (req, res) => {
  const currentDate = getCurrentDate()
  const plantsNeedingWater = plantManager.values().filter(plant => {
    const lastWateredDate = new Date(plant.lastWatered)
    const daysSinceLastWatered = (currentDate.getTime() - lastWateredDate.getTime()) / (1000 * 3600 * 24)
    return daysSinceLastWatered >= plant.waterFrequencyDays
  })
  res.json({ plantsNeedingWater })
})

// Get a plant by ID
app.get('/plants/:id', (req, res) => {
  const plantId = req.params.id
  const plantOpt = plantManager.get(plantId)
  if ('None' in plantOpt) {
    res.status(404).send(`Couldn't find plant with id=${plantId} in the garden 😢`)
  } else {
    res.json(plantOpt.Some)
  }
})

// Water a plant by ID
app.put('/plants/:id/water', (req, res) => {
  const plantId = req.params.id
  const plantOpt = plantManager.get(plantId)
  if ('None' in plantOpt) {
    res.status(400).send(`Couldn't find and water plant with id=${plantId} in the garden 😢`)
  } else {
    const plant = plantOpt.Some
    const updatedPlant = {
      ...plant,
      lastWatered: getCurrentDate(),
      updatedAt: getCurrentDate(),
    }
    plantManager.insert(plant.id, updatedPlant)
    res.json(updatedPlant)
  }
})

// Update a plant by ID
app.put('/plants/:id', validatePlant, (req, res) => {
  const plantId = req.params.id
  const plantOpt = plantManager.get(plantId)
  if ('None' in plantOpt) {
    res.status(400).send(`Couldn't find and update plant with id=${plantId} in the garden 😢`)
  } else {
    const plant = plantOpt.Some
    const updatedPlant = {
      ...plant,
      ...req.body,
      updatedAt: getCurrentDate(),
    }
    plantManager.insert(plant.id, updatedPlant)
    res.json(updatedPlant)
  }
})

// Delete a plant by ID
app.delete('/plants/:id', (req, res) => {
  const plantId = req.params.id
  const deletedPlant = plantManager.remove(plantId)
  if ('None' in deletedPlant) {
    res.status(400).send(`Couldn't find and delete plant with id=${plantId} in the garden 😢`)
  } else {
    res.json(deletedPlant.Some)
  }
})

// Get plants by species
app.get('/plants/species/:species', (req, res) => {
  const species = req.params.species
  const plantsBySpecies = plantManager.values().filter(plant => plant.species.toLowerCase() === species.toLowerCase())
  res.json(plantsBySpecies)
})

// Get plants created within a date range
app.get('/plants/date-range', (req, res) => {
  const { start, end } = req.query
  if (!start || !end) {
    return res.status(400).send('Please provide start and end date')
  }
  const startDate = new Date(start.toString())
  const endDate = new Date(end.toString())
  const plantsInDateRange = plantManager.values().filter(plant =>
    new Date(plant.createdAt) >= startDate && new Date(plant.createdAt) <= endDate
  )
  res.json(plantsInDateRange)
})

// Helper function to get current date
function getCurrentDate() {
  const timestamp = new Number(ic.time())
  return new Date(timestamp.valueOf() / 1000_000)
}

export default Server(() => app.listen())
