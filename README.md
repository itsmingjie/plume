# Plume
An adaptation of Hack MIT's [Quill](https://github.com/techx/quill) platform for [McDonogh Hacks I](https://mcdonoghhacks.org). Hosted on Heroku.

# Setup

### Requirements
| Requirement                                 | Version |
| ------------------------------------------- | ------- |
| [GCC 4.6](https://gcc.gnu.org) | `4.6+` |
| [Node.js](http://nodejs.org)                | `8.0+`  |
| [MongoDB](www.mongodb.com/) | `3.0+`  |

> _Updating to the latest releases is recommended_.

Run the following commands to check the current installed versions:

```shell
gcc --version
node -v
mongo --version
```
How to upgrade to latest releases:
- GCC: https://wiki.gentoo.org/wiki/Upgrading_GCC
- Node.js: https://nodejs.org/en/download/
- MongoDB: https://docs.mongodb.com/manual/administration/install-community/

### Deploying locally
Getting a local instance of Quill up and running takes less than 5 minutes! Start by setting up the database. Ideally, you should run MongoDB as a daemon with a secure configuration (with most linux distributions, you should be able to install it with your package manager, and it'll be set up as a daemon). Although not recommended for production, when running locally for development, you could do it like this

```
mkdir db
mongod --dbpath db --bind_ip 127.0.0.1
```

Install the necessary dependencies:
```
npm install
bower install
npm run config
```

Edit the configuration file in `.env` for your setup, and then run the application:
```
gulp server
```

# Contributing
Contributions to Plume are welcome and appreciated! Please take a look at [`CONTRIBUTING.md`][contribute] first.

# License
Copyright (c) 2015-2016 Edwin Zhang (https://github.com/ehzhang). Released under AGPLv3. See [`LICENSE.txt`][license] for details.

Modified by Mingjie Jiang (https://github.com/itsmingjie) for McDonogh Hacks I.