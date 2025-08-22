import { useState, useEffect } from 'react';

// Define the interface for an Album to ensure type safety.
interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  photoCount: number;
  date: string;
  category: string;
  likes: number;
  comments: number;
}

// Mock dataset to start with if no data is found in localStorage.
const initialMockAlbums: Album[] = [
  {
    id: '1',
    title: 'Graduation Day',
    description: 'Celebrating our achievements and new beginnings',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=300&fit=crop',
    photoCount: 156,
    date: 'May 2024',
    category: 'Events',
    likes: 89,
    comments: 23
  },
  {
    id: '2',
    title: 'Campus Life',
    description: 'Everyday moments that made our journey special',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
    photoCount: 203,
    date: 'Throughout 2024',
    category: 'Lifestyle',
    likes: 124,
    comments: 45
  },
  {
    id: '3',
    title: 'Study Sessions',
    description: 'Late nights and coffee-fueled learning',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
    photoCount: 78,
    date: 'Spring 2024',
    category: 'Academic',
    likes: 67,
    comments: 12
  },
  {
    id: '4',
    title: 'Sports & Activities',
    description: 'Team spirit and athletic achievements',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    photoCount: 134,
    date: 'Fall 2024',
    category: 'Sports',
    likes: 156,
    comments: 34
  },
  {
    id: '5',
    title: 'Friends & Laughter',
    description: 'The people who made every day brighter',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    photoCount: 189,
    date: 'All Year',
    category: 'Social',
    likes: 203,
    comments: 67
  },
  {
    id: '6',
    title: 'Department Events',
    description: 'Academic celebrations and department milestones',
    coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop',
    photoCount: 92,
    date: '2024',
    category: 'Academic',
    likes: 78,
    comments: 19
  }
];

// Generates a unique ID for a new album.
const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

/**
 * A custom React hook for managing a collection of photo albums.
 * It provides the album data and functions to perform CRUD operations.
 * The state is persisted in localStorage for demonstration purposes.
 * It also includes a loading state to prevent hydration errors.
 *
 * @returns {{
 * albums: Album[],
 * isLoaded: boolean,
 * addAlbum: (title: string, description: string) => void,
 * deleteAlbum: (id: string) => void,
 * updateAlbum: (id: string, updatedFields: Partial<Album>) => void
 * }} An object containing the albums state, loading state, and management functions.
 */
export const useAlbums = () => {
  // albums is initialized as an empty array to match the server-side render.
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use useEffect to load data from localStorage after the component mounts on the client.
  useEffect(() => {
    try {
      const savedAlbums = localStorage.getItem('albums');
      if (savedAlbums) {
        setAlbums(JSON.parse(savedAlbums));
      } else {
        // If no saved data, use the initial mock data and save it.
        setAlbums(initialMockAlbums);
        localStorage.setItem('albums', JSON.stringify(initialMockAlbums));
      }
    } catch (error) {
      console.error("Failed to load albums from localStorage", error);
      setAlbums(initialMockAlbums); // Fallback to initial data on error.
    } finally {
      setIsLoaded(true); // Set loaded to true once data is retrieved or initialized.
    }
  }, []);

  // Use another useEffect to synchronize the state with localStorage whenever albums change.
  useEffect(() => {
    if (isLoaded) { // Only save to localStorage after the initial load to prevent overwriting.
      localStorage.setItem('albums', JSON.stringify(albums));
    }
  }, [albums, isLoaded]);

  /**
   * Adds a new album to the collection.
   * @param {string} title The title of the new album.
   * @param {string} description The description of the new album.
   */
  const addAlbum = (title: string, description: string) => {
    if (!title) {
      console.error('Album title is required.');
      return;
    }
    const newAlbum: Album = {
      id: generateId(),
      title,
      description,
      coverImage: 'https://placehold.co/400x300/e2e8f0/64748b?text=New+Album',
      photoCount: 0,
      date: new Date().toLocaleDateString(),
      category: 'User Created',
      likes: 0,
      comments: 0
    };
    setAlbums(prev => [...prev, newAlbum]);
  };

  /**
   * Deletes an album from the collection by its ID.
   * @param {string} id The ID of the album to delete.
   */
  const deleteAlbum = (id: string) => {
    setAlbums(prev => prev.filter(album => album.id !== id));
  };
  
  /**
   * Updates an existing album with new data.
   * @param {string} id The ID of the album to update.
   * @param {Partial<Album>} updatedFields An object containing the fields to update.
   */
  const updateAlbum = (id: string, updatedFields: Partial<Album>) => {
    setAlbums(prev => prev.map(album => 
      album.id === id ? { ...album, ...updatedFields } : album
    ));
  };

  return {
    albums,
    isLoaded,
    addAlbum,
    deleteAlbum,
    updateAlbum
  };
};
