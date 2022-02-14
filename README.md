# Northcoders News API

## Environment Setup

This repository does not contain the necessary .env files that set the value of PGDATABASE to a specific database, as they are part of the gitignore and will only be stored locally. You will need to create two .env files:

_.env.development_

```
PGDATABASE=nc_news
```

_.env.test_

```
PGDATABASE=nc_news_test
```
