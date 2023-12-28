import crypto from 'crypto';

export const generateRefreshToken = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            const refreshToken = buffer.toString('hex');
            resolve(refreshToken);
          }
        });
      });
}