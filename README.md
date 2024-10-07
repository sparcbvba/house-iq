# house-iq management platform

install node js https://nodejs.org/en/download/package-manager

more detail: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

open command prompt or Terminal ls to basepath and run
```
npm i
```

create database:
```
npm run migrate
```

create users:
```
npm run create-users
```

start webserver
```
npm run start
```


webserver runs at http://localhost:3000


## extra actions
drop tables (you may need to uncomment, or comment, drop statements in './drop.ts')
```
npm run drop
```

run 
```
npm run migrate
```
again to recreate database and
```
npm run create-users
```
to create users again.

## Users

| email  | password |
| ------------- |:-------------:|
| admin@house.iq      | test     |
| home_owner@house.iq      | test     |
| home_viewer@house.iq      | test     |
| reporter@house.iq      | test     |

