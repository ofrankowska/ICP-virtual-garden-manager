import { v4 as uuidv4 } from 'uuid'
import { Server, StableBTreeMap, ic } from 'azle'
import express from 'express'

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

export default Server(() => {
  const app = express()
  app.use(express.json())

  app.post('/plants', (req, res) => {
    const plant: Plant = {
      ...req.body,
      id: uuidv4(),
      lastWatered: getCurrentDate(),
      createdAt: getCurrentDate(),
    }
    plantManager.insert(plant.id, plant)
    res.json(plant)
  })

  app.get('/plants', (req, res) => {
    res.json(plantManager.values())
  })

  app.get('/plants/need-watering', (req, res) => {
    const currentDate = getCurrentDate()
    const plantsNeedingWater = plantManager.values().filter(plant => {
      const lastWateredDate = new Date(plant.lastWatered)
      const daysSinceLastWatered = (currentDate.getTime() - lastWateredDate.getTime()) / (1000 * 3600 * 24)
      const needsWatering = daysSinceLastWatered >= plant.waterFrequencyDays
      return needsWatering
    })
    res.json({ plantsNeedingWater })
  })

  app.get('/plants/:id', (req, res) => {
    const plantId = req.params.id
    const plantOpt = plantManager.get(plantId)
    if ('None' in plantOpt) {
      res.status(404).send(`Couldn't find plant with id=${plantId} in the garden 😢`)
    } else {
      res.json(plantOpt.Some)
    }
  })

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

  app.put('/plants/:id', (req, res) => {
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

  app.delete('/plants/:id', (req, res) => {
    const plantId = req.params.id
    const deletedPlant = plantManager.remove(plantId)
    if ('None' in deletedPlant) {
      res.status(400).send(`Couldn't find and delete plant with id=${plantId} in the garden 😢`)
    } else {
      res.json(deletedPlant.Some)
    }
  })
  return app.listen()
})

function getCurrentDate() {
  const timestamp = new Number(ic.time())
  return new Date(timestamp.valueOf() / 1000_000)
}
