export interface BehanceProject {
  id: string;
  name: string;
  description: string;
  url: string;
  covers: {
    original: string;
    '404': string;
    '202': string;
  };
  tags: string[];
  fields: string[];
  published_on: number;
  modified_on: number;
  stats: {
    views: number;
    appreciations: number;
    comments: number;
  };
}

export interface BehanceApiResponse {
  projects: BehanceProject[];
  http_code: number;
}

/**
 * Fetches projects from Behance API
 * Note: This requires BEHANCE_API_KEY environment variable to be set
 */
export async function fetchBehanceProjects(username: string): Promise<BehanceProject[]> {
  const apiKey = import.meta.env.VITE_BEHANCE_API_KEY;
  
  if (!apiKey) {
    console.warn("Behance API key not configured");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.behance.net/v2/users/${username}/projects?api_key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Behance API error: ${response.status} ${response.statusText}`);
    }

    const data: BehanceApiResponse = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error("Failed to fetch Behance projects:", error);
    return [];
  }
}

/**
 * Transforms Behance project data to our portfolio item format
 */
export function transformBehanceProject(project: BehanceProject) {
  return {
    behanceId: project.id,
    title: project.name,
    description: project.description || "",
    imageUrl: project.covers?.original || project.covers?.['404'] || "",
    projectUrl: project.url,
    tags: project.tags || [],
    category: project.fields?.[0] || "Design",
    featured: false,
  };
}

/**
 * Fetches and transforms Behance projects for a user
 */
export async function getBehancePortfolio(username: string = "spandanmajumder3") {
  try {
    const projects = await fetchBehanceProjects(username);
    return projects.map(transformBehanceProject);
  } catch (error) {
    console.error("Error getting Behance portfolio:", error);
    return [];
  }
}

/**
 * Triggers manual sync with Behance (admin only)
 */
export async function triggerBehanceSync(token: string): Promise<boolean> {
  try {
    const response = await fetch("/api/portfolio/sync", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to trigger Behance sync:", error);
    return false;
  }
}

/**
 * Get Behance profile URL
 */
export function getBehanceProfileUrl(username: string = "spandanmajumder3"): string {
  return `https://www.behance.net/${username}`;
}

/**
 * Extract username from Behance URL
 */
export function extractBehanceUsername(url: string): string | null {
  const match = url.match(/behance\.net\/([^\/\?]+)/);
  return match ? match[1] : null;
}

/**
 * Check if a project is from Behance
 */
export function isBehanceProject(project: any): boolean {
  return !!(project.behanceId || project.projectUrl?.includes("behance.net"));
}

/**
 * Get project thumbnail with fallback
 */
export function getProjectThumbnail(project: any, size: '202' | '404' | 'original' = '404'): string {
  if (project.imageUrl) {
    return project.imageUrl;
  }

  // Fallback to a placeholder image
  return `https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`;
}
