import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { redisClient } from 'src/config/redis';

@Injectable()
export class CharacterService {
  async getCharacters() {
    try {
      // Intentamos obtener los datos desde Redis
      
      const cachedData = await redisClient.get('charactersS');
      if (cachedData) {
        console.log('🟢 Datos obtenidos desde Redis');
        return JSON.parse(cachedData);
      }

      console.log('🔵 Datos obtenidos desde la API');
      // Si no hay caché, hacemos la petición a la API
      const response = await axios.get('https://rickandmortyapi.com/api/character');

      // Guardamos la respuesta en Redis por 60 segundos
      await redisClient.set('charactersS', JSON.stringify(response.data), {
        EX: 60,
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo datos:', error);
      throw new Error('No se pudo obtener los personajes');
    }
  }
}
