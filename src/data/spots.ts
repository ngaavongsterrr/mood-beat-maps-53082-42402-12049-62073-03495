export type SpotCategory = 'peaceful' | 'social' | 'scenic';

export interface Playlist {
  id: string;
  name: string;
  spotifyUrl: string;
  category: SpotCategory;
}

export interface Spot {
  id: string;
  name: string;
  description: string;
  category: SpotCategory;
  latitude: number;
  longitude: number;
  playlists: Playlist[];
  image: string;
}

export const spots: Spot[] = [
  {
    id: '1',
    name: 'Prinsentuin Park',
    description: 'A serene Renaissance garden perfect for peaceful contemplation and relaxation.',
    category: 'peaceful',
    latitude: 53.2012,
    longitude: 5.7889,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop',
    playlists: [
      {
        id: 'p1',
        name: 'Garden Serenity',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4PP3DA4J0N8',
        category: 'peaceful'
      },
      {
        id: 'p2',
        name: 'Nature Sounds',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp',
        category: 'peaceful'
      }
    ]
  },
  {
    id: '1a',
    name: 'Rengerspark',
    description: 'Beautiful park near NHL Stenden campus, perfect for studying outdoors or peaceful walks.',
    category: 'peaceful',
    latitude: 53.2028,
    longitude: 5.7835,
    image: 'https://images.unsplash.com/photo-1519003300449-424ad0405076?w=800&auto=format&fit=crop',
    playlists: [
      {
        id: 'p1',
        name: 'Garden Serenity',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4PP3DA4J0N8',
        category: 'peaceful'
      },
      {
        id: 'p2',
        name: 'Nature Sounds',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp',
        category: 'peaceful'
      }
    ]
  },
  {
    id: '1b',
    name: 'Bruze Cafe Benches',
    description: 'Cozy outdoor seating area near Bruze cafe, great spot for socializing with coffee.',
    category: 'social',
    latitude: 53.2022,
    longitude: 5.7830,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop',
    playlists: [
      {
        id: 'p3',
        name: 'Coffee Shop Vibes',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4pUKG1kS0Ac',
        category: 'social'
      },
      {
        id: 'p4',
        name: 'Social Gathering',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWSf2RDTDayIx',
        category: 'social'
      }
    ]
  },
  {
    id: '1c',
    name: 'Windmill Building Garden',
    description: 'Scenic spot with windmill views, ideal for contemplative breaks between classes.',
    category: 'scenic',
    latitude: 53.2034,
    longitude: 5.7842,
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&auto=format&fit=crop',
    playlists: [
      {
        id: 'p5',
        name: 'Epic Views',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO',
        category: 'scenic'
      },
      {
        id: 'p6',
        name: 'Adventure Time',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ',
        category: 'scenic'
      }
    ]
  },
  {
    id: '1d',
    name: 'NHL Campus Courtyard',
    description: 'Central quad with benches and sitting areas, perfect for group study or relaxing.',
    category: 'social',
    latitude: 53.2025,
    longitude: 5.7838,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop',
    playlists: [
      {
        id: 'p3',
        name: 'Coffee Shop Vibes',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4pUKG1kS0Ac',
        category: 'social'
      },
      {
        id: 'p4',
        name: 'Social Gathering',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWSf2RDTDayIx',
        category: 'social'
      }
    ]
  },
  {
    id: '2',
    name: 'Blokhuispoort',
    description: 'Historic former prison transformed into a vibrant cultural hub with cafes and events.',
    category: 'social',
    latitude: 53.1998,
    longitude: 5.7845,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop',
    playlists: [
      {
        id: 'p3',
        name: 'Coffee Shop Vibes',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4pUKG1kS0Ac',
        category: 'social'
      },
      {
        id: 'p4',
        name: 'Social Gathering',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWSf2RDTDayIx',
        category: 'social'
      }
    ]
  },
  {
    id: '3',
    name: 'Oldehove Tower',
    description: 'The iconic leaning tower offering stunning panoramic views of Leeuwarden.',
    category: 'scenic',
    latitude: 53.2015,
    longitude: 5.7925,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop',
    playlists: [
      {
        id: 'p5',
        name: 'Epic Views',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO',
        category: 'scenic'
      },
      {
        id: 'p6',
        name: 'Adventure Time',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ',
        category: 'scenic'
      }
    ]
  },
  {
    id: '4',
    name: 'Fries Museum',
    description: 'Modern museum showcasing Frisian culture, art, and history.',
    category: 'peaceful',
    latitude: 53.2020,
    longitude: 5.7880,
    image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&auto=format&fit=crop',
    playlists: [
      {
        id: 'p7',
        name: 'Classical Focus',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWEJlAGA9gs0',
        category: 'peaceful'
      },
      {
        id: 'p8',
        name: 'Museum Ambience',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX7K31D69s4M1',
        category: 'peaceful'
      }
    ]
  },
  {
    id: '5',
    name: 'Grote Kerkstraat',
    description: 'Bustling shopping street lined with boutiques, restaurants, and local charm.',
    category: 'social',
    latitude: 53.2005,
    longitude: 5.7895,
    image: 'https://images.unsplash.com/photo-1519003300449-424ad0405076?w=800&auto=format&fit=crop',
    playlists: [
      {
        id: 'p9',
        name: 'Shopping Beats',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdPec7aLTmlC',
        category: 'social'
      },
      {
        id: 'p10',
        name: 'Urban Energy',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUsuxWHRQd',
        category: 'social'
      }
    ]
  },
  {
    id: '6',
    name: 'Potmarge Lake',
    description: 'Tranquil waterfront perfect for walks, picnics, and sunset watching.',
    category: 'scenic',
    latitude: 53.1985,
    longitude: 5.7910,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
    playlists: [
      {
        id: 'p11',
        name: 'Sunset Chill',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS',
        category: 'scenic'
      },
      {
        id: 'p12',
        name: 'Lakeside Lounge',
        spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp',
        category: 'scenic'
      }
    ]
  }
];

export const getCategoryColor = (category: SpotCategory): string => {
  switch (category) {
    case 'peaceful':
      return 'hsl(var(--peaceful))';
    case 'social':
      return 'hsl(var(--social))';
    case 'scenic':
      return 'hsl(var(--scenic))';
  }
};

export const getCategoryLabel = (category: SpotCategory): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};
