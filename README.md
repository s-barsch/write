# ✏️ Write

Offline-first writing app

[![WRITE screenshot](https://stefba.com/write-frame.jpg)](https://write.stefba.com/)

View the **demo** here: [write.stefba.com](https://write.stefba.com/).

## Installation

*Note: you need to have memcached installed and running.*

Create production built:

`pnpm install`\
`pnpm build`

Compile and run the server:

`go build; ./write`

Go to: `http://localhost:8231/`

### Purpose

I built this app to take notes on the go and sync them with my server. It is fully operational without a network connection.

### See also

**[org](https://github.com/stefba/org)** is its sister app for sorting, renaming, and dealing with a directories.
