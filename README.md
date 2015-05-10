## coding style

```
let myVar = 10;

let myObj = {
  myProp: 1
};

function myFunc (myParam, ...args) {}

let aFunc = (x) => x;

let r = myFunc(1, 2, 3);

class MyClass {}

const MY_CONST = 1;

if (blah blah) {

}
```


## Message format

### calling

```
{
  "def": {"role": "verification", "cmd": "isCertified"},
  "params": ["some.one@address.com"]
}
```

roles
  authentication
    register
    registerViaFacebook, etc
    login
    loginViaFacebook, etc
  verification
    isCertified
  warning
entities
  user
    create
    get
    delete
    find
    update
  organistations
    create
    get
    delete
    find
    update
