import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import PushNotification from 'react-native-push-notification';
import {Notification, NotificationProps} from '../services/notifications';

export interface PlantProps {
  id: number;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: number;
    repeat_every: string;
  };
  hour: string;
  dateTimeNotification: Date;
}

export interface StoragePlantProps {
  [id: string]: {
    data: PlantProps;
    notificationId: string;
  };
}

async function generateId() {
  const oldId = (await AsyncStorage.getItem('@plantmanager:ids')) || '-1';

  const newId = Number(oldId) + 1;
  await AsyncStorage.setItem('@plantmanager:ids', String(newId));
  return newId;
}

export async function savePlant(plant: PlantProps): Promise<void> {
  try {
    const nextTime = new Date(plant.dateTimeNotification);
    const now = new Date();

    const {times, repeat_every} = plant.frequency;

    if (repeat_every === 'week') {
      const interval = Math.trunc(7 / times);
      nextTime.setDate(now.getDate() + interval);
    } else {
      nextTime.setDate(nextTime.getDate() + 1);
    }

    const seconds = Math.abs(
      Math.ceil((now.getTime() - nextTime.getTime()) / 1000),
    );
    const notificationId = await generateId();

    const contentNotification = {
      content: {
        id: notificationId,
        title: 'Heey, 🌱',
        message: `Está na hora de cuidar da sua planta ${plant.name}`,
        seconds,
        repeatType: repeat_every,
      },
    } as NotificationProps;
    Notification(contentNotification);

    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};
    const newPlant = {
      [plant.id]: {
        data: plant,
        notificationId,
      },
    };

    await AsyncStorage.setItem(
      '@plantmanager:plants',
      JSON.stringify({...newPlant, ...oldPlants}),
    );
  } catch (error) {
    throw new Error(error);
  }
}

export async function loadPlant(): Promise<PlantProps[]> {
  try {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    const plantsSorted = Object.keys(plants)
      .map(plant => {
        return {
          ...plants[plant].data,
          hour: format(
            new Date(plants[plant].data.dateTimeNotification),
            'HH:mm',
          ),
        };
      })
      .sort((a, b) =>
        Math.floor(
          new Date(a.dateTimeNotification).getTime() / 1000 -
            Math.floor(new Date(b.dateTimeNotification).getTime() / 1000),
        ),
      );

    return plantsSorted;
  } catch (error) {
    throw new Error(error);
  }
}

export async function removePlant(id: string): Promise<void> {
  const data = await AsyncStorage.getItem('@plantmanager:plants');
  const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};
  PushNotification.cancelLocalNotifications({
    id: plants[id].notificationId,
  });

  delete plants[id];
  await AsyncStorage.setItem('@plantmanager:plants', JSON.stringify(plants));
}
