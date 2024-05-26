// TODO: add encryption local data
import fs from 'node:fs/promises'
import path from 'node:path'
import { app } from 'electron'

interface LocalDataContact {
  name: string
}
interface LocalData {
  id: string
  contacts: Map<string, LocalDataContact>
}

const DATA_FILE_PATH = path.join(app.getPath('userData'), 'data.json')

// Replacer function for JSON.stringify to handle Maps
function replacer(key: string, value: any) {
  if (value instanceof Map) {
    return Object.fromEntries(value)
  }
  return value
}

export async function initializeDataFile() {
  try {
    // Check if the file exists
    await fs.access(DATA_FILE_PATH)
    return await loadData()
  } catch (error) {
    // File does not exist, create and initialize it
    const initialData: LocalData = {
      id: crypto.randomUUID(),
      contacts: new Map(),
    }
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(initialData, replacer, 2))
    return initialData
  }
}

export async function loadData() {
  try {
    const rawData = await fs.readFile(DATA_FILE_PATH, 'utf-8')
    return JSON.parse(rawData, (key, value) => {
      if (key === 'contacts') {
        return new Map(Object.entries(value))
      }
      return value
    }) as LocalData
  } catch (error) {
    console.error('Failed to load data:', error)
    return null
  }
}

async function saveData(data: LocalData) {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, replacer, 2))
  } catch (error) {
    console.error('Failed to save data:', error)
  }
}

export async function addContact(id: string, data: LocalDataContact) {
  try {
    // Load existing data
    const localData = await loadData()
    if (localData) {
      // Add new contact to contacts array
      localData.contacts.set(id, data)
      // Save updated data back to file
      await saveData(localData)
    } else {
      console.error('No data found, unable to add contact.')
    }
  } catch (error) {
    console.error('Failed to add contact:', error)
  }
}

export async function deleteContact(id: string) {
  try {
    // Load existing data
    const localData = await loadData()
    if (localData) {
      // Check if contact exists and delete
      if (localData.contacts.delete(id)) {
        // Save updated data back to file
        await saveData(localData)
        console.log(`Contact with id ${id} deleted.`)
      } else {
        console.error(`Contact with id ${id} not found.`)
      }
    } else {
      console.error('No data found, unable to delete contact.')
    }
  } catch (error) {
    console.error('Failed to delete contact:', error)
  }
}
