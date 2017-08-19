import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  static store(name: string, data: any) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(name, serialized);
    } catch (err) {
      console.log(err);
    }
  }

  static clear(name: string) {
    try {
      localStorage.removeItem(name);
    } catch (err) {
      console.log(err);
    }
  }

  static retrieve<T>(name: string): T | undefined {
    try {
      const serialized = localStorage.getItem(name);
      if (serialized === null || serialized === undefined || serialized === 'undefined') {
        return undefined;
      }

      return <T>JSON.parse(serialized);
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  store(name: string, data: any) {
    LocalStorageService.store(name, data);
  }

  clear(name: string) {
    LocalStorageService.clear(name);
  }

  retrieve<T>(name: string): T | undefined {
    return LocalStorageService.retrieve<T>(name);
  }
}
