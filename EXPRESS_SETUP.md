# Express.js Integration for PokeHUB

This document explains how to use the Express.js backend that has been integrated with your React + Vite project.

## 🚀 Quick Start

### 1. Install Dependencies
All necessary dependencies have been installed:
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `nodemon` - Development server with auto-restart
- `concurrently` - Run multiple commands simultaneously

### 2. Available Scripts

```bash
# Run only the React frontend (Vite dev server)
npm run dev

# Run only the Express backend server
npm run dev:server

# Run both frontend and backend simultaneously
npm run dev:full

# Build the React app for production
npm run build

# Start the production server
npm start
```

### 3. Environment Configuration

The `.env` file has been created with the following configuration:
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 📁 Project Structure

```
PokeHUB-Website/
├── server/
│   ├── index.js          # Main Express server
│   └── routes/
│       └── pokemon.js    # Pokemon API routes
├── src/
│   ├── services/
│   │   └── api.ts        # API service for React
│   └── components/
│       └── PokemonAPIExample.tsx  # Example component
├── .env                  # Environment variables
├── nodemon.json         # Nodemon configuration
└── package.json         # Updated with new scripts
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### Pokemon Endpoints
- `GET /api/pokemon` - Get all Pokemon (with optional query parameters)
  - Query params: `type`, `limit`, `offset`
- `GET /api/pokemon/:id` - Get Pokemon by ID
- `GET /api/pokemon/search/:name` - Search Pokemon by name
- `POST /api/pokemon` - Create new Pokemon

### Example API Calls

```javascript
// Get all Pokemon
fetch('http://localhost:3001/api/pokemon')

// Get Pokemon with pagination
fetch('http://localhost:3001/api/pokemon?limit=5&offset=0')

// Filter by type
fetch('http://localhost:3001/api/pokemon?type=fire')

// Get specific Pokemon
fetch('http://localhost:3001/api/pokemon/1')

// Search Pokemon
fetch('http://localhost:3001/api/pokemon/search/char')
```

## 🎯 Using the API in React

### 1. Import the API Service
```typescript
import { apiService, Pokemon } from '../services/api';
```

### 2. Fetch Pokemon Data
```typescript
const [pokemon, setPokemon] = useState<Pokemon[]>([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await apiService.getPokemon({ limit: 10 });
      setPokemon(response.data);
    } catch (error) {
      console.error('Failed to fetch Pokemon:', error);
    }
  };
  
  fetchData();
}, []);
```

### 3. Search Pokemon
```typescript
const searchPokemon = async (searchTerm: string) => {
  try {
    const response = await apiService.searchPokemon(searchTerm);
    setPokemon(response.data);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

## 🛠️ Development Workflow

1. **Start both servers**: `npm run dev:full`
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

2. **Test the API**: Visit http://localhost:3001/api/health

3. **Use the example component**: Import and use `PokemonAPIExample` in your React app

## 🔧 Customization

### Adding New Routes
1. Create new route files in `server/routes/`
2. Import and use them in `server/index.js`
3. Add corresponding methods to `src/services/api.ts`

### Environment Variables
Add new variables to `.env` and access them in your server code:
```javascript
const customValue = process.env.CUSTOM_VARIABLE;
```

### Database Integration
The current setup uses mock data. To integrate a real database:
1. Install your preferred database driver (e.g., `mongoose` for MongoDB)
2. Create database models in `server/models/`
3. Update routes to use database operations

## 🚀 Production Deployment

1. Build the React app: `npm run build`
2. Set `NODE_ENV=production` in your environment
3. Start the server: `npm start`

The Express server will serve the built React app in production mode.

## 📝 Notes

- The server includes CORS configuration for development
- Error handling middleware is included
- The API includes basic validation
- Mock Pokemon data is provided for testing
- TypeScript types are available for the API responses

## 🐛 Troubleshooting

- **Port conflicts**: Change the PORT in `.env` if 3001 is already in use
- **CORS issues**: Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- **API not responding**: Check if the server is running on the correct port
- **TypeScript errors**: Make sure all dependencies are properly installed
