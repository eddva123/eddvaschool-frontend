// Simple toast notification utility
export const toast = {
  success: (message) => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'success', id: Date.now() },
    });
    window.dispatchEvent(event);
  },

  error: (message) => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'error', id: Date.now() },
    });
    window.dispatchEvent(event);
  },

  warning: (message) => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'warning', id: Date.now() },
    });
    window.dispatchEvent(event);
  },

  info: (message) => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'info', id: Date.now() },
    });
    window.dispatchEvent(event);
  },
};
