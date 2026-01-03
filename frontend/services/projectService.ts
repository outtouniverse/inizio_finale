/**
 * Project/Idea Service
 * Handles CRUD operations for projects/ideas with backend API
 */

import { Project, IdeaContext } from '../types';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface ProjectResponse {
  success: boolean;
  data?: {
    project?: Project;
    projects?: Project[];
  };
  message?: string;
}

class ProjectService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all projects for the authenticated user
   */
  async getProjects(): Promise<Project[]> {
    try {
      const response = await this.request('/projects');

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch projects');
      }

      return response.data?.projects || [];
    } catch (error) {
      console.error('Get projects error:', error);
      throw error;
    }
  }

  /**
   * Get a single project by ID
   */
  async getProject(id: string): Promise<Project> {
    try {
      const response = await this.request(`/projects/${id}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch project');
      }

      return response.data?.project!;
    } catch (error) {
      console.error('Get project error:', error);
      throw error;
    }
  }

  /**
   * Create a new project
   */
  async createProject(ideaContext: IdeaContext): Promise<Project> {
    try {
      // Validate required fields before sending
      if (!ideaContext.description || ideaContext.description.trim().length === 0) {
        throw new Error('Project description is required');
      }

      if (!ideaContext.industry) {
        throw new Error('Project industry is required');
      }

      // Map FounderStage to Project stage
      const stageMapping: Record<string, string> = {
        'IDEA_FOG': 'IDEA',
        'VALIDATION': 'VALIDATION',
        'NAMING': 'VALIDATION', // Map to validation as it's part of the process
        'BUILDING': 'BUILDING',
        'GROWTH': 'GROWTH'
      };

      const mappedStage = stageMapping[ideaContext.stage] || 'IDEA';

      const projectData = {
        name: `Untitled ${ideaContext.industry} Project`,
        pitch: ideaContext.description.trim(),
        industry: ideaContext.industry,
        stage: mappedStage,
        userGoal: ideaContext.userGoal || '',
        constraints: ideaContext.constraints || '',
        tags: [ideaContext.industry],
      };

      console.log('Sending project data:', projectData);

      const response = await this.request('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });

      if (!response.success) {
        console.error('Backend response error:', response);
        throw new Error(response.message || 'Failed to create project');
      }

      console.log('Project created successfully:', response.data?.project);
      return response.data?.project!;
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  /**
   * Update a project
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const response = await this.request(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to update project');
      }

      return response.data?.project!;
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    try {
      const response = await this.request(`/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  }

  /**
   * Duplicate a project
   */
  async duplicateProject(id: string): Promise<Project> {
    try {
      const response = await this.request(`/projects/${id}/duplicate`, {
        method: 'POST',
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to duplicate project');
      }

      return response.data?.project!;
    } catch (error) {
      console.error('Duplicate project error:', error);
      throw error;
    }
  }

  /**
   * Export project data
   */
  async exportProject(id: string, format: 'json' | 'pdf' = 'json'): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseURL}/projects/${id}/export?format=${format}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to export project');
      }

      return response.blob();
    } catch (error) {
      console.error('Export project error:', error);
      throw error;
    }
  }

  /**
   * Get project statistics
   */
  async getProjectStats(): Promise<any> {
    try {
      const response = await this.request('/projects/stats');

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch project stats');
      }

      return response.data;
    } catch (error) {
      console.error('Get project stats error:', error);
      throw error;
    }
  }

  /**
   * Search projects
   */
  async searchProjects(query: string, filters?: any): Promise<Project[]> {
    try {
      const searchParams = new URLSearchParams({ q: query, ...filters });
      const response = await this.request(`/projects/search?${searchParams}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to search projects');
      }

      return response.data?.projects || [];
    } catch (error) {
      console.error('Search projects error:', error);
      throw error;
    }
  }

  /**
   * Sync project with latest changes
   */
  async syncProject(id: string): Promise<Project> {
    try {
      const response = await this.request(`/projects/${id}/sync`, {
        method: 'POST',
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to sync project');
      }

      return response.data?.project!;
    } catch (error) {
      console.error('Sync project error:', error);
      throw error;
    }
  }

  /**
   * Batch operations
   */
  async batchUpdate(updates: Array<{ id: string; changes: Partial<Project> }>): Promise<Project[]> {
    try {
      const response = await this.request('/projects/batch', {
        method: 'PUT',
        body: JSON.stringify({ updates }),
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to batch update projects');
      }

      return response.data?.projects || [];
    } catch (error) {
      console.error('Batch update error:', error);
      throw error;
    }
  }

  async batchDelete(ids: string[]): Promise<void> {
    try {
      const response = await this.request('/projects/batch', {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to batch delete projects');
      }
    } catch (error) {
      console.error('Batch delete error:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const projectService = new ProjectService();
export default projectService;
