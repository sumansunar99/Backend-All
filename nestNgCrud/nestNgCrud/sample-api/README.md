# My Project README

## Database Schema

```dbml
Table users {
  id int [pk, increment]
  username varchar(50) [not null]
  email varchar(255) [unique, not null]
  created_at timestamp
}

Table posts {
  id int [pk, increment]
  user_id int [ref: > users.id]
  title varchar(255) [not null]
  content text
  created_at timestamp
}