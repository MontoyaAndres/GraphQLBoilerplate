**update all packages "Yarn"**
- yarn upgrade --latest

## Create Twitter App

https://www.youtube.com/watch?v=lKvV_0xZWCg&index=28&list=PLN3n1USn4xlky9uj6wOhfsPez7KZOqm2V

## Errors

I don't know if that works:

TS_NODE_FILES=true NODE_ENV=test jest --watch --no-cache --runInBand

---

Client does not support authentication protocol requested by server; consider upgrading MySQL client'

**Solution:** ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourRootPassword';

https://github.com/mysqljs/mysql/pull/1962#issuecomment-405859181
