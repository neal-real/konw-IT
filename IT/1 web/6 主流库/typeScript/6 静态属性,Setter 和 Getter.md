## getter and setter

- 休息

````ts
class Person {
  constructor(private _name: string) {}
  get name() {
    return this._name + ' lee';
  }
  set name(name: string) {
    const realName = name.split(' ')[0];
    this._name = realName;
  }
}

const person = new Person('dell');
console.log(person.name);
````

