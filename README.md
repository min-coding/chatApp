# chatApp

What do you get to learn by building this app?

1. Form with upload file (profile picture)

A good practice of storing picture : Store a reference to the files on a database and store the actual files on disk.
Because it's bad for the performance

- You have to validate img first
- Set image preview URL.createObjectURL(file)
-

2. Why do we need to use middleware (.json() and .urlencoded)

You NEED express.json() and express.urlencoded() for POST and PUT requests, because in both these requests you are sending data (in the form of some data object) to the server and you are asking the server to accept or store that data (object), which is enclosed in the body (i.e. req.body) of that (POST or PUT) Request

3. What is CORS
   CORS is a mechanism that allows the website on one URL to request data for a different URL.

Normally the browser implements the “same origin policy” which allows us to request data from its own URL, but block anything from external URL, unless certain conditions are met.
