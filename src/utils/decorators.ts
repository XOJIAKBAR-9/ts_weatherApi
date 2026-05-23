/**
 * Decorators module — provides class and method decorators.
 * Demonstrates the decorator pattern in TypeScript.
 * @module utils/decorators
 */

/**
 * Method decorator that logs method calls to the console.
 * Logs the method name, arguments, and return value for debugging purposes.
 * @param target - The prototype of the class (or constructor for static methods)
 * @param propertyKey - The name of the decorated method
 * @param descriptor - The property descriptor for the method
 * @returns The modified property descriptor
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor.value = function (...args: any[]) {
    console.log(`[LogMethod] Calling ${propertyKey} with args:`, args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = originalMethod.apply(this, args);
    console.log(`[LogMethod] ${propertyKey} returned:`, result);
    return result;
  };

  return descriptor;
}

/**
 * Class decorator that marks a class as a service.
 * Logs the registration of the service at class definition time.
 * @param constructor - The constructor function of the decorated class
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function Service(constructor: Function): void {
  console.log(`[Service] Registered service: ${constructor.name}`);
}
