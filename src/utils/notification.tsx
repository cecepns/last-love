import { ENV } from '.';

export const pushNotification = async (rawBody = {}) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${ENV.SERVER_KEY}`,
      },
      body: JSON.stringify({
        ...rawBody,
        priority: 'high',
      }),
    };
    const raw = await fetch(
      ENV.FIREBASE_PUSH_NOTIFICATION_API,
      options
    );
    const res = await raw.json();
    return res;
  } catch (e) {
    console.log('sendNotification error', e);
  }
};
