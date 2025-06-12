import plantsData from '../mockData/plants.json';
import speciesData from '../mockData/species.json';
import tasksData from '../mockData/tasks.json';
import weatherData from '../mockData/weather.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PlantService {
  constructor() {
    this.plants = [...plantsData];
    this.species = [...speciesData];
    this.tasks = [...tasksData];
    this.weather = { ...weatherData };
  }

  async getAll() {
    await delay(300);
    return this.plants.map(plant => ({
      ...plant,
      species: this.species.find(s => s.id === plant.speciesId),
      daysOld: Math.floor((new Date() - new Date(plant.plantedDate)) / (1000 * 60 * 60 * 24))
    }));
  }

  async getById(id) {
    await delay(250);
    const plant = this.plants.find(p => p.id === id);
    if (!plant) throw new Error('Plant not found');
    
    return {
      ...plant,
      species: this.species.find(s => s.id === plant.speciesId),
      daysOld: Math.floor((new Date() - new Date(plant.plantedDate)) / (1000 * 60 * 60 * 24)),
      careHistory: [
        {
          action: 'Watered',
          date: plant.lastWatered,
          icon: 'Droplets',
          color: 'text-blue-500'
        },
        ...(plant.lastFertilized ? [{
          action: 'Fertilized',
          date: plant.lastFertilized,
          icon: 'Sprout',
          color: 'text-green-500'
        }] : [])
      ],
      stats: {
        totalWaterings: Math.floor(Math.random() * 20) + 5,
        growthRate: Math.floor(Math.random() * 15) + 5,
        healthTrend: `+${Math.floor(Math.random() * 10) + 1}`,
        journalEntries: Math.floor(Math.random() * 8) + 2
      }
    };
  }

  async create(plantData) {
    await delay(400);
    const newPlant = {
      id: Date.now().toString(),
      userId: 'user-1',
      speciesId: plantData.species.id,
      nickname: plantData.nickname,
      location: plantData.location || 'Indoor',
      plantedDate: plantData.plantedDate,
      healthStatus: 'healthy',
      healthScore: Math.floor(Math.random() * 20) + 80,
      waterLevel: Math.floor(Math.random() * 30) + 70,
      lightLevel: Math.floor(Math.random() * 25) + 75,
      temperature: Math.floor(Math.random() * 6) + 20,
      lastWatered: null,
      lastFertilized: null,
      photos: plantData.photo ? [{
        id: Date.now().toString(),
        url: plantData.photo.preview,
        capturedAt: new Date().toISOString()
      }] : [],
      notes: plantData.notes || ''
    };
    
    this.plants.push(newPlant);
    return newPlant;
  }

  async update(id, data) {
    await delay(300);
    const index = this.plants.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Plant not found');
    
    this.plants[index] = { ...this.plants[index], ...data };
    return this.plants[index];
  }

  async delete(id) {
    await delay(250);
    const index = this.plants.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Plant not found');
    
    this.plants.splice(index, 1);
    return true;
  }

  async getTodaysTasks() {
    await delay(200);
    return [...this.tasks].map(task => ({
      ...task,
      plantName: this.plants.find(p => p.id === task.plantId)?.nickname || 'Unknown Plant',
      timeAgo: this.getTimeAgo(new Date(task.scheduledDate))
    }));
  }

  async getCalendarTasks(date) {
    await delay(250);
    // Generate tasks for the current month
    const monthTasks = [];
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      if (Math.random() < 0.3) { // 30% chance of task each day
        const plant = this.plants[Math.floor(Math.random() * this.plants.length)];
        const taskTypes = ['water', 'fertilize', 'prune', 'repot'];
        const type = taskTypes[Math.floor(Math.random() * taskTypes.length)];
        
        monthTasks.push({
          id: `task-${Date.now()}-${Math.random()}`,
          plantId: plant?.id || 'plant-1',
          type,
          title: this.getTaskTitle(type),
          scheduledDate: new Date(d).toISOString(),
          plantName: plant?.nickname || 'Unknown Plant',
          completed: false,
          weatherAdjusted: Math.random() < 0.2
        });
      }
    }
    
    return monthTasks;
  }

  async completeTask(taskId) {
    await delay(200);
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].completedDate = new Date().toISOString();
    }
    return true;
  }

  async skipTask(taskId) {
    await delay(150);
    // Just mark as completed for now
    return this.completeTask(taskId);
  }

  async waterPlant(plantId) {
    await delay(200);
    const plant = this.plants.find(p => p.id === plantId);
    if (!plant) throw new Error('Plant not found');
    
    plant.lastWatered = new Date().toISOString();
    plant.waterLevel = Math.min(100, plant.waterLevel + 30);
    
    return plant;
  }

  async getWeatherData() {
    await delay(150);
    return { ...this.weather };
  }

  async identifyPlant(photo) {
    await delay(2000); // Simulate AI processing time
    
    // Return mock identification results
    const possibleSpecies = this.species.slice(0, 3).map(species => ({
      ...species,
      confidence: Math.floor(Math.random() * 30) + 70 // 70-99% confidence
    })).sort((a, b) => b.confidence - a.confidence);
    
    return possibleSpecies;
  }

  async diagnosePlant({ image, symptoms }) {
    await delay(3000); // Simulate AI diagnosis time
    
    const issues = [
      {
        issue: 'Overwatering',
        confidence: 85,
        causes: [
          'Soil is consistently waterlogged',
          'Poor drainage in pot',
          'Watering too frequently'
        ],
        treatments: [
          {
            title: 'Reduce watering frequency',
            description: 'Allow soil to dry between waterings. Check moisture 1-2 inches deep.',
            urgency: 'high'
          },
          {
            title: 'Improve drainage',
            description: 'Add drainage holes to pot or repot with well-draining soil mix.',
            urgency: 'medium'
          },
          {
            title: 'Remove affected roots',
            description: 'If roots are black and mushy, trim them and treat with fungicide.',
            urgency: 'high'
          }
        ]
      },
      {
        issue: 'Nutrient deficiency',
        confidence: 78,
        causes: [
          'Lack of fertilization',
          'Depleted soil nutrients',
          'pH imbalance affecting nutrient uptake'
        ],
        treatments: [
          {
            title: 'Apply balanced fertilizer',
            description: 'Use a balanced 10-10-10 fertilizer diluted to half strength.',
            urgency: 'medium'
          },
          {
            title: 'Test soil pH',
            description: 'Ensure pH is between 6.0-7.0 for optimal nutrient absorption.',
            urgency: 'low'
          }
        ]
      }
    ];
    
    const randomIssue = issues[Math.floor(Math.random() * issues.length)];
    return randomIssue;
  }

  getTaskTitle(type) {
    const titles = {
      water: 'Water plant',
      fertilize: 'Apply fertilizer',
      prune: 'Prune dead leaves',
      repot: 'Check if repotting needed'
    };
    return titles[type] || 'Care task';
  }

  getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
}

export const plantService = new PlantService();