// Data client — reads from local JSON files instead of Base44
// Projects
import projectsData from '../data/projects.json';
import settingsData from '../data/settings.json';

// --- Projects ---
export const ProjectsAPI = {
  // Get all visible projects sorted by sortOrder
  getAll: () => {
    return [...projectsData]
      .filter(p => p.isVisible !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },

  // Get visible projects filtered by category
  getByCategory: (category) => {
    return [...projectsData]
      .filter(p => p.isVisible !== false && p.category === category)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },

  // Get featured visible projects (shown on home page)
  getFeatured: () => {
    const featured = [...projectsData]
      .filter(p => p.isVisible !== false && p.featured === true)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    // Fallback: if no featured projects, return all visible
    if (featured.length === 0) {
      return ProjectsAPI.getAll();
    }
    return featured;
  },
};

// --- Settings ---
export const SettingsAPI = {
  get: () => settingsData,
  getValue: (key, defaultValue = '') => settingsData[key] ?? defaultValue,
};
