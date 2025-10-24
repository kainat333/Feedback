// utils/otpStore.js
class OTPStore {
  constructor() {
    this.store = new Map();
  }

  set(email, data) {
    this.store.set(email, data);
  }

  get(email) {
    return this.store.get(email);
  }

  delete(email) {
    this.store.delete(email);
  }

  has(email) {
    return this.store.has(email);
  }

  // Clean up expired OTPs (optional)
  cleanup() {
    const now = Date.now();
    for (const [email, data] of this.store.entries()) {
      if (now > data.expiresAt) {
        this.store.delete(email);
      }
    }
  }
}

module.exports = new OTPStore();
