const imageCache = {
  cache: {} as { [key: string]: Promise<boolean> | boolean },
  read(src: string) {
    if (!this.cache[src]) {
      this.cache[src] = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          this.cache[src] = true;
          resolve(this.cache[src]);
        };
        img.src = src;
      });
    }
    if (this.cache[src] instanceof Promise) {
      throw this.cache[src];
    }
    return this.cache[src];
  },
};

export default imageCache;
