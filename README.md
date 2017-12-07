(C) copyright sambit Kumar padhy


**Start MongoDB server**

```
sudo service mongod start
```

**Check MongoDB server status**

```
sudo service mongod status
```

**Go to MongoDB shell**

```
mongod
```

**Show databases**

```
show dbs
```

**Create database named "test"**

```
use test
```

**Create collection(table) named "users"**

```
> db.users.insert({name:"Apple", amount:88, description:"family"})
> db.users.insert({name:"Orange", amount:77, description:"home"})
> db.users.insert({name:"Biscuits", amount:65, description:"personal"})
```

**Query collection**

```
> db.users.find().pretty()
{
	"_id" : ObjectId("5946517675f3fc671900a6c1"),
	"name" : "Apple",
	"amount" : 88,
	"description" : "family"
}
{
	"_id" : ObjectId("5946517f75f3fc671900a6c2"),
	"name" : "Orange",
	"amount" : 77,
	"description" : "home"
}
{
	"_id" : ObjectId("5946518375f3fc671900a6c3"),
	"name" : "Biscuits",
	"amount" : 65,
	"description" : "personal"
}
```
