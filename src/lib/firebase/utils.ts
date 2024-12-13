import { Timestamp } from 'firebase/firestore';

export const convertFirestoreData = (data: any): any => {
  if (!data) return data;
  
  if (data instanceof Timestamp) {
    return {
      seconds: data.seconds,
      nanoseconds: data.nanoseconds
    };
  }

  if (Array.isArray(data)) {
    return data.map(item => convertFirestoreData(item));
  }

  if (typeof data === 'object') {
    const converted: { [key: string]: any } = {};
    Object.keys(data).forEach(key => {
      converted[key] = convertFirestoreData(data[key]);
    });
    return converted;
  }

  return data;
};