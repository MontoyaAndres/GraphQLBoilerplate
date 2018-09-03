https://www.youtube.com/watch?v=pvjOOApb6nk&list=PLN3n1USn4xlky9uj6wOhfsPez7KZOqm2V&index=22

**update all packages "Yarn"**
- yarn upgrade --latest

## Errors

Client does not support authentication protocol requested by server; consider upgrading MySQL client'

**Solution:** ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourRootPassword';

https://github.com/mysqljs/mysql/pull/1962#issuecomment-405859181
