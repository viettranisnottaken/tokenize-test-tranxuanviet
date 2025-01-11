type ThrottleOptions = {
  leading?: boolean;
  trailing?: boolean;
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  options: ThrottleOptions = { leading: true, trailing: false }
) => {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    const invoke = () => {
      lastCall = options.leading === false ? 0 : now;
      timeout = null;
      func(...args);
    };

    if (remaining <= 0 || options.leading === false && !timeout) {
      if (timeout) clearTimeout(timeout);
      invoke();
    } else if (options.trailing && !timeout) {
      timeout = setTimeout(() => {
        invoke();
      }, remaining);
    }
  };
};
