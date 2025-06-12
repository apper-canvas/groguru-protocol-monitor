import journalData from '../mockData/journal.json';
import plantsData from '../mockData/plants.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class JournalService {
  constructor() {
    this.entries = [...journalData];
    this.plants = [...plantsData];
  }

  async getAll() {
    await delay(300);
    return this.entries.map(entry => ({
      ...entry,
      plantName: this.plants.find(p => p.id === entry.plantId)?.nickname || 'Unknown Plant'
    })).sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getById(id) {
    await delay(200);
    const entry = this.entries.find(e => e.id === id);
    if (!entry) throw new Error('Journal entry not found');
    
    return {
      ...entry,
      plantName: this.plants.find(p => p.id === entry.plantId)?.nickname || 'Unknown Plant'
    };
  }

  async create(entryData) {
    await delay(350);
    const newEntry = {
      id: Date.now().toString(),
      plantId: entryData.plantId,
      type: entryData.type,
      title: entryData.title,
      notes: entryData.notes || '',
      date: new Date().toISOString(),
      photos: entryData.photos || [],
      measurements: entryData.measurements || {}
    };
    
    this.entries.push(newEntry);
    return {
      ...newEntry,
      plantName: this.plants.find(p => p.id === newEntry.plantId)?.nickname || 'Unknown Plant'
    };
  }

  async update(id, data) {
    await delay(300);
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Journal entry not found');
    
    this.entries[index] = { ...this.entries[index], ...data };
    return {
      ...this.entries[index],
      plantName: this.plants.find(p => p.id === this.entries[index].plantId)?.nickname || 'Unknown Plant'
    };
  }

  async delete(id) {
    await delay(250);
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Journal entry not found');
    
    this.entries.splice(index, 1);
    return true;
  }

  async getPlants() {
    await delay(150);
    return [...this.plants];
  }
}

export const journalService = new JournalService();