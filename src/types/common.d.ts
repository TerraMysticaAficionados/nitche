//  Make a key, list of keys optional
export declare type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T>, K>;

//  Make a key, list of keys required
//  Ex (assume "File" is a type with some optional fields):
//    WithRequired<File, "path"|"name"|"extension"> 
export declare type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export interface IManager<T> {
  toSafeObject(object:T|null|undefined): Promise<Partial<T>|null>
}
