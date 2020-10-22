# ✏️ Write

Offline-first writing app

[<img src="https://stefba.com/write-screen4.jpg?v=3" alt="Write screenshot">](https://write.stefba.com/)

View the demo here: [write.stefba.com](https://write.stefba.com/)

### Installation

*Note: you need to have memcached installed and running.*

Create production built:

`yarn build`

Start the server:

`go run server/*go`

Go to: http://localhost:8231/

### Purpose

I built this app to take notes on the go and sync them with my server. It is fully operational without a network connection.

It was important to me to have the data live on my infrastructure, and have timestamps as filenames.

### See also

**[org](https://github.com/stefba/org)** is its sister app for sorting, renaming, and dealing with a directories.
